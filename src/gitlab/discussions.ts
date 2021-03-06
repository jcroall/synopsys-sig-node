import {DiscussionSchema} from "@gitbeaker/core/dist/types/templates/ResourceDiscussions";
import {Gitlab} from "@gitbeaker/node";
import {logger} from "../SIGLogger";
import axios from "axios";

export async function gitlabGetDiscussions(gitlab_url: string, gitlab_token: string, project_id: string, merge_request_iid: number): Promise<DiscussionSchema[]> {
    const api = new Gitlab({ host: gitlab_url, token: gitlab_token })

    logger.debug(`Getting merge request #${merge_request_iid} in project #${project_id}`)
    logger.debug(`GITLAB_TOKEN=${gitlab_token} GITLAB_URL=${gitlab_url}`)
    let merge_request = await api.MergeRequests.show(project_id, merge_request_iid)
    logger.debug(`Merge Request title is ${merge_request.title}`)

    logger.debug(`Merge request SHA is ${merge_request.sha}`)

    let discussions = await api.MergeRequestDiscussions.all(project_id, merge_request_iid)
    for (const discussion of discussions) {
        logger.debug(`Discussion ${discussion.id}`)
        if (discussion.notes) {
            for (const note of discussion.notes) {
                logger.debug(`  body=${note.body}`)
                logger.debug(`  base_sha=${note.position?.base_sha} head_sha=${note.position?.head_sha} start_sha=${note.position?.start_sha}`)
                logger.debug(`  position_type=${note.position?.position_type} new_path=${note.position?.new_path} old_path=${note.position?.old_path}`)
                logger.debug(`  new_line=${note.position?.new_line}`)
            }
        }
    }

    return discussions
}



export async function gitlabUpdateNote(gitlab_url: string, gitlab_token: string, project_id: string, merge_request_iid: number,
                                       discussion_id: number, note_id: number, body: string): Promise<void> {
    const api = new Gitlab({ host: gitlab_url, token: gitlab_token })

    logger.debug(`Update discussion #${discussion_id} note #${note_id} for merge request #${merge_request_iid} in project #${project_id} `)
    logger.debug(`new body is: ${body}`)

    await api.MergeRequestDiscussions.editNote(project_id, merge_request_iid, discussion_id, note_id, { body: body })
}

export async function gitlabCreateDiscussionWithoutPosition(gitlab_url: string, gitlab_token: string,
                                                            project_id: string, merge_request_iid: number,
                                                            body: string): Promise<void> {
    const api = new Gitlab({ host: gitlab_url, token: gitlab_token })

    logger.debug(`Create new discussion for merge request #${merge_request_iid} in project #${project_id}`)

    await api.MergeRequestDiscussions.create(project_id, merge_request_iid, body)
}

export async function gitlabCreateDiscussion(gitlab_url: string, gitlab_token: string, project_id: string, merge_request_iid: number,
                                             line: number, filename: string, body: string, base_sha: string, commit_sha: string): Promise<void> {

    // This implementation comes from GitBeaker, but does not work in all cases
    /*

    const api = new Gitlab({ host: gitlab_url, token: gitlab_token })

    let merge_request = await api.MergeRequests.show(project_id, merge_request_iid)

    logger.debug(`XX Create new discussion for merge request #${merge_request_iid} in project #${project_id}`)

    await api.MergeRequestDiscussions.create(project_id, merge_request_iid, body, {
        position: {
            position_type: "text",
            base_sha: base_sha,
            head_sha: merge_request.sha,
            start_sha: base_sha,
            new_path: filename,
            old_path: filename,
            new_line: line.toString()
        }
    })
    */

    // JC: GitBeaker isn't working for this case (filed https://github.com/jdalrymple/gitbeaker/issues/2396)
    // Working around using bare REST query

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append("body", body)
    formData.append("position[position_type]", "text")
    formData.append("position[base_sha]", base_sha)
    formData.append("position[start_sha]", base_sha)
    //formData.append("position[head_sha]", merge_request.sha)
    formData.append("position[head_sha]", commit_sha)
    formData.append("position[new_path]", filename)
    formData.append("position[old_path]", filename)
    formData.append("position[new_line]", line.toString())

    let headers = {
        "PRIVATE-TOKEN": gitlab_token,
        'content-type': `multipart/form-data; boundary=${formData._boundary}`
    }

    logger.debug(`headers=${headers}`)

    let url = `${gitlab_url}/api/v4/projects/${project_id}/merge_requests/${merge_request_iid}/discussions`

    logger.debug(`url=${url}`)

    let res = undefined
    try {
        res = await axios.post(url,
            formData, {
                headers: headers
            })

        logger.debug(`res=${res.status} res=${res.data} status=${res.statusText} h=${res.headers}`)

        if (res.status > 201) {
            logger.error(`Unable to create discussion for ${filename}:${line} at ${url}`)
            logger.debug(`ERROR`)
            return
        }

    } catch (error: any) {
        // we'll proceed, but let's report it
        logger.error(`${error.message}`)
    }

    logger.debug(`OK`)

    return
}
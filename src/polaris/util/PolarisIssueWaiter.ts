import PolarisService from "../service/PolarisService";

const fs = require('fs');
const json_path = require('jsonpath');
import PolarisJobService from '../service/PolarisJobService';
import {logger} from "../../SIGLogger";

export default class PolarisIssueWaiter {
    log: any;
    constructor(log:any) {
        this.log = log;
    }

    async wait_for_issues(scan_cli_json_path: String, polaris_service: PolarisService): Promise<number | null> {
        var scan_json_text = fs.readFileSync(scan_cli_json_path);
        var scan_json = JSON.parse(scan_json_text);

        var issue_counts = json_path.query(scan_json, "$.issueSummary.total");

        var job_status_urls = json_path.query(scan_json, "$.tools[*].jobStatusUrl");
        if (job_status_urls.length > 0) {
            this.log.info("Waiting for jobs: " + job_status_urls.length)
            var polaris_job_service = new PolarisJobService(this.log, polaris_service);
            await polaris_job_service.waitForJobsToEnd(job_status_urls);
        } else {
            this.log.info("No jobs were found to wait for.")
        }

        var project_id = json_path.query(scan_json, "$.projectInfo.projectId")
        var branch_id = json_path.query(scan_json, "$.projectInfo.branchId")
        var revision_id = json_path.query(scan_json, "$.projectInfo.revisionId")

        var issue_api_url = json_path.query(scan_json, "$.scanInfo.issueApiUrl");
        if (issue_api_url.length > 0) {
            this.log.info("Getting issues from Polaris Software Integrity Platform server.")
            var issue_response =  await polaris_service.fetch_issue_data(issue_api_url[0]);
            issue_counts = json_path.query(issue_response.data, "$.data..attributes.value");
        }

        if (issue_counts.length != 0) {
            var total_count = issue_counts.reduce((a:any, b:any) => a + b, 0)
            this.log.info("Total issues found : " + total_count + "(This will may be filtered for reporting")
            return total_count;
        } else {
            this.log.info("Did not find any issue counts.")
            return null;
        }
    }
}


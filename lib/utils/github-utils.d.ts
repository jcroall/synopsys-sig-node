import { ExistingIssueComment, ExistingReviewComment, NewReviewComment } from '../_namespaces/github';
import { DiffMap } from "./diffmap";
export declare function githubIsPullRequest(): boolean;
export declare function githubGetSha(): string;
export declare function githubGetPullRequestNumber(): number | undefined;
export declare function githubRelativizePath(path: string): string;
export declare function githubGetPullRequestDiff(github_token: string): Promise<string>;
export declare function githubGetExistingReviewComments(github_token: string): Promise<ExistingReviewComment[]>;
export declare function githubUpdateExistingReviewComment(github_token: string, commentId: number, body: string): Promise<void>;
export declare function githubCreateReview(github_token: string, comments: NewReviewComment[], event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT'): Promise<void>;
export declare function githubGetExistingIssueComments(github_token: string): Promise<ExistingIssueComment[]>;
export declare function githubUpdateExistingIssueComment(github_token: string, commentId: number, body: string): Promise<void>;
export declare function githubCreateIssueComment(github_token: string, body: string): Promise<void>;
export declare function githubGetDiffMap(rawDiff: string): DiffMap;

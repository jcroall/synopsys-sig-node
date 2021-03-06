export interface IPolarisRunData {
    data: IPolarisRun[],
    "meta": {
        "offset": number,
        "limit": number,
        "total": number
    }
}

export interface IPolarisRun {
    type: string,
    id: string,
    attributes: {
        "fingerprints": string,
        "upload-id": string,
        "run-type": string,
        "creation-date": string,
        "completed-date": string,
        "status": string,
        "segment": string
    },
    relationships: {
        "project"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "tool"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "previous-run"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "properties"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "revision"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "tool-domain-service"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "submitting-organization"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "submitting-user"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
    }
    links: {
        self: IPolarisHref
    },
    meta: {
        "etag": string,
        "organization-id": string,
        "in-trash": boolean
    }
}

export interface IPolarisBranchData {
    data: IPolarisBranch[],
    "meta": {
        "offset": number,
        "limit": number,
        "total": number
    }
}

export interface IPolarisBranch {
    "type": string,
    "id": string,
    "attributes": {
        "name": string,
        "main-for-project": boolean
    },
    relationships: {
        "revisions"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        },
        "project"?: {
            links: IPolarisRelationshipLink,
            data: IPolarisRelationshipData
        }
    }
    links: {
        self: IPolarisHref
    },
    meta: {
        "etag": string,
        "organization-id": string,
        "in-trash": boolean
    }
}

export interface IPolarisIssueDataReturn {
    issueData: IPolarisIssue[],
    issueIncluded: IPolarisIssueIncluded[]
}

export interface IPolarisIssueData {
    data: IPolarisIssue[],
    included: IPolarisIssueIncluded[],
    meta: {
        "total": number,
        "offset": number,
        "limit": number,
        "complete": true,
        "run-count": number,
        "latest-run-ids": string[]
    }
}

export interface IPolarisIssue {
    type: string,
    id: string,
    attributes: {
        "finding-key": string,
        "issue-key": string,
        "sub-tool": string,
        "severity": string
    },
    relationships: {
        "path"?: {
            data: IPolarisRelationshipData
        },
        "tool-domain-service"?: {
            data: IPolarisRelationshipData
        },
        "reachability"?: {
            data: IPolarisRelationshipData
        },
        "issue-type"?: {
            data: IPolarisRelationshipData
        },
        "tool"?: {
            data: IPolarisRelationshipData
        },
        "latest-observed-on-run"?: {
            data: IPolarisRelationshipData
        },
        "transitions"?: {
            data: IPolarisRelationshipData[]
        },
        "related-taxa"?: {
            data: IPolarisRelationshipData[]
        },
        "related-indicators"?: {
            data: IPolarisRelationshipData[]
        },
        "severity"?: {
            data: IPolarisRelationshipData
        }
    },
    links: {
        self: IPolarisHref
    }
}

export interface IPolarisIssueIncluded {
    "id": string,
    "type": string,
    "attributes": {
        "transition-type"?: string,
        "cause"?: string,
        "human-readable-cause"?: string,
        "transition-date"?: string,
        "branch-id"?: string,
        "revision-id"?: string,
        "run-id"?: string,
        "issue-type"?: string,
        "name"?: string,
        "description"?: string,
        "abbreviation"?: string,
        "local-effect"?: string,
        "path"?: string[]
    }
}

export interface IPolarisIssueTriageData {
    data: IPolarisIssueTriage
}

export interface IPolarisIssueTriage {
    type: string,
    id: string,
    links: {
        self: IPolarisHref
    },
    attributes: {
        "issue-key": string,
        "project-id": string,
        "triage-current-values": IPolarisIssueTriageValue[]
    }
}

export interface IPolarisIssueTriageValue {
    "attribute-semantic-id": string,
    "attribute-name": string,
    "kind": string,
    "value": string,
    "timestamp": string,
    "display-value": string
}

export async function getTriageValue(attribute_name: string, triage_values: IPolarisIssueTriageValue[]):
    Promise<IPolarisIssueTriageValue> {
    for (const value of triage_values) {
        if (attribute_name == value["attribute-semantic-id"]) {
            return value
        }
    }
    return Promise.reject()
}

export interface IPolarisCodeAnalysisEventsData {
    data: IPolarisCodeAnalysisEvents[],
    meta: {
        "limit": number,
        "offset": number,
        "total": number
    }
}

export interface IPolarisCodeAnalysisEvents {
    "run-id": string,
    "finding-key": string,
    "main-event-file-path": string[],
    "main-event-line-number": number,
    language: string,
    "example-events-caption": string,
    "example-events-groups": string[],
    events: IPolarisCodeAnalysisEvent[],
    type: string
}

export interface IPolarisCodeAnalysisEvent {
    "covlstr-event-description": string,
    "event-description": string,
    "event-number": number,
    "event-set": number,
    "event-tag": string,
    "event-tree-position": string,
    "event-type": string,
    "line-number": number,
    "source-before": IPolarisCodeAnalysisEventSource,
    "source-after": IPolarisCodeAnalysisEventSource,
    "path": string[],
    "filePath": string,
    "evidence-events": IPolarisCodeAnalysisEvent[],
}

interface IPolarisCodeAnalysisEventSource {
    "start-line": number,
    "end-line": number,
    "source-code": string
}

interface IPolarisRelationshipLink {
    self: string,
    related: string
}

interface IPolarisRelationshipData {
    type: string,
    id: string
}

interface IPolarisHref {
    "href": string,
    "meta": {
        "durable": string
    }
}

export interface IPolarisIssueUnified {
    key: string,
    name: string,
    description: string,
    localEffect: string,
    checkerName: string,
    path: string,
    line: number,
    severity: string,
    cwe: string,
    mainEvent: string,
    mainEventDescription: string,
    remediationEvent: string,
    remediationEventDescription: string,
    dismissed: boolean,
    events: IPolarisIssueUnifiedEvent[],
    link: string
}

export interface IPolarisIssueUnifiedEvent {
    "description": string,
    "number": number,
    "tag": string,
    "type": string,
    "line-number": number,
    "source-before": IPolarisCodeAnalysisEventSource,
    "source-after": IPolarisCodeAnalysisEventSource,
    "filePath": string
}
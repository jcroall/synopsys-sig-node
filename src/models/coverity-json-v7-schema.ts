export interface CoverityIssuesView {
    type: string
    formatVersion: number
    suppressedIssueCount: number
    issues: CoverityIssueOccurrence[]
    error?: CoverityError
    warnings: CoverityError[]
    desktopAnalysisSettings: CoverityDesktopAnalysisSettings
}

// Issues

export interface CoverityIssueOccurrence {
    mergeKey: string
    occurrenceCountForMK: number
    occurrenceNumberInMK: number
    referenceOccurrenceCountForMK: number
    checkerName: string
    subcategory: string
    type: string
    subtype: string
    extra: string
    domain: string
    language?: string
    'code-language'?: string
    mainEventFilePathname: string
    strippedMainEventFilePathname: string
    mainEventLineNumber: number
    properties: Map<string, string> | any
    functionDisplayName?: string
    functionMangledName?: string
    localStatus?: string
    ordered: boolean
    events: CoverityEvent[]
    checkerProperties?: CoverityCheckerProperties
    stateOnServer?: CoverityStateOnServer
}

export interface CoverityEvent {
    covLStrEventDescription: string
    eventDescription: string
    eventNumber: number
    eventTreePosition: string
    eventSet: number
    eventTag: string
    filePathname: string
    strippedFilePathname: string
    lineNumber: number
    main: boolean
    moreInformationId?: string
    remediation: boolean
    events?: CoverityEvent[]
}

export interface CoverityCheckerProperties {
    category: string
    categoryDescription: string
    cweCategory: string
    issueKinds: string[]
    eventSetCaptions: string[]
    impact: string
    impactDescription: string
    subcategoryLocalEffect: string
    subcategoryLongDescription: string
    subcategoryShortDescription: string
    MISRACategory?: string
}

export interface CoverityStateOnServer {
    cid: number
    presentInReferenceSnapshot: boolean
    firstDetectedDateTime: string
    stream: string
    components: string[]
    componentOwners?: any
    cached: boolean
    retrievalDateTime: string
    ownerLdapServerName: string
    triage: CoverityTriage
    customTriage: CoverityCustomTriage
}

export interface CoverityTriage {
    classification: string
    action: string
    fixTarget: string
    severity: string
    legacy: string
    owner: string
    externalReference: string
}

export interface CoverityCustomTriage {
    // set of key-value pairs
}

// Error/Warnings

export interface CoverityError {
    errorType: string
    errorSubType: string
    errorMessage: any
    // ... other errorType-specific attributes ...
}

// Desktop Analysis Settings

export interface CoverityDesktopAnalysisSettings {
    analysisDateTime: string
    covRunDesktopArgs: string[]
    effectiveStripPaths: string[]
    analysisScopePathnames: string[]
    strippedAnalysisScopePathnames: string[]
    auxiliaryScopePathnames: string[]
    strippedAuxiliaryScopePathnames: string[]
    relativeTo?: string
    intermediateDir: string
    effectiveAnalysisSettings: CoverityPortableAnalysisSettings
    referenceSnapshot?: CoverityReferenceSnapshotDetails
}

export interface CoverityReferenceSnapshotDetails {
    snapshotId: number
    codeVersionDateTime: string
    description: string
    version: string
    analysisVersion: string
    analysisVersionOverride: string
    target: string
    analysisSettings: CoverityPortableAnalysisSettings
}

export interface CoverityPortableAnalysisSettings {
    covAnalyzeArgs: string[]
    fbExcludeConfigurations: string[]
    fbIncludeConfiguration: string
    fileCheckerOptions: CoverityFileCheckerOption[]
}

export interface CoverityFileCheckerOption {
    checkerName: string
    optionName: string
    fileContents: string
}

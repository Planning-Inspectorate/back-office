export interface Appeal {
  AppealId: number;
  AppealReference: string;
  AppellantName: string;
  AppealStatus: AppealStatus;
  Received: string;
  AppealSite: {
    AddressLine1: string;
    AddressLine2?: string;
    Town: string;
    County?: string;
    PostCode: string;
  };
  LocalPlanningDepartment: string;
  PlanningApplicationReference: string;
  Documents: AppealDocument[];
  reasons?: {
    namesDoNotMatch?: true,
    sensitiveInfo?: true,
    missingApplicationForm?: true,
    missingDecisionNotice?: true,
    missingGroundsForAppeal?: true,
    missingSupportingDocuments?: true,
    inflamatoryComments?: true,
    openedInError?: true,
    wrongAppealTypeUsed?: true,
    otherReasons?: string;
  }
}

export interface AppealDocument {
  Type: AppealDocumentType;
  Filename: string;
  URL: string;
}

export type AppealDocumentType = 'appeal statement' | 'decision letter' | 'planning application form' | 'supporting document';
export type AppealStatus = 'new' | AppealOutcomeStatus;
export type AppealOutcomeStatus = 'incomplete' | 'valid' | 'invalid';

export interface Folder {
	/** @example 23 */
	id?: number;
	/** @example "appellantCase/appealStatement" */
	path?: string;
	/** @example 34 */
	caseId?: number;
	/** @example [] */
	documents?: any[];
}

export interface DocumentDetails {
	/** @example "c957e9d0-1a02-4650-acdc-f9fdd689c210" */
	guid?: string;
	/** @example "appeal-statement.pdf" */
	name?: string;
	/** @example 3779 */
	folderId?: number;
	/** @example "2023-08-17T15:22:20.827Z" */
	createdAt?: string;
	/** @example false */
	isDeleted?: boolean;
	/** @example 1 */
	latestVersionId?: number;
	/** @example 492 */
	caseId?: number;
	latestDocumentVersion?: {
		/** @example "c957e9d0-1a02-4650-acdc-f9fdd689c210" */
		documentGuid?: string;
		/** @example 1 */
		version?: number;
		lastModified?: any;
		/** @example "applicationForm" */
		documentType?: string;
		/** @example false */
		published?: boolean;
		/** @example "back-office" */
		sourceSystem?: string;
		origin?: any;
		/** @example "appeal-statement.pdf" */
		originalFilename?: string;
		/** @example "appeal-statement.pdf" */
		fileName?: string;
		representative?: any;
		description?: any;
		owner?: any;
		author?: any;
		securityClassification?: any;
		/** @example "application/pdf" */
		mime?: string;
		horizonDataID?: any;
		fileMD5?: any;
		path?: any;
		virusCheckStatus?: any;
		/** @example 146995 */
		size?: number;
		/** @example "appellant_case" */
		stage?: string;
		filter1?: any;
		/** @example "document-service-uploads" */
		blobStorageContainer?: string;
		/** @example "appeal/APPREF-123/v1/appeal-statement.pdf" */
		blobStoragePath?: string;
		/** @example "2023-08-17T15:22:20.827Z" */
		dateCreated?: string;
		datePublished?: any;
		/** @example false */
		isDeleted?: boolean;
		examinationRefNo?: any;
		filter2?: any;
		/** @example "awaiting_upload" */
		publishedStatus?: string;
		publishedStatusPrev?: any;
		redactedStatus?: any;
		/** @example false */
		redacted?: boolean;
		/** @example "https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APPREF-123/c957e9d0-1a02-4650-acdc-f9fdd689c210/v1/appeal-statement.pdf" */
		documentURI?: string;
		dateReceived?: any;
	};
}

export interface AllAppeals {
	/** @example 57 */
	itemCount?: number;
	items?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/235348" */
		appealReference?: string;
		appealSite?: {
			/** @example "19 Beauchamp Road" */
			addressLine1?: string;
			/** @example "Bristol" */
			town?: string;
			/** @example "BS7 8LQ" */
			postCode?: string;
		};
		/** @example "awaiting_lpa_questionnaire" */
		appealStatus?: string;
		/** @example "household" */
		appealType?: string;
		/** @example "2023-02-16T11:43:27.096Z" */
		createdAt?: string;
		/** @example "Wiltshire Council" */
		localPlanningDepartment?: string;
	}[];
	/** @example 1 */
	page?: number;
	/** @example 27 */
	pageCount?: number;
	/** @example 30 */
	pageSize?: number;
}

export interface SingleAppealResponse {
	agentName?: any;
	allocationDetails?: {
		/** @example "A" */
		level?: string;
		/** @example 3 */
		band?: number;
		/** @example ["Historic heritage","Architecture design"] */
		specialisms?: string[];
	};
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/235348" */
	appealReference?: string;
	appealSite?: {
		/** @example "19 Beauchamp Road" */
		addressLine1?: string;
		/** @example "Bristol" */
		town?: string;
		/** @example "BS7 8LQ" */
		postCode?: string;
	};
	/** @example "awaiting_lpa_questionnaire" */
	appealStatus?: string;
	appealTimetable?: {
		/** @example "2023-06-28T01:00:00.000Z" */
		finalCommentReviewDate?: string;
		/** @example "2023-05-16T01:00:00.000Z" */
		lpaQuestionnaireDueDate?: string;
		/** @example "2023-06-14T01:00:00.000Z" */
		statementReviewDate?: string;
	};
	/** @example "household" */
	appealType?: string;
	/** @example 1 */
	appellantCaseId?: number;
	/** @example "Fiona Burgess" */
	appellantName?: string;
	/** @example true */
	appellantOwnsWholeSite?: boolean;
	/** @example "13de469c-8de6-4908-97cd-330ea73df618" */
	caseOfficer?: string;
	/** @example "Not issued yet" */
	decision?: string;
	healthAndSafety?: {
		appellantCase?: {
			/** @example "There is no mobile reception at the site" */
			details?: string;
			/** @example true */
			hasIssues?: boolean;
		};
		lpaQuestionnaire?: {
			/** @example "There may be no mobile reception at the site" */
			details?: string;
			/** @example true */
			hasIssues?: boolean;
		};
	};
	/** @example "f7ea429b-65d8-4c44-8fc2-7f1a34069855" */
	inspector?: string;
	inspectorAccess?: {
		appellantCase?: {
			/** @example "There is a tall hedge around the site which obstructs the view of the site" */
			details?: string;
			/** @example true */
			isRequired?: boolean;
		};
		lpaQuestionnaire?: {
			/** @example "There may be a tall hedge around the site" */
			details?: string;
			/** @example true */
			isRequired?: boolean;
		};
	};
	/** @example true */
	isParentAppeal?: boolean;
	linkedAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	/** @example 1 */
	lpaQuestionnaireId?: number;
	neighbouringSite?: {
		contacts?: {
			address?: {
				/** @example "1 Grove Cottage" */
				addressLine1?: string;
				/** @example "Shotesham Road" */
				addressLine2?: string;
				/** @example "NR35 2ND" */
				postCode?: string;
				/** @example "Woodton" */
				town?: string;
			};
			/** @example "Fiona" */
			firstName?: string;
			/** @example "Burgess" */
			lastName?: string;
		}[];
		/** @example true */
		isAffected?: boolean;
	};
	otherAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "48269/APP/2021/1482" */
	planningApplicationReference?: string;
	/** @example "Written" */
	procedureType?: string;
	siteVisit?: {
		/** @example 1 */
		siteVisitId?: number;
		/** @example "2022-03-31T12:00:00.000Z" */
		visitDate?: string;
		/** @example "10:00" */
		visitStartTime?: string;
		/** @example "12:00" */
		visitEndTime?: string;
		/** @example "Accompanied" */
		visitType?: string;
	};
	/** @example "2022-05-17T23:00:00.000Z" */
	startedAt?: string;
	documentationSummary?: {
		appellantCase?: {
			/** @example "received" */
			status?: string;
			dueDate?: any;
		};
		lpaQuestionnaire?: {
			/** @example "not_received" */
			status?: string;
			/** @example "2023-06-18T00:00:00.000Z" */
			dueDate?: string;
		};
	};
}

export interface SingleAppellantCaseResponse {
	agriculturalHolding?: {
		/** @example true */
		isAgriculturalHolding?: boolean;
		/** @example true */
		isTenant?: boolean;
		/** @example false */
		hasToldTenants?: boolean;
		/** @example true */
		hasOtherTenants?: boolean;
	};
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/965625" */
	appealReference?: string;
	appealSite?: {
		/** @example 1 */
		addressId?: number;
		/** @example "21 The Pavement" */
		addressLine1?: string;
		/** @example "Wandsworth" */
		county?: string;
		/** @example "SW4 0HY" */
		postCode?: string;
	};
	/** @example 1 */
	appellantCaseId?: number;
	appellant?: {
		/** @example 1 */
		appellantId?: number;
		/** @example "Roger Simmons Ltd" */
		company?: string;
		/** @example "Roger Simmons" */
		name?: string;
	};
	applicant?: {
		/** @example "Fiona" */
		firstName?: string;
		/** @example "Burgess" */
		surname?: string;
	};
	developmentDescription?: {
		/** @example "A new extension has been added at the back" */
		details?: string;
		/** @example false */
		isCorrect?: boolean;
	};
	documents?: {
		appealStatement?: {
			/** @example 4562 */
			folderId?: number;
			/** @example [] */
			documents?: any[];
		};
		applicationForm?: {
			/** @example 4563 */
			folderId?: number;
			/** @example [] */
			documents?: any[];
		};
		decisionLetter?: {
			/** @example 4564 */
			folderId?: number;
			/** @example [] */
			documents?: any[];
		};
		newSupportingDocuments?: {
			/** @example 4569 */
			folderId?: number;
			/** @example [] */
			documents?: any[];
		};
	};
	/** @example true */
	hasAdvertisedAppeal?: boolean;
	/** @example true */
	hasDesignAndAccessStatement?: boolean;
	/** @example true */
	hasNewPlansOrDrawings?: boolean;
	/** @example true */
	hasNewSupportingDocuments?: boolean;
	/** @example true */
	hasSeparateOwnershipCertificate?: boolean;
	healthAndSafety?: {
		/** @example "There is no mobile reception at the site" */
		details?: string;
		/** @example true */
		hasIssues?: boolean;
	};
	/** @example false */
	isAppellantNamedOnApplication?: boolean;
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	planningObligation?: {
		/** @example true */
		hasObligation?: boolean;
		/** @example "Finalised" */
		status?: string;
	};
	/** @example "written" */
	procedureType?: string;
	siteOwnership?: {
		/** @example true */
		areAllOwnersKnown?: boolean;
		/** @example true */
		hasAttemptedToIdentifyOwners?: boolean;
		/** @example true */
		hasToldOwners?: boolean;
		/** @example false */
		isFullyOwned?: boolean;
		/** @example true */
		isPartiallyOwned?: boolean;
		/** @example "Some" */
		knowsOtherLandowners?: string;
	};
	validation?: {
		/** @example "Incomplete" */
		outcome?: string;
		/** @example ["Appellant name is not the same on the application form and appeal form","Attachments and/or appendices have not been included to the full statement of case","Other"] */
		incompleteReasons?: string[];
	};
	visibility?: {
		/** @example "The site is behind a tall hedge" */
		details?: string;
		/** @example false */
		isVisible?: boolean;
	};
}

export interface UpdateAppealRequest {
	/** @example "2023-05-09" */
	startedAt?: string;
	/** @example "13de469c-8de6-4908-97cd-330ea73df618" */
	caseOfficer?: string;
	/** @example "f7ea429b-65d8-4c44-8fc2-7f1a34069855" */
	inspector?: string;
}

export interface UpdateAppealResponse {
	/** @example "2023-05-09T01:00:00.000Z" */
	startedAt?: string;
	/** @example "13de469c-8de6-4908-97cd-330ea73df618" */
	caseOfficer?: string;
	/** @example "f7ea429b-65d8-4c44-8fc2-7f1a34069855" */
	inspector?: string;
}

export interface SingleLPAQuestionnaireResponse {
	affectsListedBuildingDetails?: {
		/** @example "654321" */
		listEntry?: string;
	}[];
	/** @example 1 */
	appealId?: number;
	/** @example "APP/Q9999/D/21/526184" */
	appealReference?: string;
	appealSite?: {
		/** @example "92 Huntsmoor Road" */
		addressLine1?: string;
		/** @example "Tadley" */
		county?: string;
		/** @example "RG26 4BX" */
		postCode?: string;
	};
	/** @example "2023-05-09T01:00:00.000Z" */
	communityInfrastructureLevyAdoptionDate?: string;
	designatedSites?: {
		/** @example "cSAC" */
		name?: string;
		/** @example "candidate special area of conservation" */
		description?: string;
	}[];
	/** @example "" */
	developmentDescription?: string;
	documents?: {
		communityInfrastructureLevy?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		conservationAreaMapAndGuidance?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		consultationResponses?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		definitiveMapAndStatement?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		emergingPlans?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		environmentalStatementResponses?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		issuedScreeningOption?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		lettersToNeighbours?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		otherRelevantPolicies?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		planningOfficersReport?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		policiesFromStatutoryDevelopment?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		pressAdvert?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		relevantPartiesNotification?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		representationsFromOtherParties?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		responsesOrAdvice?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		screeningDirection?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		siteNotice?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		supplementaryPlanningtestDocuments?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
		treePreservationOrder?: {
			/** @example 1 */
			folderId?: number;
			/** @example "path/to/document/folder" */
			path?: string;
			documents?: {
				/** @example "fdadc281-f686-40ee-97cf-9bafdd02b1cb" */
				id?: string;
				/** @example "an appeal related document.pdf" */
				name?: string;
				/** @example 1 */
				folderId?: number;
				/** @example 2 */
				caseId?: number;
			}[];
		};
	};
	/** @example true */
	doesAffectAListedBuilding?: boolean;
	/** @example true */
	doesAffectAScheduledMonument?: boolean;
	/** @example true */
	doesSiteHaveHealthAndSafetyIssues?: boolean;
	/** @example true */
	doesSiteRequireInspectorAccess?: boolean;
	/** @example "Some extra conditions" */
	extraConditions?: string;
	/** @example true */
	hasCommunityInfrastructureLevy?: boolean;
	/** @example true */
	hasCompletedAnEnvironmentalStatement?: boolean;
	/** @example true */
	hasEmergingPlan?: boolean;
	/** @example true */
	hasExtraConditions?: boolean;
	/** @example true */
	hasProtectedSpecies?: boolean;
	/** @example true */
	hasRepresentationsFromOtherParties?: boolean;
	/** @example true */
	hasResponsesOrStandingAdviceToUpload?: boolean;
	/** @example true */
	hasStatementOfCase?: boolean;
	/** @example true */
	hasStatutoryConsultees?: boolean;
	/** @example true */
	hasSupplementaryPlanningDocuments?: boolean;
	/** @example true */
	hasTreePreservationOrder?: boolean;
	/** @example "There is no mobile signal at the property" */
	healthAndSafetyDetails?: string;
	/** @example true */
	inCAOrrelatesToCA?: boolean;
	/** @example true */
	includesScreeningOption?: boolean;
	/** @example 2 */
	inquiryDays?: number;
	/** @example "The entrance is at the back of the property" */
	inspectorAccessDetails?: string;
	/** @example true */
	isAffectingNeighbouringSites?: boolean;
	/** @example true */
	isCommunityInfrastructureLevyFormallyAdopted?: boolean;
	/** @example true */
	isConservationArea?: boolean;
	/** @example true */
	isCorrectAppealType?: boolean;
	/** @example true */
	isEnvironmentalStatementRequired?: boolean;
	/** @example true */
	isGypsyOrTravellerSite?: boolean;
	/** @example true */
	isListedBuilding?: boolean;
	/** @example true */
	isPublicRightOfWay?: boolean;
	/** @example true */
	isSensitiveArea?: boolean;
	/** @example true */
	isSiteVisible?: boolean;
	/** @example true */
	isTheSiteWithinAnAONB?: boolean;
	listedBuildingDetails?: {
		/** @example "123456" */
		listEntry?: string;
	}[];
	/** @example "Wiltshire Council" */
	localPlanningDepartment?: string;
	lpaNotificationMethods?: {
		/** @example "A site notice" */
		name?: string;
	}[];
	/** @example 1 */
	lpaQuestionnaireId?: number;
	/** @example true */
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean;
	neighbouringSiteContacts?: {
		address?: {
			/** @example "44 Rivervale" */
			addressLine1?: string;
			/** @example "Bridport" */
			town?: string;
			/** @example "DT6 5RN" */
			postCode?: string;
		};
		/** @example "eva.sharma@example.com" */
		email?: string;
		/** @example "Eva" */
		firstName?: string;
		/** @example "Sharma" */
		lastName?: string;
		/** @example "01234567891" */
		telephone?: string;
	}[];
	otherAppeals?: {
		/** @example 1 */
		appealId?: number;
		/** @example "APP/Q9999/D/21/725284" */
		appealReference?: string;
	}[];
	/** @example "Written" */
	procedureType?: string;
	/** @example "Schedule 1" */
	scheduleType?: string;
	/** @example "The area is prone to flooding" */
	sensitiveAreaDetails?: string;
	/** @example true */
	siteWithinGreenBelt?: boolean;
	/** @example "Some other people need to be consulted" */
	statutoryConsulteesDetails?: string;
	validation?: {
		/** @example "Incomplete" */
		outcome?: string;
		/** @example ["Documents or information are missing","Policies are missing","Other"] */
		incompleteReasons?: string[];
	};
}

export interface UpdateAppellantCaseRequest {
	/** @example "2023-12-13" */
	appealDueDate?: string;
	/** @example "Fiona" */
	applicantFirstName?: string;
	/** @example "Burgess" */
	applicantSurname?: string;
	/** @example true */
	areAllOwnersKnown?: boolean;
	/** @example true */
	hasAdvertisedAppeal?: boolean;
	/** @example true */
	hasAttemptedToIdentifyOwners?: boolean;
	/** @example true */
	hasHealthAndSafetyIssues?: boolean;
	/** @example "There is no mobile reception at the site" */
	healthAndSafetyIssues?: string;
	incompleteReasons?: {
		/** @example 1 */
		id?: number;
		/** @example ["Incomplete reason 1","Incomplete reason 2","Incomplete reason 3"] */
		text?: string[];
	}[];
	invalidReasons?: {
		/** @example 1 */
		id?: number;
		/** @example ["Invalid reason 1","Invalid reason 2","Invalid reason 3"] */
		text?: string[];
	}[];
	/** @example false */
	isSiteFullyOwned?: boolean;
	/** @example true */
	isSitePartiallyOwned?: boolean;
	/** @example false */
	isSiteVisibleFromPublicRoad?: boolean;
	/** @example "valid" */
	validationOutcome?: string;
	/** @example "The site is behind a tall hedge" */
	visibilityRestrictions?: string;
}

export type UpdateAppellantCaseResponse = object;

export interface UpdateLPAQuestionnaireRequest {
	/** @example [1,2,3] */
	designatedSites?: number[];
	/** @example true */
	doesAffectAListedBuilding?: boolean;
	/** @example true */
	doesAffectAScheduledMonument?: boolean;
	/** @example true */
	hasCompletedAnEnvironmentalStatement?: boolean;
	/** @example true */
	hasProtectedSpecies?: boolean;
	/** @example true */
	hasTreePreservationOrder?: boolean;
	/** @example true */
	includesScreeningOption?: boolean;
	incompleteReasons?: {
		/** @example 1 */
		id?: number;
		/** @example ["Incomplete reason 1","Incomplete reason 2","Incomplete reason 3"] */
		text?: string[];
	}[];
	/** @example true */
	isConservationArea?: boolean;
	/** @example true */
	isEnvironmentalStatementRequired?: boolean;
	/** @example true */
	isGypsyOrTravellerSite?: boolean;
	/** @example true */
	isListedBuilding?: boolean;
	/** @example true */
	isPublicRightOfWay?: boolean;
	/** @example true */
	isSensitiveArea?: boolean;
	/** @example true */
	isTheSiteWithinAnAONB?: boolean;
	/** @example "2023-06-21" */
	lpaQuestionnaireDueDate?: string;
	/** @example true */
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean;
	/** @example 1 */
	scheduleType?: number;
	/** @example "The area is liable to flooding" */
	sensitiveAreaDetails?: string;
	/** @example "incomplete" */
	validationOutcome?: string;
}

export type UpdateLPAQuestionnaireResponse = object;

export interface CreateSiteVisitRequest {
	/** @example "2023-07-07" */
	visitDate?: string;
	/** @example "18:00" */
	visitEndTime?: string;
	/** @example "16:00" */
	visitStartTime?: string;
	/** @example "access required" */
	visitType?: string;
}

export interface CreateSiteVisitResponse {
	/** @example "2023-07-07T01:00:00.000Z" */
	visitDate?: string;
	/** @example "18:00" */
	visitEndTime?: string;
	/** @example "16:00" */
	visitStartTime?: string;
	/** @example "access required" */
	visitType?: string;
}

export interface UpdateSiteVisitRequest {
	/** @example "2023-07-09" */
	visitDate?: string;
	/** @example "12:00" */
	visitEndTime?: string;
	/** @example "10:00" */
	visitStartTime?: string;
	/** @example "Accompanied" */
	visitType?: string;
}

export interface UpdateSiteVisitResponse {
	/** @example "2023-07-09T01:00:00.000Z" */
	visitDate?: string;
	/** @example "12:00" */
	visitEndTime?: string;
	/** @example "10:00" */
	visitStartTime?: string;
	/** @example "Accompanied" */
	visitType?: string;
}

export interface SingleSiteVisitResponse {
	/** @example 2 */
	appealId?: number;
	/** @example 1 */
	siteVisitId?: number;
	/** @example "Access required" */
	visitType?: string;
	/** @example "2023-07-07" */
	visitDate?: string;
	/** @example "18:00" */
	visitEndTime?: string;
	/** @example "16:00" */
	visitStartTime?: string;
}

export type AllAppellantCaseIncompleteReasonsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Incomplete reason" */
	name?: string;
	/** @example true */
	hasText?: boolean;
}[];

export type AllAppellantCaseInvalidReasonsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Invalid reason" */
	name?: string;
	/** @example true */
	hasText?: boolean;
}[];

export type AllLPAQuestionnaireIncompleteReasonsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Incomplete reason" */
	name?: string;
	/** @example true */
	hasText?: boolean;
}[];

export type AllocationSpecialismsResponse = {
	/** @example 1 */
	id?: number;
	/** @example "Specialism" */
	name?: string;
}[];

export type AllocationLevelsResponse = {
	/** @example "B" */
	level?: string;
	/** @example 3 */
	band?: number;
}[];

export interface AppealAllocation {
	/** @example "A" */
	level?: string;
	/** @example [70,71,72] */
	specialisms?: number[];
}

export type AllDesignatedSitesResponse = {
	/** @example "cSAC" */
	name?: string;
	/** @example "candidate special area of conservation" */
	description?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllKnowledgeOfOtherLandownersResponse = {
	/** @example "Yes" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllLPANotificationMethodsResponse = {
	/** @example "A site notice" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllLPAQuestionnaireValidationOutcomesResponse = {
	/** @example "Complete" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllPlanningObligationStatusesResponse = {
	/** @example "Finalised" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllProcedureTypesResponse = {
	/** @example "Hearing" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllScheduleTypesResponse = {
	/** @example "Schedule 1" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllSiteVisitTypesResponse = {
	/** @example "Access required" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export type AllAppellantCaseValidationOutcomesResponse = {
	/** @example "Valid" */
	name?: string;
	/** @example 1 */
	id?: number;
}[];

export interface SingleAppellantResponse {
	/** @example "Fiona Burgess" */
	agentName?: string;
	/** @example 1 */
	appellantId?: number;
	/** @example "Sophie Skinner Ltd" */
	company?: string;
	/** @example "sophie.skinner@example.com" */
	email?: string;
	/** @example "Sophie Skinner" */
	name?: string;
}

export interface UpdateAppellantRequest {
	/** @example "Eva Sharma" */
	name?: string;
}

export interface UpdateAppellantResponse {
	/** @example "Eva Sharma" */
	name?: string;
}

export interface SingleAddressResponse {
	/** @example 1 */
	addressId?: number;
	/** @example "1 Grove Cottage" */
	addressLine1?: string;
	/** @example "Shotesham Road" */
	addressLine2?: string;
	/** @example "United Kingdom" */
	country?: string;
	/** @example "Devon" */
	county?: string;
	/** @example "NR35 2ND" */
	postcode?: string;
	/** @example "Woodton" */
	town?: string;
}

export interface UpdateAddressRequest {
	/** @example "1 Grove Cottage" */
	addressLine1?: string;
	/** @example "Shotesham Road" */
	addressLine2?: string;
	/** @example "United Kingdom" */
	country?: string;
	/** @example "Devon" */
	county?: string;
	/** @example "NR35 2ND" */
	postcode?: string;
	/** @example "Woodton" */
	town?: string;
}

export interface UpdateAddressResponse {
	/** @example "1 Grove Cottage" */
	addressLine1?: string;
	/** @example "Shotesham Road" */
	addressLine2?: string;
	/** @example "United Kingdom" */
	country?: string;
	/** @example "Devon" */
	county?: string;
	/** @example "NR35 2ND" */
	postcode?: string;
	/** @example "Woodton" */
	town?: string;
}

export interface UpdateAppealTimetableRequest {
	/** @example "2023-08-09" */
	finalCommentReviewDate?: string;
	/** @example "2023-08-10" */
	issueDeterminationDate?: string;
	/** @example "2023-08-11" */
	lpaQuestionnaireDueDate?: string;
	/** @example "2023-08-12" */
	statementReviewDate?: string;
}

export interface UpdateAppealTimetableResponse {
	/** @example "2023-08-09T01:00:00.000Z" */
	finalCommentReviewDate?: string;
	/** @example "2023-08-10T01:00:00.000Z" */
	issueDeterminationDate?: string;
	/** @example "2023-08-11T01:00:00.000Z" */
	lpaQuestionnaireDueDate?: string;
	/** @example "2023-08-12T01:00:00.000Z" */
	statementReviewDate?: string;
}

/**
 * Return the properties for a paged response, with an array of items
 *
 * @param {string} itemTypeRef
 * @returns {Object<string,any>}
 */
function pagedResponseProperties(itemTypeRef) {
	return {
		page: { type: 'integer', minimum: 0 },
		pageCount: { type: 'integer', minimum: 0 },
		pageSize: { type: 'integer', minimum: 0 },
		itemCount: { type: 'integer', minimum: 0 },
		items: {
			type: 'array',
			items: { $ref: itemTypeRef }
		}
	};
}

const paginationErrors = {
	page: {
		type: 'string',
		example: 'page must be a number'
	},
	pageSize: {
		type: 'string',
		example: 'pageSize must be a number'
	}
};

/**
 * Basis of the OpenAPI spec document, which gets merged with express route defintion comments
 */
export const spec = {
	info: {
		// by default: '1.0.0'
		version: '2.0',
		// by default: 'REST API'
		title: 'PINS Back Office API',
		// by default: ''
		description: 'PINS Back Office API documentation from Swagger'
	},
	// by default: 'localhost:3000'
	host: '',
	// by default: '/'
	basePath: '',
	// by default: ['http']
	schemes: [],
	// by default: ['application/json']
	consumes: [],
	// by default: ['application/json']
	produces: [],
	// by default: empty Array
	tags: [
		{
			// Tag name
			name: '',
			// Tag description
			description: ''
		}
		// { ... }
	],
	// by default: empty object (Swagger 2.0)
	securityDefinitions: {},
	definitions: {
		UpdateApplication: {
			title: '',
			description: '',
			subSectorName: '',
			caseEmail: '',
			stage: '',
			geographicalInformation: {
				mapZoomLevelName: '',
				locationDescription: '',
				regionNames: [''],
				gridReference: {
					easting: '123456',
					northing: '098765'
				}
			},
			applicant: {
				id: 1,
				organisationName: '',
				firstName: '',
				middleName: '',
				lastName: '',
				email: '',
				website: '',
				phoneNumber: '',
				address: {
					addressLine1: '',
					addressLine2: '',
					town: '',
					county: '',
					postcode: ''
				}
			},
			keyDates: {
				preApplication: {
					submissionAtPublished: 'Q1 2023',
					submissionAtInternal: 123
				}
			},
			hasUnpublishedChanges: false
		},
		CreateApplication: {
			title: '',
			description: '',
			subSectorName: '',
			caseEmail: '',
			geographicalInformation: {
				mapZoomLevelName: '',
				locationDescription: '',
				regionNames: [''],
				gridReference: {
					easting: '123456',
					northing: '098765'
				}
			},
			applicant: {
				organisationName: '',
				firstName: '',
				middleName: '',
				lastName: '',
				email: '',
				address: {
					addressLine1: '',
					addressLine2: '',
					town: '',
					county: '',
					postcode: ''
				},
				website: '',
				phoneNumber: ''
			},
			keyDates: {
				preApplication: {
					submissionAtPublished: 'Q1 2023',
					submissionAtInternal: 123
				}
			}
		},
		Sectors: [
			{
				abbreviation: 'BB',
				displayNameCy: 'Sector Name Cy',
				displayNameEn: 'Sector Name En',
				name: 'sector'
			}
		],
		RegionsForApplications: [
			{
				id: 1,
				name: 'Region Name',
				displayNameEn: 'Region Name En',
				displayNameCy: 'Region Name Cy'
			}
		],
		CaseStages: [
			{
				name: 'post_decision',
				displayNameEn: 'Post-Decision'
			}
		],
		MapZoomLevelForApplications: [
			{
				id: 1,
				name: 'Region Name',
				displayOrder: 100,
				displayNameEn: 'Region Name En',
				displayNameCy: 'Region Name Cy'
			}
		],
		ExaminationTimetableTypes: [
			{
				id: 1,
				templateType: 'starttime-mandatory',
				name: 'Accompanied Site Inspection',
				displayNameEn: 'Accompanied site inspection',
				displayNameCy: 'Accompanied site inspection Cy'
			}
		],
		ExaminationTimetableItems: [
			{
				id: 1,
				caseId: 1,
				examinationTypeId: 1,
				name: 'Examination Timetable Item',
				description:
					'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
				date: '2023-02-27T10:00:00Z',
				startDate: '2023-02-27T10:00:00Z',
				published: false,
				folderId: 134,
				startTime: '10:20',
				endTime: '12:20',
				submissions: true
			}
		],
		ExaminationTimetableItemRequestBody: {
			caseId: 1,
			examinationTypeId: 1,
			name: 'Examination Timetable Item',
			description:
				'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
			date: '2023-02-27T10:00:00Z',
			published: false,
			folderId: 134,
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endTime: '12:20'
		},
		ExaminationTimetableItemResponseBody: {
			id: 1,
			caseId: 1,
			examinationTypeId: 1,
			name: 'Examination Timetable Item',
			description:
				'{"preText":"Examination Timetable Item Description\\r\\n","bulletPoints":[" Line item 1\\r\\n"," Line item 2"]}',
			date: '2023-02-27T10:00:00Z',
			published: false,
			folderId: 134,
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endTime: '12:20',
			submissions: true
		},
		DocumentDetails: {
			documentId: '123',
			version: 1,
			sourceSystem: 'ABC',
			documentGuid: '456',
			fileName: 'document.pdf',
			datePublished: 1_646_822_400,
			privateBlobPath: '/documents/123.pdf',
			privateBlobContainer: 'my-blob-storage',
			author: 'John Smith',
			dateCreated: 1_646_822_400,
			publishedStatus: 'published',
			redactedStatus: 'not redacted',
			size: 1024,
			mime: 'application/pdf',
			description: 'This is a sample document.',
			representative: 'Jane Doe',
			stage: 'draft',
			filter1: 'some filter value',
			filter2: 'some filter value',
			documentType: 'contract',
			caseRef: 'ABC-123',
			examinationRefNo: 'EXM-456',
			transcript: 'TR010060-000110'
		},
		PaginatedDocumentDetails: [
			{
				page: 1,
				pageDefaultSize: 50,
				pageCount: 1,
				itemCount: 1,
				items: [
					{
						documentId: '123',
						version: 1,
						sourceSystem: 'ABC',
						documentGuid: '456',
						fileName: 'document.pdf',
						originalFilename: 'original_document.pdf',
						datePublished: 1_646_822_400,
						privateBlobPath: '/documents/123.pdf',
						privateBlobContainer: 'my-blob-storage',
						author: 'John Smith',
						dateCreated: 1_646_822_400,
						publishedStatus: 'published',
						redactedStatus: 'not_redacted',
						size: 1024,
						mime: 'application/pdf',
						status: 'active',
						description: 'This is a sample document.',
						representative: 'Jane Doe',
						stage: 'draft',
						filter1: 'some filter value',
						filter2: 'some filter value',
						documentType: 'contract',
						caseRef: 'ABC-123',
						examinationRefNo: 'EXM-456',
						transcript: 'TR010060-000110'
					}
				]
			}
		]
	},
	'@definitions': {
		ApplicationSummary: {
			type: 'object',
			properties: {
				id: { type: 'number', description: 'Application id', example: 1 },
				title: {
					type: 'string',
					description: 'Application title',
					example: 'NSIP Application Title'
				},
				reference: {
					type: 'string',
					description: 'Application unique reference',
					example: 'BC0110001'
				},
				modifiedDate: {
					type: 'number',
					description: 'Date last modified, unix timestamp',
					example: 1655298882
				},
				subSector: {
					type: 'object',
					properties: {
						name: { type: 'string', description: 'Internal id code', example: 'office_use' },
						abbreviation: { type: 'string', description: '4-char code', example: 'BC01' },
						displayNameEn: {
							type: 'string',
							description: 'Subsector title in English',
							example: 'Office Use'
						},
						displayNameCy: {
							type: 'string',
							description: 'Subsector title in Welsh',
							example: 'Office Use'
						}
					}
				},
				sector: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							description: 'Internal id code',
							example: 'business_and_commercial'
						},
						abbreviation: { type: 'string', description: '4-char code', example: 'BC' },
						displayNameEn: {
							type: 'string',
							description: 'Sector title in English',
							example: 'Business and Commercial'
						},
						displayNameCy: {
							type: 'string',
							description: 'Sector title in Welsh',
							example: 'Business and Commercial'
						}
					}
				},
				status: {
					type: 'string',
					enum: [
						'Pre-application',
						'Acceptance',
						'Pre-examination',
						'Examination',
						'Recommendation',
						'Decision',
						'Post decision',
						'Withdrawn'
					],
					description: 'Application status',
					example: 'Acceptance'
				}
			}
		},
		ApplicationSummaryMany: {
			type: 'array',
			items: { $ref: '#/definitions/ApplicationSummary' }
		},
		ApplicationSearchSummary: {
			type: 'object',
			properties: {
				id: { type: 'number', description: 'Application id', example: 1 },
				title: {
					type: 'string',
					description: 'Application title',
					example: 'NSIP Application Title'
				},
				reference: {
					type: 'string',
					description: 'Application unique reference',
					example: 'BC0110001'
				},
				description: {
					type: 'string',
					description: 'Application description',
					example: 'A description of the application'
				},
				status: {
					type: 'string',
					enum: [
						'Pre-application',
						'Acceptance',
						'Pre-examination',
						'Examination',
						'Recommendation',
						'Decision',
						'Post decision',
						'Withdrawn'
					],
					description: 'Application status',
					example: 'Acceptance'
				}
			}
		},
		ApplicationsSearchCriteriaRequestBody: {
			type: 'object',
			required: ['query', 'role'],
			properties: {
				query: { type: 'string', description: 'String to search for', example: 'BC' },
				role: { type: 'string', description: 'User role', example: 'case-team' },
				pageNumber: { type: 'number', description: 'Page number required', example: 1 },
				pageSize: { type: 'number', description: 'Max items per page', example: 1 }
			}
		},
		ApplicationsSearchResponse: {
			type: 'object',
			properties: {
				page: { type: 'number', description: 'Page number', example: 1 },
				pageSize: { type: 'number', description: 'Max items per page', example: 1 },
				pageCount: { type: 'number', description: 'Total number of pages', example: 1 },
				itemCount: { type: 'number', description: 'Total items', example: 1 },
				items: {
					type: 'array',
					items: { $ref: '#ApplicationSearchSummary' }
				}
			}
		},
		ApplicationProjectUpdate: {
			allOf: [
				{ $ref: '#/definitions/ApplicationProjectUpdateCreateRequest' },
				{
					type: 'object',
					requiredProperties: ['id', 'caseId', 'dateCreated', 'sentToSubscribers'],
					properties: {
						id: { type: 'integer', minimum: 0 },
						caseId: { type: 'integer', minimum: 0 },
						dateCreated: {
							type: 'string',
							format: 'date-time',
							description: 'The date this update was created',
							example: '2022-12-21T12:42:40.885Z'
						},
						sentToSubscribers: {
							type: 'boolean',
							description: 'Has this update been emailed to subscribers?'
						},
						datePublished: {
							type: 'string',
							format: 'date-time',
							description: "The date this update's status was set to published",
							example: '2022-12-21T12:42:40.885Z'
						},
						type: {
							type: 'string',
							enum: ['general', 'applicationSubmitted', 'applicationDecided', 'registrationOpen'],
							description:
								'the type of update - which determines which subscribers will receive the notification emails'
						}
					}
				}
			]
		},
		ApplicationProjectUpdateCreateRequest: {
			type: 'object',
			required: ['emailSubscribers', 'status', 'htmlContent'],
			properties: {
				authorId: {
					type: 'integer',
					description: 'The back-office ID of the user who created this updated'
				},
				emailSubscribers: {
					type: 'boolean',
					description: 'Will this update be emailed to subscribers?'
				},
				status: {
					type: 'string',
					enum: ['draft', 'published', 'unpublished', 'archived'],
					description: 'The current status of this update'
				},
				title: {
					type: 'string',
					description: 'The internal title of this update'
				},
				htmlContent: {
					type: 'string',
					description:
						'The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Important Update</strong> Something happened.'
				},
				htmlContentWelsh: {
					type: 'string',
					description:
						'The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth.'
				}
			}
		},
		// similar to create, but no required properties
		ApplicationProjectUpdateUpdateRequest: {
			type: 'object',
			properties: {
				emailSubscribers: {
					type: 'boolean',
					description: 'Will this update be emailed to subscribers?'
				},
				status: {
					type: 'string',
					enum: ['draft', 'published', 'unpublished', 'archived'],
					description: 'The current status of this update'
				},
				title: {
					type: 'string',
					description: 'The internal title of this update'
				},
				htmlContent: {
					type: 'string',
					description:
						'The HTML content of this update, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Important Update</strong> Something happened.'
				},
				htmlContentWelsh: {
					type: 'string',
					description:
						'The HTML content of this update in Welsh, it can only include `<p> <a> <strong> <ul> <li> <br>` tags',
					example: '<strong>Diweddariad Pwysig</strong> Digwyddodd rhywbeth.'
				},
				type: {
					type: 'string',
					enum: ['general', 'applicationSubmitted', 'applicationDecided', 'registrationOpen'],
					description:
						'the type of update - which determines which subscribers will recieve the notification emails'
				},
				sentToSubscribers: {
					type: 'boolean',
					description: 'Has this update been emailed to subscribers?'
				}
			}
		},
		ApplicationProjectUpdateCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						emailSubscribers: {
							type: 'string',
							example: 'emailSubscribers is required'
						},
						status: {
							type: 'string',
							example: 'status is required'
						},
						htmlContent: {
							type: 'string',
							example: 'htmlContent is required'
						},
						title: {
							type: 'string',
							example: 'title must be a string'
						},
						htmlContentWelsh: {
							type: 'string',
							example: 'title must be a string'
						},
						type: {
							type: 'string',
							example: 'type must be a string'
						},
						sentToSubscribers: {
							type: 'string',
							example: 'sentToSubscribers must be a boolean'
						}
					}
				}
			}
		},
		ApplicationProjectUpdatesListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							example: 'status must be one of ...'
						},
						sentToSubscribers: {
							type: 'string',
							example: 'sentToSubscribers must be a boolean'
						},
						publishedBefore: {
							type: 'string',
							example: 'publishedBefore must be a valid date'
						},
						...paginationErrors
					}
				}
			}
		},
		ApplicationProjectUpdates: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/ApplicationProjectUpdate')
		},
		DocumentActivityLog: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'Id', example: 1 },
				documentGuid: {
					type: 'string',
					description: 'Username',
					example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
				},
				version: { type: 'integer', description: 'Document version', example: 2 },
				user: { type: 'string', description: 'Username', example: 'test-user@email.com' },
				status: { type: 'string', description: '', example: 'uploaded' },
				createdAt: {
					type: 'string',
					description: 'Date created',
					example: '2023-10-04T12:45:19.785Z'
				}
			}
		},
		DocumentToSaveExtended: {
			type: 'object',
			required: [
				'documentName',
				'documentSize',
				'documentType',
				'caseId',
				'folderId',
				'fileRowId',
				'username'
			],
			properties: {
				documentName: {
					type: 'string',
					description: 'Document file name',
					example: 'document.pdf'
				},
				documentSize: { type: 'integer', description: 'Document size in bytes', example: 1024 },
				documentType: {
					type: 'string',
					description: 'Document mime type',
					example: 'application/pdf'
				},
				caseId: { type: 'string', description: 'Case Id', example: '1' },
				folderId: { type: 'integer', description: 'Folder Id', example: 123 },
				fileRowId: { type: 'string', description: '', example: 'file_row_1585663020000_7945' },
				username: { type: 'string', description: 'Username', example: 'John Keats' },
				documentReference: {
					type: 'string',
					description: 'Document unique reference',
					example: 'BC011001-123456'
				},
				fromFrontOffice: { type: 'boolean', description: 'Sent from Front Office?', example: false }
			}
		},
		DocumentToSave: {
			type: 'object',
			required: [
				'documentName',
				'documentSize',
				'documentType',
				'caseId',
				'folderId',
				'fileRowId',
				'username'
			],
			properties: {
				documentName: {
					type: 'string',
					description: 'Document file name',
					example: 'document.pdf'
				},
				documentSize: { type: 'integer', description: 'Document size in bytes', example: 1024 },
				documentType: {
					type: 'string',
					description: 'Document mime type',
					example: 'application/pdf'
				},
				caseId: { type: 'string', description: 'Case Id', example: '1' },
				folderId: { type: 'integer', description: 'Folder Id', example: 123 },
				fileRowId: { type: 'string', description: '', example: 'file_row_1585663020000_7945' },
				username: { type: 'string', description: 'Username', example: 'John Keats' }
			}
		},
		DocumentsToSaveManyRequestBody: {
			type: 'array',
			items: { $ref: '#/definitions/DocumentToSave' }
		},
		DocumentsToUpdateRequestBody: {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status to set. Optional',
					example: 'not_checked'
				},
				redacted: {
					type: 'boolean',
					description: 'Set redaction status to redacted. Optional',
					example: true
				},
				documents: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							guid: {
								type: 'string',
								description: 'Document guid',
								example: '00000000-a173-47e2-b4b2-ce7064e0468a'
							}
						}
					}
				}
			}
		},
		DocumentsToPublishRequestBody: {
			type: 'object',
			properties: {
				documents: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							guid: {
								type: 'string',
								description: 'Document guid',
								example: '00000000-a173-47e2-b4b2-ce7064e0468a'
							}
						}
					}
				},
				username: { type: 'string', description: 'Username', example: 'test-user@email.com' }
			}
		},
		DocumentProperties: {
			type: 'object',
			properties: {
				documentGuid: {
					type: 'string',
					description: 'Document GUID',
					example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
				},
				documentId: { type: 'integer', description: '', example: null },
				documentRef: {
					type: 'string',
					description: 'Document Reference',
					example: 'BC011001-000001'
				},
				folderId: { type: 'integer', description: 'Folder Id', example: 2 },
				caseRef: { type: 'string', description: 'Case Reference', example: 'BC011001' },
				sourceSystem: {
					type: 'string',
					description: 'Source system of the document',
					example: 'back-office'
				},
				privateBlobContainer: {
					type: 'string',
					description: 'Back Office blob storage container',
					example: 'Blob-Storage-Container'
				},
				privateBlobPath: {
					type: 'string',
					description: 'Back Office blob storage path',
					example:
						'https://intranet.planninginspectorate.gov.uk/wp-content/uploads/2023/10/Lightbulb-L-and-D.gif'
				},
				author: { type: 'string', description: '', example: null },
				fileName: { type: 'string', description: 'File Title', example: 'Small Doc 1' },
				originalFilename: {
					type: 'string',
					description: 'The original filename',
					example: 'Small1.pdf'
				},
				dateCreated: {
					type: 'integer',
					description: 'Date Created Unix timestamp',
					example: 1696418643
				},
				size: { type: 'integer', description: 'File size in bytes', example: 1024 },
				mime: { type: 'string', description: 'Document mime type', example: 'application/pdf' },
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'ready_to_publish'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: null
				},
				datePublished: {
					type: 'integer',
					description: 'Date published Unix timestamp',
					example: 1696418643
				},
				description: { type: 'string', description: '', example: null },
				version: { type: 'integer', description: 'Document version', example: 2 },
				representative: { type: 'string', description: '', example: null },
				stage: { type: 'integer', description: '', example: 3 },
				documentType: { type: 'string', description: '', example: null },
				filter1: { type: 'string', description: '', example: 'some filter' },
				filter2: { type: 'string', description: '', example: 'some filter' },
				examinationRefNo: {
					type: 'string',
					description: 'Examination Timetable reference number',
					example: null
				},
				fromFrontOffice: {
					type: 'boolean',
					description: 'Document from front office',
					example: false
				}
			}
		},
		DocumentPropertiesWithVersionWithCase: {
			type: 'object',
			properties: {
				documentGuid: {
					type: 'string',
					description: 'Document guid',
					example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
				},
				version: { type: 'integer', description: 'Document version', example: 1 },
				lastModified: {
					type: 'integer',
					description: 'Last modified Unix timestamp',
					example: 1696418643
				},
				documentType: { type: 'string', description: '', example: null },
				published: { type: 'boolean', description: '', example: false },
				sourceSystem: {
					type: 'string',
					description: 'Source system of the document',
					example: 'back-office'
				},
				origin: { type: 'string', description: '', example: null },
				originalFilename: {
					type: 'string',
					description: 'The original filename',
					example: 'Small1.pdf'
				},
				fileName: { type: 'string', description: 'File Title', example: 'Small Doc 1' },
				representative: { type: 'string', description: '', example: null },
				description: { type: 'string', description: '', example: null },
				owner: { type: 'string', description: '', example: null },
				author: { type: 'string', description: '', example: null },
				securityClassification: { type: 'string', description: '', example: null },
				mime: { type: 'string', description: 'Document mime type', example: 'application/pdf' },
				horizonDataID: { type: 'string', description: '', example: null },
				fileMD5: { type: 'string', description: '', example: null },
				virusCheckStatus: { type: 'string', description: '', example: null },
				size: { type: 'integer', description: 'File size in bytes', example: 1024 },
				stage: { type: 'integer', description: '', example: 3 },
				filter1: { type: 'string', description: '', example: 'some filter' },
				privateBlobContainer: {
					type: 'string',
					description: 'Back Office blob storage container',
					example: 'document-service-uploads'
				},
				privateBlobPath: {
					type: 'string',
					description: 'Back Office blob storage path',
					example:
						'https://intranet.planninginspectorate.gov.uk/wp-content/uploads/2023/10/Lightbulb-L-and-D.gif'
				},
				publishedBlobContainer: {
					type: 'string',
					description: 'Published blob storage container',
					example: 'published-documents'
				},
				publishedBlobPath: {
					type: 'string',
					description: 'Published blob storage path',
					example: 'published/bc0110001-filename.pdf'
				},
				dateCreated: {
					type: 'string',
					description: 'Date document was created',
					example: '2022-12-21T12:42:40.885Z'
				},
				datePublished: {
					type: 'string',
					description: 'Date document was published',
					example: '2022-12-21T12:42:40.885Z'
				},
				isDeleted: {
					type: 'boolean',
					description: 'Is the document marked as deleted',
					example: false
				},
				examinationRefNo: {
					type: 'string',
					description: 'Examination Timetable reference number',
					example: null
				},
				filter2: { type: 'string', description: '', example: 'some filter' },
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'ready_to_publish'
				},
				publishedStatusPrev: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'The previous status',
					example: 'not_checked'
				},
				Document: {
					type: 'object',
					properties: {
						guid: {
							type: 'string',
							description: 'Document guid',
							example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
						},
						documentRef: {
							type: 'string',
							description: 'Document Reference',
							example: 'BC011001-000001'
						},
						folderId: { type: 'integer', description: 'Folder Id', example: 2 },
						createdAt: {
							type: 'string',
							description: 'Date document was created',
							example: '2022-12-21T12:42:40.885Z'
						},
						isDeleted: {
							type: 'boolean',
							description: 'Is the document marked as deleted',
							example: false
						},
						latestVersionId: {
							type: 'integer',
							description: 'Document latest version id',
							example: 2
						},
						caseId: { type: 'integer', description: 'Application case id', example: 1 },
						fromFrontOffice: {
							type: 'boolean',
							description: 'Document from front office',
							example: false
						}
					}
				},
				case: {
					type: 'object',
					properties: {
						id: { type: 'number', description: 'Application id', example: 1 },
						reference: {
							type: 'string',
							description: 'Application unique reference',
							example: 'BC0110001'
						},
						modifiedAt: {
							type: 'string',
							format: 'date-time',
							description: 'The date this case was last modified',
							example: '2022-12-21T12:42:40.885Z'
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							description: 'The date this case was created',
							example: '2022-12-21T12:42:40.885Z'
						},
						description: {
							type: 'string',
							description: 'Application description',
							example: 'A description of the application'
						},
						title: {
							type: 'string',
							description: 'Application title',
							example: 'NSIP Application Title'
						},
						hasUnpublishedChanges: {
							type: 'boolean',
							description: 'Does case have unpublished changes',
							example: true
						},
						applicantId: { type: 'number', description: 'Applicant Id', example: '1000000' }
					}
				}
			}
		},
		DocumentPropertiesWithAuditHistory: {
			type: 'object',
			properties: {
				documentGuid: {
					type: 'string',
					description: 'Username',
					example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
				},
				version: { type: 'integer', description: 'Document version', example: 2 },
				lastModified: {
					type: 'integer',
					description: 'Last modified Unix timestamp',
					example: 1696418643
				},
				documentType: { type: 'string', description: '', example: null },
				published: { type: 'boolean', description: '', example: false },
				sourceSystem: {
					type: 'string',
					description: 'Source system of the document',
					example: 'back-office'
				},
				origin: { type: 'string', description: '', example: null },
				originalFilename: {
					type: 'string',
					description: 'The original filename',
					example: 'Small1.pdf'
				},
				fileName: { type: 'string', description: 'File Title', example: 'Small Doc 1' },
				representative: { type: 'string', description: '', example: null },
				description: { type: 'string', description: '', example: null },
				owner: { type: 'string', description: '', example: null },
				author: { type: 'string', description: '', example: null },
				securityClassification: { type: 'string', description: '', example: null },
				mime: { type: 'string', description: 'Document mime type', example: 'application/pdf' },
				horizonDataID: { type: 'string', description: '', example: null },
				fileMD5: { type: 'string', description: '', example: null },
				virusCheckStatus: { type: 'string', description: '', example: null },
				size: { type: 'integer', description: 'File size in bytes', example: 1024 },
				stage: { type: 'integer', description: '', example: 3 },
				filter1: { type: 'string', description: '', example: 'some filter' },
				privateBlobContainer: {
					type: 'string',
					description: 'Back Office blob storage container',
					example: 'Blob-Storage-Container'
				},
				privateBlobPath: {
					type: 'string',
					description: 'Back Office blob storage path',
					example:
						'https://intranet.planninginspectorate.gov.uk/wp-content/uploads/2023/10/Lightbulb-L-and-D.gif'
				},
				publishedBlobContainer: {
					type: 'string',
					description: 'Published blob storage container',
					example: 'published-documents'
				},
				publishedBlobPath: {
					type: 'string',
					description: 'Published blob storage path',
					example: 'published/bc0110001-filename.pdf'
				},
				dateCreated: {
					type: 'integer',
					description: 'Date Created Unix timestamp',
					example: 1696418643
				},
				datePublished: {
					type: 'integer',
					description: 'Date published Unix timestamp',
					example: 1696418643
				},
				isDeleted: {
					type: 'boolean',
					description: 'Is the document marked as deleted',
					example: false
				},
				examinationRefNo: {
					type: 'string',
					description: 'Examination Timetable reference number',
					example: null
				},
				filter2: { type: 'string', description: '', example: 'some filter' },
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'ready_to_publish'
				},
				publishedStatusPrev: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'The previous status',
					example: 'not_checked'
				},
				DocumentActivityLog: {
					type: 'array',
					items: { $ref: '#/definitions/DocumentActivityLog' }
				},
				history: {
					type: 'object',
					properties: {
						uploaded: {
							type: 'object',
							properties: {
								date: { type: 'integer', description: 'UTC timestamp', example: 1696418643 },
								name: { type: 'string', description: 'User', example: 'test-user@email.com' }
							}
						}
					}
				}
			}
		},
		DocumentPropertiesWithAllVersionWithAuditHistory: {
			type: 'array',
			items: { $ref: '#/definitions/DocumentPropertiesWithAuditHistory' }
		},
		DocumentBlobStoragePayload: {
			type: 'object',
			required: [
				'caseType',
				'caseReference',
				'documentName',
				'documentReference',
				'GUID',
				'version'
			],
			properties: {
				caseType: {
					type: 'string',
					enum: ['appeal', 'application'],
					description: 'URL to the File',
					example: 'application'
				},
				caseReference: { type: 'string', description: 'Case Reference', example: '1' },
				documentName: { type: 'string', description: 'Document name', example: 'document.pdf' },
				documentReference: { type: 'string', nullable: true, description: '', example: '' },
				GUID: {
					type: 'string',
					description: 'Document guid',
					example: '00000000-a173-47e2-b4b2-ce7064e0468a'
				},
				version: { type: 'integer', description: 'Document version', example: 1 }
			}
		},
		DocumentAndBlobStorageDetail: {
			type: 'object',
			properties: {
				blobStoreUrl: {
					type: 'string',
					description: 'URL to the File',
					example: '/some/path/document.pdf'
				},
				caseType: {
					type: 'string',
					enum: ['appeal', 'application'],
					description: 'URL to the File',
					example: 'application'
				},
				caseReference: { type: 'string', description: 'Case Reference', example: '1' },
				documentName: { type: 'string', description: 'Document name', example: 'document.pdf' },
				GUID: {
					type: 'string',
					description: 'Document guid',
					example: '00000000-a173-47e2-b4b2-ce7064e0468a'
				}
			}
		},
		DocumentAndBlobInfoResponse: {
			type: 'object',
			properties: {
				blobStorageHost: {
					type: 'string',
					description: 'Blob Storage host name',
					example: 'blob-storage-host'
				},
				privateBlobContainer: {
					type: 'string',
					description: 'Private Blob Storage container name',
					example: 'blob-storage-container'
				},
				document: { $ref: '#/definitions/DocumentAndBlobStorageDetail' }
			}
		},
		DocumentAndBlobInfoManyResponse: {
			type: 'object',
			properties: {
				blobStorageHost: {
					type: 'string',
					description: 'Blob Storage host name',
					example: 'blob-storage-host'
				},
				privateBlobContainer: {
					type: 'string',
					description: 'Private Blob Storage container name',
					example: 'blob-storage-container'
				},
				documents: {
					type: 'array',
					items: { $ref: '#/definitions/DocumentAndBlobStorageDetail' }
				}
			}
		},
		DocumentsUploadPartialFailed: {
			type: 'object',
			properties: {
				blobStorageHost: {
					type: 'string',
					description: 'Blob Storage host name',
					example: 'blob-storage-host'
				},
				privateBlobContainer: {
					type: 'string',
					description: 'Private Blob Storage container name',
					example: 'blob-storage-container'
				},
				documents: {
					type: 'array',
					items: { $ref: '#/definitions/DocumentAndBlobStorageDetail' }
				},
				failedDocuments: {
					type: 'array',
					items: { type: 'string', description: 'Failed document name', example: 'example.pdf' }
				},
				duplicates: {
					type: 'array',
					items: { type: 'string', description: 'Failed document name', example: 'example2.pdf' }
				}
			}
		},
		DocumentsUploadFailed: {
			type: 'object',
			properties: {
				failedDocuments: {
					type: 'array',
					items: { type: 'string', description: 'Failed document name', example: 'example.pdf' }
				},
				duplicates: {
					type: 'array',
					items: { type: 'string', description: 'Failed document name', example: 'example2.pdf' }
				}
			}
		},
		DocumentsPublished: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					guid: {
						type: 'string',
						description: 'Document guid',
						example: '00000000-a173-47e2-b4b2-ce7064e0468a'
					},
					publishedStatus: {
						type: 'string',
						enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
						description: 'Published status to set. Optional',
						example: 'not_checked'
					}
				}
			}
		},
		DocumentVersionUpsertRequestBody: {
			type: 'object',
			properties: {
				version: { type: 'integer', description: 'Document version', example: 2 },
				sourceSystem: {
					type: 'string',
					description: 'Source system of the document',
					example: 'back-office'
				},
				documentGuid: {
					type: 'string',
					description: 'Username',
					example: 'ab12cd34-5678-90ef-ghij-klmnopqrstuv'
				},
				fileName: { type: 'string', description: 'File Title', example: 'Small Doc 1' },
				datePublished: {
					type: 'string',
					description: 'Date published UTC',
					example: '2022-12-21T12:42:40.885Z'
				},
				privateBlobContainer: {
					type: 'string',
					description: 'Back Office blob storage container',
					example: 'Blob-Storage-Container'
				},
				privateBlobPath: {
					type: 'string',
					description: 'Back Office blob storage path',
					example: '/documents/123.pdf'
				},
				author: { type: 'string', description: '', example: 'John Keats' },
				dateCreated: {
					type: 'string',
					description: 'Date created UTC',
					example: '2022-12-21T12:42:40.885Z'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'ready_to_publish'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: null
				},
				size: { type: 'integer', description: 'File size in bytes', example: 1024 },
				mime: { type: 'string', description: 'Document mime type', example: 'application/pdf' },
				description: { type: 'string', description: 'This is a sample document', example: null },
				representative: { type: 'string', description: '', example: 'Jane Doe' },
				filter1: { type: 'string', description: '', example: 'some filter value' },
				filter2: { type: 'string', description: '', example: 'some filter value' },
				documentType: { type: 'string', description: '', example: 'contract' },
				caseRef: { type: 'string', description: 'Case Reference', example: 'BC011001' },
				examinationRefNo: {
					type: 'string',
					description: 'Examination Timetable reference number',
					example: 'EXM-456'
				},
				transcript: {
					type: 'string',
					description: 'Transcript document reference number',
					example: 'TR010060-000110'
				}
			}
		},
		DocumentsToUnpublishRequestBody: {
			type: 'object',
			properties: {
				documents: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							guid: {
								type: 'string',
								example: '0084b156-006b-48b1-a47f-e7176414db29'
							}
						}
					}
				}
			}
		},
		DocumentsUnpublishResponseBody: {
			type: 'object',
			properties: {
				errors: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							guid: { type: 'string' },
							msg: { type: 'msg' }
						}
					}
				},
				successful: {
					type: 'array',
					items: { type: 'string' }
				}
			}
		},
		DocumentMarkAsPublishedRequestBody: {
			type: 'object',
			properties: {
				publishedBlobPath: {
					type: 'string',
					description: 'The published blob path',
					example: 'published/en010120-filename.pdf'
				},
				publishedBlobContainer: {
					type: 'string',
					description: 'The published blob container',
					example: 'published-documents'
				},
				publishedDate: {
					type: 'string',
					description: 'The published date',
					example: '2023-11-14T00:00:00Z'
				}
			}
		},
		DocumentMarkAsPublishedBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						publishedBlobPath: {
							type: 'string',
							example: 'Must provide a published blob path'
						},
						publishedBlobContainer: {
							type: 'string',
							example: 'Must provide a published blob container'
						},
						publishedDate: {
							type: 'string',
							example: 'Must provide a published date'
						}
					}
				}
			}
		},
		DocumentHTMLResponse: {
			type: 'object',
			properties: {
				html: {
					description: 'HTML string matching Front Office YouTube template',
					type: 'string'
				}
			}
		},
		DocumentBadHTMLResponse: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						message: {
							type: 'string'
						}
					}
				}
			}
		},
		PaginationRequestBody: {
			type: 'object',
			properties: {
				pageNumber: { type: 'integer', description: 'Page number requested', example: 1 },
				pageSize: { type: 'integer', description: 'Max number of items per page', example: 1 }
			}
		},
		S51AdviceCreateRequestBody: {
			type: 'object',
			properties: {
				caseId: { type: 'integer', description: 'The application id', example: 1 },
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation ',
					example: 'New Power Plc'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: {
					type: 'string',
					description: 'Date of enquiry yyyy-mm-dd',
					example: '2023-03-01'
				},
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: {
					type: 'string',
					description: 'Date advice given yyyy-mm-dd',
					example: '2023-03-01'
				},
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				}
			}
		},
		S51AdviceDocumentDetails: {
			type: 'object',
			properties: {
				documentName: {
					type: 'string',
					description: 'Document name',
					example: 'Small9'
				},
				documentType: {
					type: 'string',
					description: 'Document mime type',
					example: 'application/pdf'
				},
				documentSize: {
					type: 'number',
					description: 'Size of the document in bytes',
					example: 7945
				},
				dateAdded: {
					type: 'number',
					description: 'Date document was added',
					example: 1694179427
				},
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'not_checked'
				},
				documentGuid: {
					type: 'string',
					description: 'GUID of the document in the Document table',
					example: '742f3ba1-c80a-4f76-81c2-5a4627d6ac00'
				},
				version: {
					type: 'number',
					description: 'Document version number',
					example: 1
				}
			}
		},
		S51AdviceDetails: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'The S51 Advice record id', example: 1 },
				referenceNumber: {
					type: 'string',
					description: 'Advice reference 5 digits number',
					example: '00001'
				},
				referenceCode: {
					type: 'string',
					description: 'Advice reference number containing Case ref number',
					example: 'EN010001-Advice-00001'
				},
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: { type: 'number', description: 'Date of enquiry', example: 1_646_822_400 },
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: { type: 'number', description: 'Date advice given', example: 1_646_822_400 },
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				dateCreated: {
					type: 'number',
					description: 'Date advice record was created',
					example: 1_646_822_400
				},
				dateUpdated: {
					type: 'number',
					description: 'Date advice record was last updated',
					example: 1_646_822_400
				}
			}
		},
		S51AdviceDetailsWithCaseId: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'The S51 Advice record id', example: 1 },
				caseId: { type: 'integer', description: 'The application id', example: 1 },
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: {
					type: 'string',
					string: 'date-time',
					description: 'Date of enquiry',
					example: '2023-02-01T00:00:00.000Z'
				},
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: {
					type: 'string',
					string: 'date-time',
					description: 'Date advice given',
					example: '2023-02-01T00:00:00.000Z'
				},
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				referenceNumber: {
					type: 'integer',
					description: 'Advice reference number',
					example: '1'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				isDeleted: {
					type: 'boolean',
					description: 'True if the advice is marked as deleted',
					example: 'true'
				},
				createdAt: {
					type: 'string',
					string: 'date-time',
					description: 'Date advice record was created',
					example: '2023-02-01T00:00:00.000Z'
				},
				updatedAt: {
					type: 'string',
					string: 'date-time',
					description: 'Date advice record was last updated',
					example: '2023-02-01T00:00:00.000Z'
				}
			}
		},
		S51AdviceDetailsWithDocumentDetails: {
			type: 'object',
			properties: {
				id: { type: 'integer', description: 'The S51 Advice record id', example: 1 },
				referenceNumber: {
					type: 'string',
					description: 'Advice reference 5 digits number',
					example: '00001'
				},
				referenceCode: {
					type: 'string',
					description: 'Advice reference number containing Case ref number',
					example: 'EN010001-Advice-00001'
				},
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				firstName: { type: 'string', description: 'First name of enquirer', example: 'John' },
				lastName: { type: 'string', description: 'Last name of enquirer', example: 'Keats' },
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: { type: 'number', description: 'Date of enquiry', example: 1_646_822_400 },
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: { type: 'number', description: 'Date advice given', example: 1_646_822_400 },
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				dateCreated: {
					type: 'number',
					description: 'Date advice record was created',
					example: 1_646_822_400
				},
				dateUpdated: {
					type: 'number',
					description: 'Date advice record was last updated',
					example: 1_646_822_400
				},
				attachments: {
					type: 'array',
					items: { $ref: '#/definitions/S51AdviceDocumentDetails' }
				},
				totalAttachments: {
					type: 'number',
					description: 'Total S51 Documents attached to this advice',
					example: 1
				}
			}
		},
		S51AdvicePaginatedResponse: {
			type: 'object',
			properties: {
				page: {
					type: 'integer',
					description: 'The page number required',
					example: 1
				},
				pageDefaultSize: {
					type: 'integer',
					description: 'The default number of S51 Advice per page',
					example: 50
				},
				pageCount: {
					type: 'integer',
					description: 'The total number of pages',
					example: 1
				},
				itemCount: {
					type: 'integer',
					description: 'The total number of s51 Advice records on the case',
					example: 1
				},
				items: {
					type: 'array',
					items: { $ref: '#/definitions/S51AdviceDetails' }
				}
			}
		},
		S51AdvicePaginatedResponseWithDocumentDetails: {
			type: 'object',
			properties: {
				page: {
					type: 'integer',
					description: 'The page number required',
					example: 1
				},
				pageDefaultSize: {
					type: 'integer',
					description: 'The default number of S51 Advice per page',
					example: 50
				},
				pageCount: {
					type: 'integer',
					description: 'The total number of pages',
					example: 1
				},
				itemCount: {
					type: 'integer',
					description: 'The total number of s51 Advice records on the case',
					example: 1
				},
				items: {
					type: 'array',
					items: { $ref: '#/definitions/S51AdviceDetailsWithDocumentDetails' }
				}
			}
		},
		S51AdviceDetailsArrayWithCaseId: {
			type: 'object',
			properties: {
				results: {
					type: 'array',
					items: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
				}
			}
		},
		S51AdvicePaginatedBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						pageNumber: {
							type: 'string',
							example: 'Page Number is not valid'
						},
						pageSize: {
							type: 'string',
							example: 'Page Size is not valid'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		S51AdviceUpdateRequestBody: {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					description: 'Advice title',
					example: 'Advice regarding right to roam'
				},
				firstName: {
					type: 'string',
					description: 'First name of enquirer',
					example: 'John'
				},
				lastName: {
					type: 'string',
					description: 'Last name of enquirer',
					example: 'Keats'
				},
				enquirer: {
					type: 'string',
					description: 'Name of enquiring company / organisation',
					example: 'New Power Plc'
				},
				enquiryMethod: {
					type: 'string',
					enum: ['phone', 'email', 'meeting', 'post'],
					description: 'Enquiry method',
					example: 'email'
				},
				enquiryDate: {
					type: 'string',
					description: 'Date of enquiry',
					example: '2023-01-11T00:00:00.000Z'
				},
				enquiryDetails: {
					type: 'string',
					description: 'Details of the enquiry',
					example: 'details of the advice sought'
				},
				adviser: {
					type: 'string',
					description: 'Name of who gave the advice',
					example: 'John Caseworker-Smith'
				},
				adviceDate: {
					type: 'string',
					description: 'Date advice given',
					example: '2023-02-11T00:00:00.000Z'
				},
				adviceDetails: {
					type: 'string',
					description: 'Details of the advive given',
					example: 'details of the advice provided'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Published status',
					example: 'redacted'
				},
				publishedStatus: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'not_checked'
				}
			}
		},
		S51AdviceMultipleUpdateRequestBody: {
			type: 'object',
			properties: {
				redacted: {
					type: 'boolean',
					description: 'Redacted status',
					example: true
				},
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				items: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: { type: 'integer', description: 'The S51 Advice record id', example: 1 }
						}
					}
				}
			}
		},
		S51AdviceUpdateResponseItem: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: 'The S51 Advice record id',
					example: '1'
				},
				status: {
					type: 'string',
					enum: ['not_checked', 'checked', 'ready_to_publish', 'published', 'not_published'],
					description: 'Published status',
					example: 'published'
				},
				redactedStatus: {
					type: 'string',
					enum: ['not_redacted', 'redacted'],
					description: 'Redacted status',
					example: 'not_redacted'
				}
			}
		},
		S51AdviceMultipleUpdateResponseBody: {
			type: 'array',
			items: { $ref: '#/definitions/S51AdviceUpdateResponseItem' }
		},
		S51AdviceUpdateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						items: {
							type: 'string',
							example: 'Unknown S51 Advice id 100'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		S51AdvicePublishRequestBody: {
			type: 'object',
			properties: {
				selectAll: {
					type: 'boolean',
					description:
						'Optional parameter. True if all S51 Advice in the publishing queue for that case is to be published',
					example: true
				},
				ids: {
					type: 'array',
					items: {
						type: 'string',
						example: '1'
					},
					description: 'Array of S51 Advice Ids to publish'
				}
			}
		},
		ProjectUpdateNotificationLogList: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/ProjectUpdateNotificationLog')
		},
		ProjectUpdateNotificationLogListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: paginationErrors
				}
			}
		},
		ProjectUpdateNotificationLogCreateRequest: {
			type: 'array',
			items: { $ref: '#/definitions/ProjectUpdateNotificationLog' }
		},
		ProjectUpdateNotificationLogCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						'[*].projectUpdateId': {
							type: 'string',
							example: 'projectUpdateId is required'
						},
						'[*].subscriptionId': {
							type: 'string',
							example: 'subscriptionId is required'
						},
						'[*].entryDate': {
							type: 'string',
							example: 'entryDate is required'
						},
						'[*].emailSent': {
							type: 'string',
							example: 'emailSent must be a boolean'
						},
						'[*].functionInvocationId': {
							type: 'string',
							example: 'functionInvocationId must be a string'
						}
					}
				}
			}
		},
		ProjectUpdateNotificationLog: {
			type: 'object',
			required: [
				'projectUpdateId',
				'subscriptionId',
				'entryDate',
				'emailSent',
				'functionInvocationId'
			],
			properties: {
				id: { type: 'integer', minimum: 0 },
				projectUpdateId: { type: 'integer', minimum: 0 },
				subscriptionId: { type: 'integer', minimum: 0 },
				entryDate: {
					type: 'string',
					format: 'date-time',
					description: 'the date this notification was handled',
					example: '2022-12-21T12:42:40.885Z'
				},
				emailSent: {
					type: 'boolean',
					description: 'whether an email was successfully sent'
				},
				functionInvocationId: {
					type: 'string',
					description: 'the ID of the Azure function run that handled this entry'
				}
			}
		},
		RepresentationSummary: {
			type: 'object',
			properties: {
				id: {
					type: 'number',
					example: 1
				},
				reference: {
					type: 'string',
					example: 'BC0110001-2'
				},
				status: {
					type: 'string',
					example: 'VALID'
				},
				redacted: {
					type: 'boolean',
					example: true
				},
				received: {
					type: 'string',
					example: '2023-03-14T14:28:25.704Z'
				},
				firstName: {
					type: 'string',
					example: 'James'
				},
				lastName: {
					type: 'string',
					example: 'Bond'
				},
				organisationName: {
					type: 'string',
					example: 'MI6'
				}
			}
		},
		Subscriptions: {
			type: 'object',
			properties: pagedResponseProperties('#/definitions/Subscription')
		},
		SubscriptionsListBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							example: 'type must be one of ...'
						},
						caseReference: {
							type: 'string',
							example: 'must be a string'
						},
						...paginationErrors
					}
				}
			}
		},
		SubscriptionGetRequest: {
			type: 'object',
			required: ['caseReference', 'emailAddress'],
			properties: {
				caseReference: {
					type: 'string',
					example: 'SOMEREF'
				},
				emailAddress: {
					type: 'string',
					example: 'me@example.com'
				}
			}
		},
		SubscriptionGetBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						caseReference: {
							type: 'string',
							example: 'caseReference is required'
						},
						emailAddress: {
							type: 'string',
							example: 'emailAddress is required'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionCreateRequest: {
			type: 'object',
			required: ['caseReference', 'emailAddress', 'subscriptionType'],
			properties: {
				caseReference: {
					type: 'string',
					description: 'the case reference the subscription relates to'
				},
				emailAddress: {
					type: 'string',
					format: 'email',
					examples: ['alan.turing@planninginspectorate.gov.uk']
				},
				subscriptionTypes: {
					type: 'array',
					items: {
						type: 'string',
						enum: ['allUpdates', 'applicationSubmitted', 'applicationDecided', 'registrationOpen']
					},
					description: 'which updates does the subscriber wants to get notified of'
				},
				startDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to start getting updates'
				},
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				},
				language: {
					type: 'string',
					enum: ['English', 'Welsh'],
					default: 'English'
				}
			}
		},
		SubscriptionCreateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						caseReference: {
							type: 'string',
							example: 'caseReference is required'
						},
						emailAddress: {
							type: 'string',
							example: 'emailAddress is required'
						},
						subscriptionTypes: {
							type: 'string',
							example: 'subscriptionTypes is required'
						},
						startDate: {
							type: 'string',
							example: 'startDate must be a valid date'
						},
						endDate: {
							type: 'string',
							example: 'endDate must be a valid date'
						},
						language: {
							type: 'string',
							example: "language must be one of 'English', 'Welsh'"
						},
						code: {
							type: 'string',
							example: 'P2002',
							description: 'prisma error code'
						},
						constraint: {
							type: 'string',
							example: 'caseReference and emailAddress combination must be unique'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionUpdateRequest: {
			type: 'object',
			required: ['endDate'],
			properties: {
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				}
			}
		},
		SubscriptionUpdateBadRequest: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						endDate: {
							type: 'string',
							example: 'endDate must be a valid date'
						},
						id: {
							type: 'string',
							example: "id must be a valid integer'"
						},
						code: {
							type: 'string',
							example: 'P2002',
							description: 'prisma error code'
						},
						notFound: {
							type: 'string',
							example: 'subscription not found'
						},
						unknown: {
							type: 'string'
						}
					}
				}
			}
		},
		SubscriptionNotFound: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						notFound: {
							type: 'string',
							example: 'subscription not found'
						}
					}
				}
			}
		},
		Subscription: {
			type: 'object',
			required: ['caseReference', 'emailAddress', 'subscriptionType'],
			properties: {
				id: {
					type: 'number',
					description: 'back office ID for this subscription'
				},
				caseReference: {
					type: 'string',
					description: 'the case reference the subscription relates to'
				},
				emailAddress: {
					type: 'string',
					format: 'email',
					examples: ['alan.turing@planninginspectorate.gov.uk']
				},
				subscriptionTypes: {
					type: 'array',
					items: {
						type: 'string',
						enum: ['allUpdates', 'applicationSubmitted', 'applicationDecided', 'registrationOpen']
					},
					description: 'which updates does the subscriber wants to get notified of'
				},
				startDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to start getting updates'
				},
				endDate: {
					type: 'string',
					format: 'date-time',
					description: 'The date to stop getting updates'
				},
				language: {
					type: 'string',
					enum: ['English', 'Welsh'],
					default: 'English'
				}
			}
		},
		ProjectTeamMember: {
			type: 'object',
			properties: {
				userId: { type: 'string', example: 'abcd-0001-fghi' },
				caseId: { type: 'number', example: 1 },
				role: { type: 'string', example: 'officer' }
			}
		},
		ProjectTeamMembers: {
			type: 'array',
			items: { $ref: '#/definitions/ProjectTeamMembers' }
		},
		GeneralError: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							example: 'something went wrong'
						}
					}
				}
			}
		},
		InternalError: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						unknown: {
							type: 'string',
							example: 'unknown internal error'
						}
					}
				}
			}
		},
		NotFound: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						notFound: {
							type: 'string',
							example: 'resource not found'
						}
					}
				}
			}
		},
		ApplicationKeyDates: {
			type: 'object',
			properties: {
				preApplication: {
					type: 'object',
					properties: {
						datePINSFirstNotifiedOfProject: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateProjectAppearsOnWebsite: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						anticipatedSubmissionDateNonSpecific: {
							type: 'string',
							description: 'Quarter followed by year',
							example: 'Q1 2023'
						},
						anticipatedDateOfSubmission: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						screeningOpinionSought: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						screeningOpinionIssued: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						scopingOpinionSought: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						scopingOpinionIssued: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						section46Notification: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				acceptance: {
					type: 'object',
					properties: {
						dateOfDCOSubmission: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						deadlineForAcceptanceDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfDCOAcceptance: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfNonAcceptance: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				preExamination: {
					type: 'object',
					properties: {
						dateOfRepresentationPeriodOpen: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfRelevantRepresentationClose: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						extensionToDateRelevantRepresentationsClose: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateRRepAppearOnWebsite: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateIAPIDue: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						rule6LetterPublishDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						preliminaryMeetingStartDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						notificationDateForPMAndEventsDirectlyFollowingPM: {
							type: 'number',
							example: 1_646_822_600
						},
						notificationDateForEventsDeveloper: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				examination: {
					type: 'object',
					properties: {
						dateSection58NoticeReceived: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						confirmedStartOfExamination: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						rule8LetterPublishDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						deadlineForCloseOfExamination: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateTimeExaminationEnds: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage4ExtensionToExamCloseDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				recommendation: {
					type: 'object',
					properties: {
						deadlineForSubmissionOfRecommendation: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						dateOfRecommendations: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage5ExtensionToRecommendationDeadline: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				decision: {
					type: 'object',
					properties: {
						deadlineForDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						confirmedDateOfDecision: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						},
						stage5ExtensionToDecisionDeadline: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				postDecision: {
					type: 'object',
					properties: {
						jRPeriodEndDate: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				},
				withdrawal: {
					type: 'object',
					properties: {
						dateProjectWithdrawn: {
							type: 'number',
							description: 'Unix timestamp date',
							example: 1_646_822_600
						}
					}
				}
			}
		}
	},
	components: {}
};

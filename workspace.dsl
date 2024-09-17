workspace "Applications service" {

	!docs architecture

	model {
		# Required for nested groups - https://docs.structurizr.com/dsl/cookbook/groups/
		properties {
				"structurizr.groupSeparator" "/"
		}

		group "Planning Inspectorate"{
			userCaseWorker = person "Case worker" "Member of PINS staff who administers project information"
			userCaseManager = person "Case manager" "Member of PINS staff who manages case workers"
			userInspector = person "Inspector" "Member of PINS Inspector staff who decides cases"
			userMigrationAdmin = person "Migration Admin" "Member of PINS staff who can trigger a case migration"

			systemAppsCbos = softwareSystem "CBOS - Casework Back-Office System" "Internally facing service allowing for management of cases relating to Nationally Significant Infrastructure Projects (NSIPs) within England and Wales"  {

				group "Applications Service Storage Account" {
					containerCbosFileStorage = container "CBOS File storage" "(application-service-uploads) - Azure Blob Storage Container that contains all documents and document versions in CBOS" {
						tags "Microsoft Azure - Blob Block"
					}
					containerCbosFileStoragePublished = container "Published File storage" "(published-documents) - Azure Blob Storage Container that contains all Published documents, also accessible by Front Office"{
						tags "Microsoft Azure - Blob Block"
					}
					containerSharedFileSubmissionsStorage = container "Front Office Submissions File storage" "(application-submission-documents) - Azure Blob Storage Container that contains documents submitted from Front Office, also accessible by CBOS"{
						tags "Microsoft Azure - Blob Block"
					}
				}

				containerCbosWeb = container "CBOS Web" "Back-office website used to manage cases" "Node.js, Azure Web App" {
					tags "Microsoft Azure - App Services"
				}

				containerCbosApi = container "Web CBOS API" "CBOS API to perform CRUD operations on NSIP cases, documents, S51 Advice, Relevant Representations, Exam Timetables etc, on the database, and broadcast events to the Azure Service Bus" "Node.js, Azure Web App" {
					tags "Microsoft Azure - App Services"
				}

				containerCbosAzureSql = container "Database" "Source of truth for cases, built and maintained from model using Prisma" "Azure SQL, Prisma" {
					tags "Database" "Microsoft Azure - Azure SQL"
				}

				containerCommandHandlerFunctionApp = container "Command Handler Function App" "Function App to receive commands from Front Office" "Function App, JavaScript" {
					tags "Microsoft Azure - Function Apps", "FunctionApp"
					componentFunctionDeadlineSubmissions = component "Process Front Office Deadine Submissions" "Process written submissions from the Front Office" "Function App, JavaScript" {
					}
					componentFunctionTestDeadlineSubmissions = component "Force Test a Deadine Submission" "Process written submissions from the Front Office" "Function App, JavaScript" {
					}
					componentFunctionHandleSubscription = component "Process Front Office Subscriptions" "Process Email Subscription Updates from Front Office" "Function App, JavaScript" {
					}
					componentFunctionRegisterRepresentation = component "Process Relevant Representations" "Process Relevant Representatios from Front Office" "Function App, JavaScript"{
					}
				}

				containerBackgroundJobsFunctionApp = container "Background Jobs Function App" "Function App to receive commands from CBOS" "Function App, JavaScript" {
					tags "Microsoft Azure - Function Apps", "FunctionApp"
					componentFunctionPublishDoc = component "Publish Document" "Publish a document to Front Office" "Function App, JavaScript"
					componentFunctionUnpublishDoc = component "Unpublish Document" "Unpublish a document from Front Office" "Function App, JavaScript"
					componentFunctionNotifySubscribers = component "Send Email to Subscribers" "Send an Email to Subscribers via Gov Notify" "Function App, JavaScript"
					componentFunctionMalwareDetected  = component "Updates document Malware Scan Status" "Updates Malware status of documents to CBOS" "Function App, JavaScript"
				}

				containerMigrationFunctionApp = container "Migration Function App" "Function App to process migrated case and document data from Horizon" "Function App, JavaScript, Azure SQL, Prisma, SynapseDB" {
					tags "Microsoft Azure - Function Apps", "FunctionApp"
					componentFunctionMigrateS51AdviceGeneral = component "Migrate General S51 Advice" "Migrate General S51 Advice from Horizon" "JavaScript, SynapseDB"
					componentFunctionMigrateCase = component "Migrate Case" "Migrate whole case and all component parts - Exam Timetable, Folders, Documents, S51 Advice, Relevant Representations, Project Updates and Service Users from Horizon" "JavaScript, SynapseDB"

					group "Case Components" {
						componentFunctionMigrateProjectOnly = component "Migrate Project" "Migrate Case data only from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateExamTimetable = component "Migrate Exam Timetable" "Migrate exam timetable records from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateFolder = component "Migrate Folder" "Migrate Folders from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateProjectUpdate = component "Migrate Project Updates" "Migrate Project Updates from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateServiceUser = component "Migrate Service User" "Migrate Service Users from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateS51AdviceCase = component "Migrate S51 Advice on a case" "Migrate S51 Advice on a case from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateDocument = component "Migrate Documents" "Migrate Documents from Horizon" "JavaScript, SynapseDB"
						componentFunctionMigrateRepresentation = component "Migrate Relevant Representations" "Migrate Relevant Representations from Horizon" "JavaScript, SynapseDB"
					}
				}
			}

			systemAppsFo = softwareSystem "Applications Front-Office" "External facing service providing ability to participate in the application process for Nationally Significant Infrastructure Projects (NSIPs) within England and Wales" "Node.js, Azure Web App, Azure Function App" {
				tags "InternalCollaboratorSystem"
			}

			systemOdw = softwareSystem "Operational Data Warehouse (ODW)" "Holds all Planning Inspectorate data so that it can be used for internal purposes" {
				tags "Microsoft Azure - Azure Synapse Analytics" "InternalCollaboratorSystem"
			}
		}

		systemGovNotify = softwareSystem "GOV Notify" "UK government messaging platform for sending emails, text and letters to users" {
			tags = "ExternalSystem"
		}

		##################################################################################
		# Relationships
		userCaseWorker -> containerCbosWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"
		userCaseManager -> containerCbosWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"
		userInspector -> containerCbosWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"

		# Back-office
		containerCbosWeb -> containerCbosApi "Renders page, gets and posts data using" "HTTPS, JSON"
		containerCbosApi -> containerCbosAzureSql "Reads and writes case data to"
		containerCbosApi -> containerCbosFileStorage "Reads and writes applications documents to"
		containerCbosApi -> containerCbosFileStoragePublished "Writes published applications documents to"
		containerCbosApi -> systemOdw "Broadcasts Service Bus events to" {
			tags "ServiceBus"
		}

		# Function App - Command Handlers
		componentFunctionDeadlineSubmissions -> containerCbosApi "Creates document records"
		componentFunctionDeadlineSubmissions -> containerSharedFileSubmissionsStorage "Reads documents submitted via Front Office"
		componentFunctionDeadlineSubmissions -> containerCbosFileStorage "Writes documents submitted via Front Office into CBOS"

		componentFunctionHandleSubscription -> containerCbosApi "Creates and updates email subscription records"
		componentFunctionRegisterRepresentation -> containerCbosApi "Creates relevant representation records"

		componentFunctionTestDeadlineSubmissions -> containerSharedFileSubmissionsStorage "Write a test document"
		componentFunctionTestDeadlineSubmissions -> componentFunctionDeadlineSubmissions "Broadcast a test Deadline Submission message" "Azure Service Bus Topic deadline-submission-topic" "ServiceBus"

		# Function App - Background Tasks
		componentFunctionNotifySubscribers -> systemGovNotify "Sends subscriber emails through" "HTTPS, JSON"
		componentFunctionNotifySubscribers -> containerCbosApi "Reads and updates subscription and project records"

		componentFunctionPublishDoc -> containerCbosApi "Reads and updates applications documents records"
		componentFunctionPublishDoc -> containerCbosFileStorage "Reads applications documents from CBOS"
		componentFunctionPublishDoc -> containerCbosFileStoragePublished "Copies published applications documents to"

		componentFunctionUnpublishDoc -> containerCbosApi "Reads and updates applications documents records"
		componentFunctionUnpublishDoc -> containerCbosFileStoragePublished "Deletes published applications documents from"

		containerCbosFileStorage -> componentFunctionMalwareDetected "MS Defender sends result of document malware scan" "HTTPS, EventGrid"
		componentFunctionMalwareDetected -> containerCbosApi "Updates applications documents records malware check status"


		# Function App - Migration
		userMigrationAdmin -> componentFunctionMigrateCase "Triggers a migration"
		componentFunctionMigrateCase -> componentFunctionMigrateProjectOnly "Migrates case data"
		componentFunctionMigrateCase -> componentFunctionMigrateExamTimetable "Migrates Exam Timetable"
		componentFunctionMigrateCase -> componentFunctionMigrateFolder "Migrates Folders"
		componentFunctionMigrateCase -> componentFunctionMigrateProjectUpdate "Migrates Project Updates"
		componentFunctionMigrateCase -> componentFunctionMigrateServiceUser "Migrates Service Users"
		componentFunctionMigrateCase -> componentFunctionMigrateS51AdviceCase "Migrates S51 Advice"
		componentFunctionMigrateCase -> componentFunctionMigrateDocument "Migrates Documents and Versions"
		componentFunctionMigrateCase -> componentFunctionMigrateRepresentation "Migrates Relevant Representations"

		componentFunctionMigrateProjectOnly -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateProjectOnly -> containerCbosApi "Writes records"
		componentFunctionMigrateExamTimetable -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateExamTimetable -> containerCbosApi "Writes records"
		componentFunctionMigrateFolder -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateFolder -> containerCbosApi "Writes records"
		componentFunctionMigrateProjectUpdate -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateProjectUpdate -> containerCbosApi "Writes records"
		componentFunctionMigrateServiceUser -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateServiceUser -> containerCbosApi "Writes records"
		componentFunctionMigrateS51AdviceCase -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateS51AdviceCase -> containerCbosApi "Writes records"
		componentFunctionMigrateDocument -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateDocument -> containerCbosApi "Writes records"
		componentFunctionMigrateRepresentation -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateRepresentation -> containerCbosApi "Writes records"

		componentFunctionMigrateS51AdviceGeneral -> systemOdw "Reads records from curated layer"
		componentFunctionMigrateS51AdviceGeneral -> containerCbosApi "Writes records"


		# Front-Office also talks directly to the published file storage
		systemAppsFo -> containerCbosFileStoragePublished "Reads published documents from"
	}

	views {

		properties {
			"structurizr.sort" "created"
		}

		systemContext systemAppsFo "ApplicationsCBOSContext" {
			include *
			autoLayout lr
			title "Applications Back-Office Context"
		}

		component containerCommandHandlerFunctionApp "CommandHandlerFunctionAppContext" {
			include *
			autoLayout lr
			title "Function App - Command Handler"
		}

		component containerBackgroundJobsFunctionApp "BackgroundJobsFunctionAppContext" {
			include *
			autoLayout lr
			title "Function App - Background Jobs"
		}

		component containerMigrationFunctionApp "MigrationFunctionAppContext" {
			include *
			include containerCbosAzureSql
			autoLayout lr
			title "Function App - Migration"
		}

		container systemAppsCbos "ApplicationsCBOSContainer" {
			include *
			autoLayout lr
			title "Applications Back-Office Container"
			description "Shows the containers within the Applications Front-Office system. Go to the next view to see the rest."
		}

		container systemAppsCbos "ApplicationsCBOSFunctionApps" {
			include element.tag==FunctionApp
			include containerCbosAzureSql
			include containerCbosApi
			include containerSharedFileSubmissionsStorage
			include containerCbosFileStorage
        	autoLayout tb
			title "Applications Back-Office Function Apps"
			description "Shows the function apps within the Applications Back-Office system CBOS - these are responsible for consuming messages from the Service Bus and updating the Azure SQL database."
		}

		# Azure icons only, latest version
		theme default
		theme https://static.structurizr.com/themes/microsoft-azure-2023.01.24/icons.json

		styles {

			element Database {
				shape Cylinder
			}

			element ExternalSystem {
				background #AAAAAA
			}

			element InternalCollaboratorSystem {
				background #888888
			}

			relationship ServiceBus {
					style dotted
			}
		}
	}
}

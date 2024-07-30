workspace "Applications service" {
	model {
		# Required for nested groups - https://docs.structurizr.com/dsl/cookbook/groups/
		properties {
				"structurizr.groupSeparator" "/"
		}

		group "Planning Inspectorate"{
			userCaseWorker = person "Case worker" "Member of PINS staff who administers project information"
			userCaseManager = person "Case manager" "Member of PINS staff who manages case workers"
			userInspector = person "Inspector" "Member of PINS Inspector staff who decides cases"

			systemAppsBo = softwareSystem "CBOS - Casework Back-Office System" "Internally facing service allowing for management of cases relating to Nationally Significant Infrastructure Projects (NSIPs) within England and Wales"  {

				containerBoFileStorage = container "File storage" "Azure Blob Storage that contains all documents and document versions in CBOS"{
					tags "Microsoft Azure - Blob Block"
				}
				containerBoFileStoragePublished = container "Published File storage" "Azure Blob Storage that contains all Published documents, also accessible by Front Office"{
					tags "Microsoft Azure - Blob Block"
				}

				containerBoWeb = container "BO Web" "Back-office website used to manage cases" "Node.js, Azure Web App"{
					tags "Microsoft Azure - App Services"
				}

				containerBoApi = container "Web BO API" "CBOS API to perform CRUD operations on NSIP cases, documents, S51 Advice, Relevant Representations, Exam Timetables etc, on the database, and broadcast events to the Azure Service Bus" "Node.js, Azure Web App" {
					tags "Microsoft Azure - App Services"
				}

				containerBoAzureSql = container "Database" "Source of truth for cases, built and maintained from model using Prisma" "Azure SQL, Prisma" {
					tags "Database" "Microsoft Azure - Azure SQL"
				}

				group "Function Apps"{
					containerFunctionApp = container "Entity change broadcast" "Broadcasts messages to Service Bus. A Function App exists for each topic broadcasted" "Function App, JavaScript"{
						tags "Microsoft Azure - Function Apps", "FunctionApp"
					}

					# containerFunctionAppAdvice = container "Advice" "Broadcasts Advice messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppAdviceUnpublish = container "Advice Unpublish" "Broadcasts Advice unpublish messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppDocumentMetadata = container "Document Metadata" "Broadcasts Document Metadata messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppDocumentMetadataUnpublish = container "Document Metadata Unpublish" "Broadcasts Document Metadata Unpublish messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppExamTimeTable = container "Exam Time Table" "Broadcasts ExamTimeTable messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppExamTimeTableUnpublish = container "Exam Time Table Unpublish" "Broadcasts ExamTimeTable Unpublish messages from Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppProjects = container "Projects" "Broadcasts Project messages from Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppProjectsUnpublish = container "Projects Unpublish" "Broadcasts Project Unpublish messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppProjectUpdates = container "Project Updates" "Broadcasts Project Update messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppRepresentations = container "Representations" "Broadcasts Representation messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppRepresentationUpdate = container "Representation Update" "Broadcasts Representation Update messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppRepresentationsUnpublish = container "Representations Unpublish" "Broadcasts Representation Unpublish messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppServiceUsers = container "Service Users" "Broadcasts Service User (Represented or Representative) messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }

					# containerFunctionAppServiceUsersUnpublish = container "Service Users Unpublish" "Broadcasts Service User Unpublish messages to Service Bus" "Function App, JavaScript"{
					# 	tags "Microsoft Azure - Function Apps", "FunctionApp"
					# }
				}
			}

			systemAppsFo = softwareSystem "Applications Front-Office" "External facing service providing ability to participate in the application process for Nationally Significant Infrastructure Projects (NSIPs) within England and Wales" "Node.js, Azure Web App, Azure Function App" {
				tags "InternalCollaboratorSystem"
			}

			systemOdw = softwareSystem "Operational Data Warehouse (ODW)" "Holds all Planning Inspectorate data so that it can be used for internal purposes" {
				tags "Microsoft Azure - Azure Synapse Analytics" "InternalCollaboratorSystem"
			}
		}

		##################################################################################
		# Relationships
		userCaseWorker -> containerBoWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"
		userCaseManager -> containerBoWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"
		userInspector -> containerBoWeb "Manages cases through" "HTTPS, HTML, Active Directory Auth"

		# Back-office
		containerBoWeb -> containerBoApi "Renders page, gets and posts data using" "HTTPS, JSON"
		containerBoApi -> containerBoAzureSql "Reads and writes case data to"
		containerBoApi -> containerBoFileStorage "Reads and writes applications documents to"
		containerBoApi -> containerBoFileStoragePublished "Reads and writes published applications documents to"

		containerFunctionApp -> systemAppsFo "Broadcasts message on entity changes" "Azure Service Bus" "ServiceBus"
		containerFunctionApp -> systemOdw "Broadcasts message on entity change" "Azure Service Bus" "ServiceBus"

		# Front-Office also talks directly to the published file storage
		systemAppsFo -> containerBoFileStoragePublished "reads published documents from"

		# TODO Determine if it's more suitable to list each topic as below, rather than grouping all Function Apps together
		# containerBoApi -> systemAppsFo "Broadcasts message on Advice changes" "Azure Service via topic s51-advice" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Advice Unpublish changes" "Azure Service via topic s51-advice" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Document Metadata changes" "Azure Service via topic nsip-document" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Document Metadata Unpublish changes" "Azure Service via topic nsip-document" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Exam Time Table changes" "Azure Service via topic nsip-exam-timetable" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Exam Time Table Unpublish changes" "Azure Service via topic nsip-exam-timetable" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Project changes" "Azure Service via topic nsip-project" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Project Unpublish changes" "Azure Service via topic nsip-project" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Project Update changes" "Azure Service via topic nsip-project-update" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Representation changes" "Azure Service via topic nsip-representation" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Representation Update changes" "Azure Service via topic nsip-representation" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Representation Unpublish changes" "Azure Service via topic nsip-representation" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Service User changes" "Azure Service via topic nsip-service-user" "ServiceBus"
		# containerBoApi -> systemAppsFo "Broadcasts message on Service User Unpublish changes" "Azure Service via topic nsip-service-user" "ServiceBus"
	}

	views {

		properties {
			"structurizr.sort" "created"
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

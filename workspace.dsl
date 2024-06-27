workspace "Applications service" {
	model {
		# Required for nested groups - https://docs.structurizr.com/dsl/cookbook/groups/
		properties {
				"structurizr.groupSeparator" "/"
		}

		userPublicIndividual = person "Private individual" "Member of public interested in nationally significant infrastructure projects"
		userMemberOfOrg = person "Member of organisation" "Member of an organisation interested in nationally significant infrastructure projects"
		userAgent = person "Agent" "Represent a private individual family or organisation"

		group "Planning Inspectorate"{
			userCaseWorker = person "Case worker" "Member of PINS staff who administers project information"

			systemAppsBo = softwareSystem "Applications Back-Office" "Internally facing service allowing for management of cases relating to Nationally Significant Infrastructure Projects (NSIPs) within England and Wales"  {

				containerBoFileStorage = container "File storage" "### NEEDS DESCRIPTION ###"{
					tags "Microsoft Azure - Blob Storage"
				}

				containerBoWeb = container "BO Web" "Back-office website used to manage cases" "Node.js, Azure Web App"{
					tags "Microsoft Azure - App Services"
				}

				containerBoApi = container "Web BO API" "" "Node.js, Azure Web App" {
					tags "Microsoft Azure - App Services"
				}

				containerBoAzureSql = container "Database" "Source of truth for cases" "Azure SQL" {
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
		# Releationships
		userPublicIndividual -> systemAppsFo "Finds project information and registers interest" "HTTPS, HTML"
		userMemberOfOrg -> systemAppsFo "Finds project information and registers interest" "HTTPS, HTML"
		userAgent -> systemAppsFo "Finds project information and registers interest" "HTTPS, HTML"
		userCaseWorker -> systemAppsBo "Manages cases through" "HTTPS, HTML, Active Directory Auth"

		# Back-office
		containerBoWeb -> containerBoApi "Renders page, gets and posts data using" "HTTPS, JSON"
		containerBoApi -> containerBoAzureSql "Reads and writes case data to"
		containerBoApi -> containerBoFileStorage "Reads and writes appeal documents to"

		containerFunctionApp -> systemAppsFo "Broadcasts message on entity changes" "Azure Service Bus" "ServiceBus"
		containerFunctionApp -> systemOdw "Broadcasts message on entity change" "Azure Service Bus" "ServiceBus"

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

		# Azure icons only
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

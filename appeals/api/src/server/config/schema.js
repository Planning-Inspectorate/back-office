import joi from 'joi';

export default joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		PORT: joi.number(),
		SWAGGER_JSON_DIR: joi.string(),
		DATABASE_URL: joi.string(),
		DISABLE_INTEGRATIONS: joi.boolean(),
		defaultApiVersion: joi.string(),
		serviceBusOptions: joi.object({
			hostname: joi.string().optional()
		}),
		msal: joi.object({
			clientId: joi.string().optional(),
			clientSecret: joi.string().optional(),
			tenantId: joi.string().optional()
		}),
		log: joi.object({
			levelFile: joi.string(),
			levelStdOut: joi.string()
		}),
		cwd: joi.string(),
		featureFlags: joi.object().pattern(/featureFlagBoas\d+[A-Za-z]+/, joi.boolean()),
		serviceBusEnabled: joi.boolean().optional(),
		timetable: joi.object({
			FPA: joi.object({
				lpaQuestionnaireDueDate: joi.object({
					daysFromStartDate: joi.number()
				}),
				statementReviewDate: joi.object({
					daysFromStartDate: joi.number()
				}),
				finalCommentReviewDate: joi.object({
					daysFromStartDate: joi.number()
				})
			}),
			HAS: joi.object({
				lpaQuestionnaireDueDate: joi.object({
					daysFromStartDate: joi.number()
				})
			})
		}),
		govNotify: joi
			.object({
				api: joi.object({
					key: joi.string() // optional if not NODE_ENV=production
				}),
				template: joi.object({
					validAppellantCase: joi.object({
						id: joi.string()
					})
				}),
				testMailbox: joi.string()
			})
			.when('NODE_ENV', {
				not: 'production',
				then: joi.object({ api: joi.object({ key: joi.optional() }) })
			}),
		bankHolidayFeed: joi.object({
			hostname: joi.string()
		}),
		appealAllocationLevels: joi.array().items(
			joi.object({
				level: joi.string(),
				band: joi.number()
			})
		),
		appealFolderPaths: joi.array().items(joi.string()),
		appealStages: joi.object({
			appellantCase: joi.string(),
			lpaQuestionnaire: joi.string()
		})
	})
	.options({ presence: 'required' }); // required by default;

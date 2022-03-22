import "express-session";

declare module "express-session" {
    interface SessionData {
		appealWork: {
			reviewOutcome: 'valid' | 'invalid' | 'incomplete',
			descriptionOfDevelopment: string
		},
		appealData: {
			AppealId: number,
			AppealReference: string,
			AppellantName: string,
			AppealStatus: string,
			Received: string,
			AppealSite: string,
			LocalPlanningDepartment: string,
			PlanningApplicationReference: string,
			Documents: Array<{ Type: string, Filename: string, URL: string }>
		}
    }
}

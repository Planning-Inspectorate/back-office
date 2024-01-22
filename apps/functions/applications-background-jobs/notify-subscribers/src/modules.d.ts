declare module 'notifications-node-client' {
	interface Response {
		id: string;
		reference: string | null;
		content: {
			subject: string;
			body: string;
			from_email: string;
		};
		uri: string;
		template: {
			id: string;
			version: number;
			uri: string;
		};
	}
	interface Options {
		personalisation: {
			[key: string]: string;
		};
		reference: string;
		emailReplyToId?: string;
	}
	class NotifyClient {
		constructor(apiKey: string);
		sendEmail(templateId: string, emailAddress: string, options: Options): Promise<Response>;
	}
}

// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: local data model for service user

export const mapServiceUserIn = (appellant, agent) => {
	let user = {
		name: `${appellant.firstName} ${appellant.lastName}`,
		email: appellant.emailAddress
	};

	if (agent) {
		user.agentName = `${agent.firstName} ${agent.lastName}`;
	}

	return user;
};

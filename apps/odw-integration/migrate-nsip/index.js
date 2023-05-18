/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, nsipProject) => {
	context.log(`Migrating nsip project ${nsipProject.id}`);
};

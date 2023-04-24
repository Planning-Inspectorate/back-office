/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, myBlob) => {
	context.log(
		'JavaScript blob trigger function processed blob \n Blob:',
		context.bindingData.blobTrigger,
		'\n Blob Size:',
		myBlob.length,
		'Bytes'
	);
};

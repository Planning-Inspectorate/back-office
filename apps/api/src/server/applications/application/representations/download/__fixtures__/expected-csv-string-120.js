export const expectedCSVStringTest =
	'IP number,On behalf of,Email Address,address line 1,address line 2,address line 3,address line 4,address line 5,address line 6,postcode,Email or Post?\n' +
	Array(120)
		.fill(
			'BC0110001-36,James Test,test-agent@example.com,James Bond,Copthalls Clevedon Road,West Hill,,,,BS48 1PN,'
		)
		.join('\n') +
	'\n';

export const expectedValidCSVStringTest =
	'Name,Postcode,Attachments,IP number,Status,Action Date,Representation\n' +
	Array(120)
		.fill(
			'James Bond,BS48 1PN,Yes,BC0110001-36,VALID,2020-01-01T12:00:00.000Z,Edited comment for valid rep'
		)
		.join('\n') +
	'\n';

export const getIsMaterialChangeStaticDataViewModel = (isMaterialChange = false) => [
	{
		text: 'Yes',
		value: 'true',
		checked: isMaterialChange
	},
	{
		text: 'No',
		value: 'false',
		checked: !isMaterialChange
	}
];

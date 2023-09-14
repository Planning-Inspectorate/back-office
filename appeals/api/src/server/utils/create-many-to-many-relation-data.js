/**
 * @param {{
 *  data: (number | string)[]
 *  relationOne: string
 *  relationTwo: string
 *  relationOneId: number
 * }} param0
 * @returns
 */
const createManyToManyRelationData = ({ data, relationOne, relationTwo, relationOneId }) =>
	data.map((item) => ({
		[relationOne]: relationOneId,
		[relationTwo]: Number(item)
	}));

export default createManyToManyRelationData;

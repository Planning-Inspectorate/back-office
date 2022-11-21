/**
 * @type {*}
 */
const featureFlags = {
	local: {
		featureFlagBoasXTestFeature: true
	},
	development: {
		featureFlagBoasXTestFeature: true
	},
	test: {
		featureFlagBoasXTestFeature: true
	},
	production: {
		featureFlagBoasXTestFeature: false
	}
};

export default featureFlags;

import Appeal from '../../../db/models/appeal.js';

const appealRepository = {
	getAll: function() {
		return Appeal.findAll();
	}
};

export default appealRepository;

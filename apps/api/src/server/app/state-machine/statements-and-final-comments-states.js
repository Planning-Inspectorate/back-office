const statementsAndFinalCommentsStates = {
	initial: 'available_for_statements',
	states: {
		available_for_statements: {
			on: {
				RECEIVED_STATEMENTS: 'available_for_final_comments',
				DID_NOT_RECEIVE_STATEMENTS: 'closed_for_statements_and_final_comments'
			}
		},
		available_for_final_comments: {
			on: {
				RECEIVED_FINAL_COMMENTS: 'closed_for_statements_and_final_comments'
			}
		},
		closed_for_statements_and_final_comments: {
			type: 'final'
		}
	}
};

export { statementsAndFinalCommentsStates };

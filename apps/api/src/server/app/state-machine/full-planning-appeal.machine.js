import { createMachine, interpret } from "xstate";

const validationStates = {
    received_appeal: {
      on: {
        INVALID: "invalid_appeal",
        INFO_MISSING: "awaiting_validation_info",
        VALID: "valid_appeal",
      },
    },
    awaiting_validation_info: {
      entry: ["notifyAppellantOfMissingAppealInfo"],
      on: {
        INVALID: "invalid_appeal",
        VALID: "valid_appeal",
      },
    },
    valid_appeal: {
      always: [{ target: "awaiting_lpa_questionnaire_and_statements" }],
    },
    invalid_appeal: {
      entry: ["notifyAppellantOfInvalidAppeal", "notifyLPAOfInvalidAppeal"],
      type: "final",
    },
  };
  
  const lpaQuestionnaireStates = {
    initial: "awaiting_lpa_questionnaire",
    states: {
      awaiting_lpa_questionnaire: {
        entry: ["sendLPAQuestionnaire"],
        on: {
          OVERDUE: "overdue_lpa_questionnaire",
          RECEIVED: "received_lpa_questionnaire",
        },
      },
      received_lpa_questionnaire: {
        on: {
          COMPLETE: "complete_lpa_questionnaire",
          INCOMPLETE: "incomplete_lpa_questionnaire",
        },
      },
      overdue_lpa_questionnaire: {
        entry: ["nudgeLPAQuestionnaire"],
        on: {
          RECEIVED: "received_lpa_questionnaire",
        },
      },
      complete_lpa_questionnaire: {
        always: { target: 'available_for_inspector_pickup' }
      },
      incomplete_lpa_questionnaire: {
        on: {
          COMPLETE: "complete_lpa_questionnaire",
        },
      },
      available_for_inspector_pickup: {
        on: {
          PICKUP: 'picked_up'
        }
      },
      picked_up: {
        type: 'final'
      }
    },
  };
  
  const statementsAndFinalCommentsStates = {
    initial: "available_for_statements",
    states: {
      available_for_statements: {
        on: {
          RECEIVED_STATEMENTS: "available_for_final_comments",
          DID_NOT_RECEIVE_STATEMENTS: "closed_for_statements_and_final_comments",
        },
      },
      available_for_final_comments: {
        on: {
          RECEIVED_FINAL_COMMENTS: "closed_for_statements_and_final_comments",
        },
      },
      closed_for_statements_and_final_comments: {
        type: "final",
      },
    },
  };
  
  const lpaQuestionnaireAndStatementsStates = {
    awaiting_lpa_questionnaire_and_statements: {
      type: "parallel",
      states: {
        lpaQuestionnaire: lpaQuestionnaireStates,
        statementsAndFinalComments: statementsAndFinalCommentsStates,
      },
      onDone: "site_visit_not_yet_booked",
    },
  };
  
  const inspectorStates = {
    site_visit_not_yet_booked: {
      on: {
        BOOK: "site_visit_booked",
      },
    },
    site_visit_booked: {
      entry: ["notifyAppellantOfBookedSiteVisit"],
      on: {
        BOOKING_PASSED: "decision_due",
      },
    },
    decision_due: {
      on: {
        DECIDE: "appeal_decided",
      },
    },
    appeal_decided: {
      entry: ["notifyAppellantOfDecision"],
    },
  };
  
const createFullPlanningAppealMachine = function (context) {
    return createMachine({
        id: "full_planning_appeal",
        context: context,
        initial: "received_appeal",
        states: {
            ...validationStates,
            ...lpaQuestionnaireAndStatementsStates,
            ...inspectorStates,
        },
    })
}

const transitionState = function(context, status, machineAction) {
	const service = interpret(createFullPlanningAppealMachine(context));
	service.start(status);
	service.send({ type: machineAction });
	const nextState = service.state;
	service.stop();
	return nextState;
};

export default transitionState;

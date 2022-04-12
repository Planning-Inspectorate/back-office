import { createMachine, interpret } from "xstate";
import { generateValidationStates } from "./validation-states.js";
import { generateLpaQuestionnaireStates } from './lpa-questionnaire-states.js';

const validationStates = generateValidationStates('awaiting_lpa_questionnaire_and_statements');

const lpaQuestionnaireStates = generateLpaQuestionnaireStates();

const lpaQuestionnaireWithExtrasStates = {
    initial: "awaiting_lpa_questionnaire",
    states: {
        ...lpaQuestionnaireStates,
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
            lpaQuestionnaire: lpaQuestionnaireWithExtrasStates,
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

const transitionState = function (context, status, machineAction) {
    const service = interpret(createFullPlanningAppealMachine(context));
    service.start(status);
    service.send({ type: machineAction });
    const nextState = service.state;
    service.stop();
    return nextState;
};

export { transitionState };

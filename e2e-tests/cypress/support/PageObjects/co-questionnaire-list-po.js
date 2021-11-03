export const getReceivedStatus = () => cy.findAllByDisplayValue(/RECEIVED/);
export const getOverdueStatus = () => cy.findAllByDisplayValue(/OVERDUE/);
export const getAwaitingStatus = () => cy.findAllByDisplayValue(/AWAITING/);
export const getReceivedStatus = () => cy.findAllByDisplayValue(/RECEIVED/);
export const getOverdueStatus = () => cy.findAllByDisplayValue(/OVERDUE/);
export const getAwaitingStatus = () => cy.findAllByDisplayValue(/AWAITING/);
export const getAppealSiteAddress = (appealSite) => cy.findAllByText(appealSite);
export const getAppealReceivedDate = (appealDate)=> cy.findAllByText(appealDate);
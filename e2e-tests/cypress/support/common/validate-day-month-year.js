export const decisionDateObj = (day, month, year) => {
    if(day.length===0){
        cy.get('#decision-date-day').clear();
    }
    else{
        cy.get('#decision-date-day').type(`{selectall}{backspace}${day}`);
    }
    if(month.length===0){
        cy.get('#decision-date-month').clear();
    }
    else {
        cy.get('#decision-date-month').type(`{selectall}{backspace}${month}`);
    }
    if(year.length===0){
        cy.get('#decision-date-year').clear();
    }
    else {
        cy.get('#decision-date-year').type(`{selectall}{backspace}${year}`);
    }
};
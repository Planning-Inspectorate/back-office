export const nameEmailObj = (name, email) => {
    if(name.length===0){
        cy.get('#appellant-name').clear();
    }
    else{
        cy.get('#appellant-name').type(`{selectall}{backspace}${name}`);
    }
    if(email.length===0){
        cy.get('#appellant-email').clear();
    }
    else {
        cy.get('#appellant-email').type(`{selectall}{backspace}${email}`);
    }
    };




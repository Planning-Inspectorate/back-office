import { format } from 'date-fns';

// const getName = ({ contacts }, type) => {
//     let res = ''

//     contacts.forEach(contact => {
//         const contactType = contact.type.toLowerCase()

//         if( contactType === type) {
//            res = `${ contact.firstName} ${ contact.lastName }`
//         }
//     });
//     return res

// }

const getContactDetailsByContactType = ({ contacts }, type) => {
    let res = false

    // let sampleContacts = [
    //     {
    //         "type": "PERSON",
    //         "firstName": "Mrs",
    //         "lastName": "Sue",
    //         "organisationName": null,
    //         "jobTitle": null,
    //         "under18": false,
    //         "email": "test@example.com",
    //         "phoneNumber": "01234 567890",
    //         "address": {
    //             "addressLine1": "92 Huntsmoor Road",
    //             "addressLine2": null,
    //             "town": "Tadley",
    //             "county": null,
    //             "postcode": "RG26 4BX"
    //         }
    //     }
    // ]

    for ( const contact of contacts) {
        const contactType = contact.type?.toLowerCase()

        if ( contactType === type ) {
            res = {
                orgName: contact.organisationName || '',
                name: `${ contact.firstName} ${ contact.lastName }`,
                orgOrName: contact.organisationName ? contact.organisationName : `${ contact.firstName} ${ contact.lastName }`,
                jobTitle: contact.jobTitle || '',
                under18: contact.under18 ? 'Yes' : 'No',
                email: contact.email || '',
                phoneNumber: contact.phoneNumber || '',
                prefferedContact: '',
                addressLine1: contact.address.addressLine1 || '',
                addressLine2: contact.address.addressLine2 || '',
                town: contact.address.town || '',
                county: contact.address.county || '',
                postcode: contact.address.postcode || ''
           }
        }
    }

    // contacts.forEach(contact => {
    //     const contactType = contact.type?.toLowerCase()

    //     if ( contactType === type ) {
    //         res = {
    //             orgName: contact.organisationName || '',
    //             name: `${ contact.firstName} ${ contact.lastName }`,
    //             orgOrName: contact.organisationName ? contact.organisationName : `${ contact.firstName} ${ contact.lastName }`,
    //             jobTitle: contact.jobTitle || '',
    //             under18: contact.under18 ? 'Yes' : 'No',
    //             email: contact.email || '',
    //             phoneNumber: contact.phoneNumber || '',
    //             prefferedContact: '',
    //             addressLine1: contact.address.addressLine1 || '',
    //             addressLine2: contact.address.addressLine2 || '',
    //             town: contact.address.town || '',
    //             county: contact.address.county || '',
    //             postcode: contact.address.postcode || ''
    //        }
    //     }
    // });

    // TODO on behalf off, part of agent or contact? inconsistent design/field description

    return res
}

/**
 *
 * @param {object} arg
 * @param {string} arg.received
 * @param date
 * @returns {string}
 */
const formatDate = ( date ) => format(new Date(date), 'dd MMM yyyy');

// Shorten a string to less than maxLen characters without truncating words.
const createExcerpt = (string, maxLength) => {
    const lastSpaceIndex = string.lastIndexOf(' ', maxLength)

    return `${string.slice(0, Math.max(0, lastSpaceIndex) )}...`;
  }

const getRepresentationData = ( data ) => {
    const maxRepTextLength = 200

    // TODO: remove test rep text
    data.originalRepresentation = 'Ipsum ex deserunt et consequat esse reprehenderit excepteur ipsum eu. Ea sit Lorem irure duis pariatur sit ea est ut magna. Elit in ea sint reprehenderit anim aute ullamco laboris enim adipisicing elit tempor.'

    let representationExcerpt = false

    if ( data.originalRepresentation.length >= maxRepTextLength ) {
        representationExcerpt = createExcerpt( data.originalRepresentation, maxRepTextLength )
    }

    return {
        id: data.id,
        reference: data.reference,
        status: data.status,
        redacted: data.redacted,
        received: formatDate( data.received ),
        originalRepresentation: data.originalRepresentation,
        redactedRepresentation: data.redacted ? data.redactedRepresentation : '',
        representationExcerpt
    }
}

// placeholder function
const getWorkflowData = () => {
    return false
}

// placeholder function
const getAttachmensData = () => {
    return false
}


export const getRepresentationDetailsViewModel = function ( data ) {

    const viewData = {
        agentData: getContactDetailsByContactType( data, 'agent'),
        personData: getContactDetailsByContactType( data, 'person'),
        representationData: getRepresentationData( data ),
        workflowData: getWorkflowData( data ),
        attachmentsData: getAttachmensData( data )
    }

    return viewData
}


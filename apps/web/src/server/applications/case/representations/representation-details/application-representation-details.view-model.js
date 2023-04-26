import { format } from 'date-fns';

/**
 * @typedef {object} Address
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} county
 * @property {string} postcode
 */

/**
 * @param {object} arg
 * @param {Array.<{organisationName: string, firstName: string, lastName: string, jobTitle: string, type: string, under18: boolean, email: string,phoneNumber: string, address: Address }>} arg.contacts
 * @param {string} type
 * @returns {object}
 */
const getContactDetailsByContactType = ({ contacts }, type) => {
    let res = {}

    for ( const contact of contacts) {
        const contactType = contact.type.toLowerCase()

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

    return res
}

/**
 * @param {string} date
 * @returns {string}
 */
const formatDate = ( date ) => format(new Date(date), 'dd MMM yyyy');

/**
 * 
 * @param {string} text
 * @param {number} maxLength 
 * @returns {string}
 */
const createExcerpt = (text, maxLength) => {
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength)

    return `${text.slice(0, Math.max(0, lastSpaceIndex) )}...`;
  }

/**
 *
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.reference
 * @param {string} data.status
 * @param {string} data.redacted
 * @param {string} data.received
 * @param {string} data.originalRepresentation
 * @param {string} data.redactedRepresentation
 * @returns {object}
 */
const getRepresentationData = ( data ) => {
    const maxRepTextLength = 200

    let representationExcerpt = ''

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
/**
 * 
 * @param {*} data 
 * @returns {object}
 */
const getWorkflowData = ( data ) => {
    return data
}

// placeholder function
/**
 * 
 * @param {*} data 
 * @returns {object}
 */
const getAttachmensData = ( data ) => {
    return data
}

/**
 *
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.reference
 * @param {string} data.status
 * @param {Array.<{organisationName: string, firstName: string, lastName: string, jobTitle: string, type: string, under18: boolean, email: string,phoneNumber: string, address: { addressLine1: string, addressLine2: string, town: string, county: string, postcode: string}}>} data.contacts
 * @param {string} data.redacted
 * @param {string} data.received
 * @param {string} data.originalRepresentation
 * @param {string} data.redactedRepresentation
 * @returns {object}
 */
export const getRepresentationDetailsViewModel = ( data ) => {
    const viewData = {
        agentData: getContactDetailsByContactType( data, 'agent'),
        personData: getContactDetailsByContactType( data, 'person'),
        representationData: getRepresentationData( data ),
        workflowData: getWorkflowData( data ),
        attachmentsData: getAttachmensData( data )
    }

    return viewData
}


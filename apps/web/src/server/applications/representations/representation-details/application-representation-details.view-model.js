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

    contacts.forEach(contact => {
        const contactType = contact.type?.toLowerCase()

        if( contactType === type) {
            res = {
                orgName: contact.organisationName || '',
                name: `${ contact.firstName} ${ contact.lastName }`,
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
    });

    //TODO on behalf off, part of agent or contact? inconsistent design/field description

    return res
}

/**
 *
 * @param {object} arg
 * @param {string} arg.received
 * @returns {string}
 */
const formatDate = ( date ) => format(new Date(date), 'dd MMM yyyy');

const getRepresentationData = ( data ) => {

    //TODO: remove test rep text
    data.originalRepresentation = 'Ipsum ex deserunt et consequat esse reprehenderit excepteur ipsum eu. Ea sit Lorem irure duis pariatur sit ea est ut magna. Elit in ea sint reprehenderit anim aute ullamco laboris enim adipisicing elit tempor. Aliqua duis exercitation ex exercitation sit ullamco in nostrud dolor sit elit exercitation velit. Ea ad ad ut laboris sunt eiusmod. Commodo in eiusmod ipsum sit elit occaecat ad reprehenderit eiusmod elit sit. In aliquip eu aliquip est ad Officia qui sint dolor ut quis consequat Lorem velit fugiat do dolor velit veniam. Duis dolore eu sit qui nisi aliquip deserunt culpa ut sint veniam ullamco. Dolore esse dolor exercitation nisi consectetur dolor anim veniam ad. Deserunt cillum incididunt officia ullamco mollit voluptate id sunt nisi proident officia laborum sit. Do exercitation dolore culpa exercitation nisi voluptate esse fugiat. Elit aliquip quis cupidatat sint aliqua. Irure aute exercitation cillum est. Ut dolore veniam consequat excepteur tempor sit. Adipisicing officia quis ea labore nostrud ullamco nisi. Proident minim anim proident velit duis do elit reprehenderit commodo. Anim laborum laborum quis id qui fugiat nulla duis ipsum exercitation aute elit reprehenderit dolor. Adipisicing incididunt eu anim aliqua Lorem eiusmod irure Lorem ex do duis. Aliquip officia occaecat non ullamco cupidatat laborum deserunt laboris consectetur. Ex consequat pariatur nulla do ex proident laboris pariatur adipisicing deserunt adipisicing in occaecat fugiat. Ullamco elit dolore consequat consectetur.Voluptate sint id aliqua eu aliqua incididunt nulla do deserunt elit. Veniam cupidatat adipisicing est nostrud occaecat tempor. Elit ad aute culpa culpa.'

    let representationExcerpt = false
    if( data.originalRepresentation.length >= 200 ) {
        representationExcerpt = data.originalRepresentation.substring( 0, 200 )
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

//placeholder function
const getWorkflowData = () => {
    return false
}

//placeholder function
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


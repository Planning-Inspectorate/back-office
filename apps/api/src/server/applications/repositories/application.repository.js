import { databaseConnector } from "../../utils/database-connector.js"

/**
 * @param {string} status
 * @returns {import('@pins/api').Schema.Application[]}
 */
export const getByStatus = (status) => {
    return databaseConnector.application.findMany({
        where: {
            status
        },
        include: {
            subSector: {
                include: {
                    sector: true
                }
            }
        }
    })
}

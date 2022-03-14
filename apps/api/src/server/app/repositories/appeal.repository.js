import DatabaseFactory from './database.js';

const appealRepository = {
    getAll: async function() {
        const db = DatabaseFactory.getInstance();
        return await db.pool.appeal.findMany();
    }
}

export default appealRepository;
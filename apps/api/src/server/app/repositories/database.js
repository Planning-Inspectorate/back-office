import Prisma from '@prisma/client'
const { PrismaClient } = Prisma

var DatabaseFactory = (function(){
    function DatabaseClass() {
        this.pool = new PrismaClient();
    }
    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new DatabaseClass();
                instance.constructor = null;
            }
            return instance;
        }
   };
})();

export default DatabaseFactory;

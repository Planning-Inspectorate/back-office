import schedule from 'node-schedule';
import clearCache from '../tasks/clear-cache.js';

// Clear the cache at 5am each day
const clearCacheJob = schedule.scheduleJob('* 5 * * *', clearCache);

clearCacheJob.invoke();

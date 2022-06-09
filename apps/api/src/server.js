import { app } from './server/app.js';
import logger from './server/lib/logger.js';
import config from './server/config/config.js';

app.listen(config.PORT, () => {
	logger.info(`Server is live at http://localhost:${config.PORT}`);
});

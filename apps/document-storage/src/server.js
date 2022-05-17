import app from './server/app.js';
import pino from './server/app/lib/logger.js';
import config from './server/config/config.js';

app.listen(config.PORT, () => {
	pino.info(`Server is live at http://localhost:${config.PORT}`);
});

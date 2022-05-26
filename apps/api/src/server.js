import pino from 'pino';
import { app } from './server/app.js';
import config from './server/config/config.js';

app.listen(config.PORT, () => {
	pino.log(`Server is live at http://localhost:${config.PORT}`);
});

import app from './server/app.js';
import config from './server/config/config.js';

app.listen(config.PORT, () => {
	console.log(`Server is live at http://localhost:${config.PORT}`);
});

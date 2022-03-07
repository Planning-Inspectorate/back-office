'use strict';

const { app } = require('./server/app');
const config = require('./server/config/config');

app.listen(config.PORT, () => {
	console.log(`Server is live at localhost:${config.PORT}`);
});

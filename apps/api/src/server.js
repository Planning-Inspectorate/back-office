'use strict';

const express = require("express");
const config = require("./server/config/config");

const app = express();

app.get('/', (request, response) => {
	response.send("Hello world");
});

app.listen(config.PORT, () => {
	console.log(`Server is live at localhost:${config.PORT}`);
});

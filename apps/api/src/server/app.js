'use strict';

const express = require("express");
const { homeRoutes } = require("./app/home/home.routes");
const { validationRoutes } = require("./app/validation/validation.routes");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);
app.use('/validation', validationRoutes);

exports.app = app;

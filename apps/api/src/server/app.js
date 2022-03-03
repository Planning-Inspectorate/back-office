'use strict';

const express = require("express");
const { homeRoutes } = require("./app/home/home.routes");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);

exports.app = app;

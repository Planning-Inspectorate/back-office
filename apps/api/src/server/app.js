'use strict';

const express = require("express");
const homeRoutes = require("./app/home/home.routes");

const app = express();

app.use('/', homeRoutes);

exports.app = app;

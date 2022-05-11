import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { documentsRouter } from './app/routes.js';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', documentsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);
    res.status(err.status || 500);
    res.send({ 'error': err });
});

export default app;

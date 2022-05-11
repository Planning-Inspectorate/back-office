export const errorHandler = function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);
    console.log(err.message)
    res.status(err.status || 500);
    res.send({ 'error': 'Oops! Something went wrong' });
}

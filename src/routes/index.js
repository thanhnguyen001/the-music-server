const apiRouter = require('./apiRouter');
const userRouter = require('./userRouter');

const routes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api', apiRouter);
};

module.exports = routes;
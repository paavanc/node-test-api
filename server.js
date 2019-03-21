const fs = require('fs');

var models_path = __dirname + '/src/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})

const Mockgoose = require('mockgoose').Mockgoose;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const utiltest = require('./src/utils/test');
const country = require('./src/routes/country');
const user = require('./src/routes/user');
const login = require('./src/routes/login');
const info = require('./src/routes/info');
const morganBody = require('morgan-body');
const app = express();
require('dotenv').config({path: config});

const mockgoose = new Mockgoose(mongoose);
mockgoose.prepareStorage().then(() => {
    // if all is ok we will be here
    mongoose
        .connect(config.db.url,
            {useCreateIndex: true, useNewUrlParser: true}
        )
        .then(() => {
            // if all is ok we will be here
            config.logger.debug('IN MEMORY connected: ' + config.db.url);

            utiltest.loadTestData(function () {
                app.emit("test_data_loaded")

            });

        })
        .catch(err => {
            // if error we will be here
            config.logger.error('App starting error:', err.stack);
            process.exit(1);
        });
})
    .catch(err => {
        // if error we will be here
        config.logger.error('App starting error:', err.stack);
        process.exit(1);
    });


app.use(logger('dev'));
mongoose.set('debug', true);
app.use(cors());
app.use(bodyParser.json());

morganBody(app);

app.use(bodyParser.urlencoded({extended: false}));


app.use('/country', country);
app.use('/info', info);
app.use('/user', user);
app.use('/login', login);


// // catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({message: err.message, error: err});
});

app.listen(function () {
    config.logger.debug("app started")
    app.emit("app_started")
})

module.exports = app;

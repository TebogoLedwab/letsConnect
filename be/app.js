// set up express
const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors')

const bodyParser = require("body-parser");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const mailSender = require('./middlewares/mailsender');
//const scheduler = require ('./middlewares/scheduler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// log requests
app.use(morgan('dev'));


// ajust cors
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origine, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});


// Connect Database
 connectDB();


// Init Middleware
app.use(express.json({
    extended: false
}));



// routes
const profiles = require('./routes/profiles/profiles_route');
const users = require('./routes/users/users_route');
const auth = require('./routes/auth/auth_route');
const community = require('./routes/community/community_route');
const blogs = require ('./routes/blogs/blogs_route');
const application = require('./routes/applications/application_route');
const cohorts = require('./routes/cohorts/cohorts_route');
const admin = require('./routes/admin/admin_route')

app
    .use('/profiles', profiles)
    .use('/users', users)
    .use('/auth', auth)
    .use('/community',community)
    .use ('/blogs',blogs)
    .use ('/apply',application)
    .use ('/cohorts',cohorts)
    .use('/admin',admin)


var fileupload = require("express-fileupload");
app.use(fileupload());

app.use("/api/upload", function (request, response, next) {
    next();
});

app.get('/api/upload', (req, res) => {
    res.json({
        'message': 'hello'
    });
});

app.post('/api/upload', multipartMiddleware, (req, res) => {
    console.log(req.body, req.files);
    var file = req.files.file;
    console.log(file.name);
    console.log(file.type);
    res.json({
        'message': req.files
    });
});


/**
 * ⚠️ keep the following codes on the last ligne before exporting @express.app
 * collect errors from express
 */
app.use((req, res, next) => {
    mailSender.sendMail();
    const error = new Error('not found');
    error.status = 404;
    next(error);
}).use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            app: 'check our API documentation'
        }
    });
});


// export app
module.exports = app;
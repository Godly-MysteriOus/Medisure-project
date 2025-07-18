const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrfProtection = require('./middleware/CSRF/csrfProtection');
const connection = require('./DB_Utils/DB_Connection');
const logger = require('./utils/Logger/logger')('main.js');
const app = express();
//setting up UI Engine and pickup files
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('trust proxy', 1);
// Setting up CORS policies
app.use(cors({
    origin: config.hostURI, // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies if necessary
}));

app.use(express.json());
// app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

//setting up session db
const store = new MongoDBStore({
    uri: connection.dbURI.devDBConnectionURI,
    collection: 'sessions'
});

//creating session
app.use(    
    session({
        secret: config.sessionSecretKey,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie:{maxAge:3*60*60*1000},
    }),
);

//fetching user obj when user is authenticated to carry out all the CRUD operations
app.use((req,res,next)=>{
    if(req.session){
        if(req.session.roleId==1){

        }else if(req.session.roleId==2){

        }else if(req.session.roleId==3){

        }
    }
    next();
});

//setting up local variables
app.use((req,res,next)=>{
    res.locals.hostURI = config.hostURI;
    res.locals.redirectTo = 'login';
    res.locals.errorPageRedirection = '';
    if(req.session?.isLoggedIn){
        if(req.session?.roleId==1){
            res.locals.errorPageRedirection = 'customer/home';
        }else if(req.session?.roleId==2){
            res.locals.errorPageRedirection = 'seller/home';
        }else{
            res.locals.errorPageRedirection = 'admin/home';
        }
    }else{
        res.locals.errorPageRedirection = '';
    }
    next();
});
// app.use(csrfProtection);
app.get('/csrf-token',csrfProtection,(req,res,next)=>{
    const token = req.csrfToken();
    return res.status(200).json({
        csrfToken: token,
    });
});
const loginLogoutRoute = require('./routes/signupRoute');
// const sellerRoute = require('./routes/sellerRoute');
// const customerRoute = require('./routes/customerRoute');
const commonRoute = require('./routes/commonRoute');
const generalRoute = require('./routes/generalRoute');
// app.use('/customer',customerRoute);
// app.use('/seller',sellerRoute);
app.use('/signup',loginLogoutRoute);
app.use('/common',commonRoute);
app.use(generalRoute);

// general routes

app.use((req,res,next)=>{
    res.status(404).render('404Page');
});
connection.DBConnection(app,process.env.PORT|| 2100);
app.use((err,req,res,next)=>{
    logger.error(err.message);
    logger.error(err.stack);
    res.status(404).render('404Page');
});

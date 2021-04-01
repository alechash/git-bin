'Use Strict';

// npm packages
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import url from 'url';
import passportFile from './config/passport.js'
import session from 'express-session';
import passport from 'passport';
import MS from 'express-mongoose-store';

// routers
import router from './routes/index.js';

// statements
dotenv.config()
passportFile(passport)
const store = MS(session, mongoose)

// constants
const app = express();
const port = process.env.PORT
const __filename = url.fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// express middlewares
if (process.env.ENV == 'dev') {
    app.use(logger(process.env.ENV));
}
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new store({
        ttl: 63113904000
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', './views');
app.set('view engine', 'ejs');

// routes
app.use('/', router);

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// listen on port
app.listen(port, console.log(`Started on port: http://localhost:${port}`));
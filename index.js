'Use Strict';

// npm packages
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import url from 'url';

// routers
import router from './routes/index.js';

// statements
dotenv.config()

// constants
const app = express();
const port = process.env.PORT
const __filename = url.fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// express middlewares
app.use(logger(process.env.ENV));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'ejs');

// routes
app.use('/', router);

// listen on port
app.listen(port, console.log(`Started on port: http://localhost:${port}`));
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';
import { appLog, httpStream } from './config/winston';
import appConf from './config/application';
import { initApiController } from './controller';
import service from './service/common/passport';
import { FormError, isSystemError } from './config/error';

service(passport);
export const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('combined', {stream: httpStream}));
app.use(passport.initialize({ userProperty: 'user' })); // defaults to 'user' if omitted
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"))

app.get('/health-check', (req, res) => res.send({ message: 'Ok' }));
app.get('/', (req, res) => res.send({message: 'Welcome to the default API route'}));
/* API */
initApiController(app);

app.use((err, req, res, next) => {
  appLog.error(`message - ${err.message}, stack trace - ${err.stack}`);
  next(err);
});

app.use((err, req, res) => {
  if (err instanceof FormError) {
    err.errors.code = (err.errors && err.errors.code && err.errors.code.message)|| err.errors.code || 'INVALID'; // If the code is an object type then just get message (Ex: INVALID)
    res.status(err.code || 400)
      .json(err.errors);
  } else if (!isSystemError(err)) {
    res.statusMessage = err.message;
    res.status(err.code || 500)
      .json({error: err.message});
  }
});


// setup express application
const server = http.createServer(app);

const PORT = process.env.PORT || appConf.port;
server.listen(PORT, appConf.hostname, async () => {
  appLog.info(`Server running at http://${appConf.hostname}:${PORT}/`);
});

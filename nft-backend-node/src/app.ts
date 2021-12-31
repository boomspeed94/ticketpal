import { NotFound } from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import apiRouter from './routes';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(cors({
  credentials: true,
  origin: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', apiRouter);

// Response html files
app.use(express.static(path.resolve(__dirname, '../public/assets')));
app.get('/', (req, res) => {
  console.log(path.resolve(__dirname, '../public/index.html'));
  fs.readFile(path.resolve(__dirname, '../public/index.html'), 'utf8', (err, text) => {
    res.send(text);
  });
});
app.get('/test/:fileName', (request, response, next) => {
  // @ts-ignore
  const { fileName } = request.params;

  if (fileName && typeof fileName === 'string') {
    fs.readFile(path.resolve(__dirname, `../public/test/${fileName.toLowerCase()}.html`), 'utf8', (err, text) => {
      if (err) {
        next(new NotFound());
      } else {
        response.send(text);
      }
    });
  }
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  res.status(err.status || 500).send(JSON.stringify({ error: err.message || 'error' }));
});

export default app;

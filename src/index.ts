import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.query({}));

app.get('/', (req, res) => res.json({ timestamp: Date.now() }));

const PATH = '/github/login/oauth/access_token' as const;

app.post(PATH, (req, res, next) => {
  const { accept, origin } = req.headers;
  const { code } = req.query;

  axios
    .post<unknown>(`https://github.com${PATH}`, undefined, {
      headers: {
        ...(accept ? { accept } : {}),
      },
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      validateStatus: () => true,
    })
    .then(({ data, status, statusText }) => {
      res.header('Access-Control-Allow-Origin', origin ?? 'null');
      res.statusCode = status;
      res.statusMessage = statusText;
      res.send(data);
    })
    .catch(err => {
      next(err);
    });
});

const PORT = 3001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

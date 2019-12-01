import express from 'express';
import cookieParser from 'cookie-parser';
import { router } from './router';
import { createConnection } from 'typeorm';

const app : express.Application = express();
const PORT: number = 1337;
const HOST: string = '0.0.0.0';

app.use('/api', router);
app.use(express.static('./public'));

async function main() {
  try {
    const conn = await createConnection();
  } catch (ex) {
    console.error(ex.message);
    process.exit(-1);
  }
  app.listen(PORT, HOST, () => console.log(`Server listening at http://${HOST}:${PORT}/`));
}

main();

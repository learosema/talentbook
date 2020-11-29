import dotenv from 'dotenv';
import express from 'express';
import { router } from './router';
import { createConnection } from 'typeorm';

dotenv.config();

const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT || '1337', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

app.use('/api', router);
app.use(express.static('./public'));

async function main() {
  try {
    await createConnection();
  } catch (ex) {
    console.error(ex.message);
    process.exit(-1);
  }
  app.listen(PORT, HOST, () =>
    console.log(`Server listening at http://${HOST}:${PORT}/`)
  );
}

main();

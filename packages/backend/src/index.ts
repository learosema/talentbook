import dotenv from 'dotenv';
import express from 'express';
import { router } from './router';


dotenv.config();

const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT || '8001', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

app.use('/api', router);
app.use(express.static('./public'));

async function main() {
  app.listen(PORT, HOST, () =>
    console.log(`Server listening at http://${HOST}:${PORT}/`)
  );
}

main();

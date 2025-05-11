import { connectDb } from './db/index.js';
import { app } from './app.js';
import { env } from './configAndConstants.js';

connectDb()
  .then((_) => {
    app.listen(env.PORT, () => {
      console.log('Server Listens o o');
      console.log('              \\ _ /');
    });
    app.on('error', (error) => {
      console.log('Some Error Occured In APP : ERROR : ', error);
    });
  })
  .catch((err) => {
    console.log('ERROR : ', err);
    process.exit(-1);
  });

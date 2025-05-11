import mongoose from 'mongoose';
import { env } from '../configAndConstants';

console.log('Hey');

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${env.DATABASE_URL}/${env.DATABASE_NAME}`
    );
    const obj = connectionInstance.connection;
    console.log('Connected to MongoDB server : ', obj.host);
  } catch (error) {
    console.log("Couldn't Establish Connection to Database. Error : ", error);
    process.exit(-1);
  }
};

export { connectDb };

import dotenv from "dotenv";
dotenv.config();
import { mongoose, Schema } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
const uri = `mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@chatappmerndb.0otjpzl.mongodb.net/DB0?retryWrites=true&w=majority&appName=ChatAppMernDb`

async function dbApp() {
  try {
    await mongoose.connect(uri).then(() => {
        console.log("connected to mongodb");
      }).catch((err) => {
        console.log("errr", err);
      });
    mongoose.connection.on("error", (err) => {
      logError(err);
    });
  } catch (error) {
    console.log(error);
  }


}
export { dbApp };

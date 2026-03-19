import dotenv from "dotenv";
dotenv.config();
import { mongoose, Schema } from "mongoose";
const uri = `mongodb+srv://${process.env.MongoUsername}:${process.env.MongoPassword}@chatappmerndb.0otjpzl.mongodb.net/?appName=ChatAppMernDb`

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

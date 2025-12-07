import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { dbApp } from "./database/database.js";
import { createClient } from 'redis';

import runsocket from "./sockets/managesocket.js";
import runroutes from "./routes/manageroutes.js";
import createDefaultData from "./database/default/createdefault.js";
const app = express();
const httpServer = createServer(app);


const redisClient = createClient({
    username: 'default',
    password: `${process.env.redisCloudPassword}`,
    socket: {
        host: 'redis-16885.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16885
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();
if(redisClient.isReady){
  console.log("connected to redis")
  
}

function flushCache(){
  redisClient.flushAll();
  console.log("cache flushed")
}
// flushCache()

import multer from "multer";
import { routesv2 } from "./routes/routesv2.js";
const storage = multer.memoryStorage()
const upload = multer({ storage })


app.use(cookieParser(),
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);
app.use(express.json({}), express.urlencoded({extended: true,limit: '10mb'}));

const socket = new Server(httpServer, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  },
  method: ["GET", "PUT", "POST"],
  transports: [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling",
    "polling",
  ],
});

//manageroutesimages(app,upload)
runsocket(socket)
runroutes(app,socket,upload)
routesv2(app,socket,upload,redisClient)

async function runServer() {
  try {
    dbApp().then(async () => {
       httpServer.listen(process.env.SERVER_PORT, () => {
        console.log(`server running on http://localhost:${process.env.SERVER_PORT}`);
      }), createDefaultData()   
    })  
  } catch (error) {
    console.log(error,"error in server start")
  }
}
runServer();

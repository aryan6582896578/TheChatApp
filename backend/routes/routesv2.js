import auth from "./v2/auth.js"
import serverV2 from "./v2/server.js"
import user from "./v2/user.js"
export function routesv2(app,socket,upload,redisClient){

    app.use('/v2/@me',user(app,socket,upload,redisClient))
    app.use('/v2',auth(app,socket,upload,redisClient))
    app.use('/v2/s',serverV2(app,socket,upload,redisClient))
}
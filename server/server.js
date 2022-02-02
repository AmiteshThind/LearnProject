import express from 'express'
import cors from 'cors'
import formidable from 'express-formidable'
import jwt from "jsonwebtoken"
import { requireSignIn } from "./middleware/index"
import AWS from 'aws-sdk'
import { nanoid } from "nanoid"
import { readFileSync } from 'fs'
const morgan = require('morgan');
require('dotenv').config();
const Moralis = require("moralis/node"); // Node.js


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
}



const appId = "rX9zFb9Q12WkSV8xbVG0wVNmV8NqPhoG9gJ2I6k4";
const serverUrl = "https://bpblficeyq0o.usemoralis.com:2053/server";
const masterKey = "S5VqqDWRZ3kTYBJmiJpuYSKf5L60dI0PuO9irBLz";
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const S3 = new AWS.S3(awsConfig)


const app = express();



// apply middleware (code run everytime before any response is sent back to the client)
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));



//app.use(express.json());
app.use(morgan("dev"));
//app.use(formidable());
Moralis.start({ serverUrl, appId, masterKey });
const jsonParser = bodyParser.json()


//route
// app.get("/", async (req,res)=>{
//   const objectId = req.objectId; 
//   const query = new Moralis.Query("User");
//   query.equalTo("objectId","zgmPN0Uf2F3leCZb6VnXAqjC");
//   const results = await query.find({useMasterKey:true});
//   console.log(results)
//   res.send(results)

// })

app.post("/authenticate", jsonParser, async (req, res) => {

    const objectId = req.body.user.objectId;
    console.log(objectId)
    const token = jwt.sign({ objectId: objectId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    const query = new Moralis.Query("User")
    query.equalTo("objectId", objectId);
    const results = await query.find({ useMasterKey: true });
    console.log(results[0])
    if (results[0] != undefined) {
        res.cookie("token", token, {
            httpOnly: true,

        })
    }

    res.send('wow') //dont send cookie with auth token so user will not be able to access any endpoints 
})

app.post("/api/course/video-upload/:instructorId", formidable(), cookieParser(), async (req, res) => {

    try {
        
        
        const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET) // if not verified then catch block executed 
        // console.log(user.objectId)
        // console.log(req.params.instructorId)
        const instructorId = req.params.instructorId;
        const { video } = req.files;
        if (!video) return res.status(400).send('No Video');
        // console.log(video)

        //video params
        const params = {
            Bucket: "learn-platform-bucket",
            Key: `${nanoid()}.${video.type.split("/")[1]}`, //video/mp4
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type
        }

        //upload to S3
        if (user.objectId == instructorId) {
            S3.upload(params, (err, data) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                console.log(data);
                res.send(data)
            })
        } else {
            return res.status(400).send("Must Be Instructor To Upload Course Lessons")
        }

    }

    catch (err) {
        return res.redirect("")
    }


})


app.post("/api/course/video-remove/:instructorId", jsonParser, cookieParser(), async (req, res) => {

    try {

        const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET) // if not verified then catch block executed 
        console.log(req.body)
        const { Bucket, key } = req.body;
        console.log('here')
        if (!key) return res.status(400).send('No Video');
        // console.log(video)

        //video params
        const params = {
            Bucket: Bucket,
            Key: key, //video/mp4

        }

        const instructorId = req.params.instructorId;

        //upload to S3
        if (user.objectId == instructorId) {
            S3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                console.log(data);
                res.send({ ok: true })
                console.log('here')
            })
        } else{ res.status(400).send("Must Be Instructor To Delete Courses")}

    }

    catch (err) {
        console.log(err)

    }


})









//port

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`))
import express from "express"

const router = express.Router();


//controllers
import {uploadVideo} from "../controllers/course"

router.post("/course/upload-video",uploadVideo)
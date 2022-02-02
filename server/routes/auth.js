import express from "express"

const router = express.Router();

import {requireSignIn} from "../middleware/index"

router.get('/authenticateUser', requireSignIn, currentUser )
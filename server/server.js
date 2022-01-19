import express from 'express'
import cors from 'cors'
const morgan = require('morgan');
require('dotenv').config();

const app = express();


// apply middleware (code run everytime before any response is sent back to the client)
app.use(cors());
app.use(express.json({limit:"5mb"}));
app.use(morgan("dev"));

//route
app.get("/",(req,res)=>{
    res.send("you hit endpoint")
})

//port

const port = process.env.PORT || 8000; 

app.listen(port,()=>console.log(`Server is running on port ${port}`))
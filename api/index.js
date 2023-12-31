const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users")
const authenticationRoute=require("./routes/authentication")
const postRoute=require("./routes/posts");
const conversationRoute=require("./routes/conversations");
const messageRoute=require("./routes/messages");
const multer=require('multer');
const path=require("path")

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

app.use("/images",express.static(path.join(__dirname,"public/images")))

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name);
    }
})
const upload=multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("File uploaded successfully")
    }catch(err){
        console.log(err);
    }
})

app.use("/api/users",userRoute);
app.use("/api/authentication",authenticationRoute);
app.use("/api/posts",postRoute);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);


app.listen(3000,()=>{
    console.log("Server is running on port 3000...");
})
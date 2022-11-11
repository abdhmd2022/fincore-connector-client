const express = require("express");
const app = new express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 5500;
app.use(bodyParser.urlencoded({extended:false,limit:"50mb"}));
app.use(bodyParser.json());
app.use(cors());

app.use("/",require("./routes/main"));

app.listen(port,()=>{
    console.log("Server connected @",port);
});


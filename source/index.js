const express = require("express");
const app = new express();
const bodyParser = require("body-parser");
const cors = require("cors");
const open = require("open");

const port = 5000;
app.use(bodyParser.urlencoded({extended:false,limit:"50mb"}));
app.use(bodyParser.json());
app.use(cors());

app.use("/",require("./routes/main"));

open(`http://localhost:${port}/`,{background:true});
app.listen(port,()=>{
  console.log("Server connected @",port);
});

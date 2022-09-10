const express = require("express");
const router = express.Router();
const fetch = require("../modules/fetch");
const {Config} = require("../modules/classes");

router.get("/",fetch.post,(req,res)=>{
    if(!req.error){
        console.log("All data Inserted Successfully");
        res.status(200).redirect("/interval");
    }else{
        console.log(req.error);
        res.status(400).redirect("/retry/1");
    }
});

router.get("/home/:retry",fetch.post,(req,res)=>{
    const retry = req.params.retry;
    if(!req.error){
        console.log("All data Inserted Successfully");
        res.status(200).redirect("/interval");
    }else{
        console.log(req.error);
        res.status(400).redirect(`/retry/${retry}`);
    }
});

router.get("/retry/:retry",(req,res)=>{
    setTimeout(retry,10000);
    async function retry()
    {
        let retry = req.params.retry;
        let config = await new Config().configJSON();
        if(retry < config.retry){
            retry++;
            res.status(200).redirect(`/home/${retry}`);
        }
        else{
            res.status(200).redirect(`/interval`);
        }
    }
});

router.get("/interval",(req,res)=>{
    async function intervl (){
        let config = await new Config().configJSON();
        const interval = config.interval * 60 * 1000;
        res.send(`<!DOCTYPE html><html><head><title>Interval</title>
            <body onload="interval(${interval})" style="background-color:aqua;margin:auto;">
            <div style="padding:3%;text-align:center;font-size:5vw;">Waiting</div>
            <script>
                function interval(value){
                    setInterval(home,value);
                }
                function home(){
                    window.open("/","_self");
                }
            </script>
        </body></head></html>`);
    }
    console.log("From Interval")
    intervl();
});

router.get("/company",fetch.company,(req,res)=>{
    if(!req.error){
        res.send({serial:req.serialNo,current:req.currentCompany,company:req.company});
    }else{
        res.send({error:req.error})
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const fetch = require("../modules/fetch");
const {Config} = require("../modules/classes");
const request = require("request");

router.get("/",fetch.post,(req,res)=>{
    if(!req.error){
        console.log(new Date(),"All data Inserted Successfully");
        res.send({success:true});
    }else{
        console.log(new Date(),req.error);
        res.status(400).redirect("/retry/1");
    }
});

router.get("/home/:retry",fetch.post,(req,res)=>{
    const retry = req.params.retry;
    if(!req.error){
        console.log(new Date(),"All data Inserted Successfully");
        res.send({success:true});
    }else{
        console.log(new Date(),req.error);
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

start();
async function start(){
    try{
        let config = await new Config().configJSON();
        const interval = config.interval * 60 * 1000;
        function run(){
            return new Promise((success,error)=>{
                request.get({
                    url:"http://localhost:5000"
                },async function(err,response,body){
                    if(response){
                        console.log(new Date(),body);
                        success(body);
                    }else{
                        console.log(new Date(),err);
                        error(err);
                    }
                });
            });
        }
        await run().catch(err=>setTimeout(start,interval));
        setTimeout(start,interval);
    }catch(err){
        console.log(new Date(),err);
    }
}

router.get("/company",fetch.company,(req,res)=>{
    if(!req.error){
        res.send({serial:req.serialNo,current:req.currentCompany,company:req.company});
    }else{
        res.send({error:req.error})
    }
});

module.exports = router;

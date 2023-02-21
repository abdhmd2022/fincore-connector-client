const request   = require('request');
const xml2js    = require("xml2js");
const xml =  require("./xml");
const {Tally,JSONtrim,Config} = require("./classes");

exports.post = async (req,res,next)=>{
    try{
        var {serialXml,currCompanyXml,companyXml,stocksXml} = xml.xmlquery();
        let config = await (new Config().configJSON());
        
        const tallyHost = config.TALLY_HOST;
        const tallyPort = config.TALLY_PORT;
        var error = "";

        var serialNo = await new Tally(tallyHost,tallyPort,serialXml).tallyFunction().
            catch(err=>error = err);

        var currCompanyName = await new Tally(tallyHost,tallyPort,currCompanyXml).
            tallyFunction().catch(err=>error = err);

        var companyObj = await tally2Json(companyXml,"COMPANY");
        
        if(!error){
            if(serialNo == config.serial){
                let companyList = config.company;
                var company = companyList.filter(verifyCompany).toString();
                if(company){
                    let cindex = companyList.findIndex(verifyCompany);
                    let start = config.STARTFROM[cindex];
                    var startFrom = start ? start :  companyObj[companyObj.findIndex(selectStart)].startFrom;
                    
                    var {ledgerXml,ledgerBillsXml,voucherXml,inventoryXml,ledgerEntryXml,
                        billsXml,costCentreXml} = xml.xmlQueryWithDate(startFrom);
                    var stocksObj = await tally2Json(stocksXml,"STOCKITEM");
                    var ledgerBillsObj = await tally2Json(ledgerBillsXml,"BILL");
                    var ledgerObj = await tally2Json(ledgerXml,"LEDGER");
                    var voucherObj = await tally2Json(voucherXml,"VOUCHER");
                    var inventoryObj = await tally2Json(inventoryXml,"BATCHALLOCATIONS");
                    var ledgerEntryObj = await tally2Json(ledgerEntryXml,"LEDGERENTRY");
                    var billsObj = await tally2Json(billsXml,"BILLALLOCATIONS");
                    var costCentreObj = await tally2Json(costCentreXml,"COSTCENTERALLOCATIONS");
                    return next();
                }else{
                    error = "Company not registered";
                    req.error = error;
                    return next();
                }
            }else{
                error = "Serial No. not registered";
                req.error = error;
                return next();
            }
        }else
        {
            req.error = error;
            return next();
        }
        function verifyCompany (value){
            return value == currCompanyName;
        }
        function selectStart (value){
            return value.name == company;
        }
        async function tally2Json (xml,master){
            let JSON = await new Tally(tallyHost,tallyPort,xml).tallyCollection().catch(err=>error = err);
            if(!error){
                let obj = {};
                if(master != "COMPANY"){
                    obj[master] = await new JSONtrim(master,JSON).js2Obj().catch(err=>error = err);
                    return toCloud(company,serialNo,startFrom,obj).catch(err=>error = err);
                }else{
                    return await new JSONtrim(master,JSON).js2Obj().catch(err=>error = err);
                }
            }else{
                req.error = error;
                return error;
            }
        }
        function toCloud(company,serialNo,startFrom,obj){
            return new Promise((success,error)=>{
                try{
                    let url = `${config.CLOUD}/${company.replace(/[^a-zA-Z0-9_]/g,"").toLowerCase()}/${serialNo}/${startFrom}`;
                    request.post({
                        headers:{"content-type":"application/json","content":"UTF-8"},
                        url:url,
                        json:true,
                        body:obj
                    },function(err,response,body){
                        if(response){
                            console.log(body);
                            success(body);
                        }else{
                            req.error = "Unable to connect Cloud"
                            error("Unable to connect Cloud");

                        }
                    });
                }catch(err){
                    req.error = `Unknown error`;
                    error(`Unknown error`);
                }
            });
        }
    }catch(err)
    {
        req.error = `Unknown error`;
        console.log(err);
        return next();
    }
}
exports.company = async (req,res,next)=>{
    try{
        var {serialXml,currCompanyXml,companyXml} = xml.xmlquery();
        let config = await (new Config().configJSON());
        const tallyHost = config.TALLY_HOST;
        const tallyPort = config.TALLY_PORT;
        var error = "";

        req.serialNo = await new Tally(tallyHost,tallyPort,serialXml).tallyFunction().
            catch(err=>req.error = err);

        req.currentCompany = await new Tally(tallyHost,tallyPort,currCompanyXml).
            tallyFunction().catch(err=>req.error = err);

        let JSON = await new Tally(tallyHost,tallyPort,companyXml).tallyCollection().catch(err=>error = err);
        if(!error){
            if(JSON.COLLECTION.COMPANY){
                req.company =  await new JSONtrim("COMPANY",JSON).js2Obj().catch(err=>req.error = err);
            }else{
                req.error = "Company not selected";
            }
        }else{
            req.error = error;
        }
        return next();
    }catch(err){
        console.log(err);
        req.error = "Unknown Error";
        return next();
    }
}
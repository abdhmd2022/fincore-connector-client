const request   = require('request');
const xml2js    = require("xml2js");
const fs = require("fs");

class Tally {
    constructor(tallyHost,tallyPort,xml){
        this.tallyHost = tallyHost;
        this.tallyPort = tallyPort;
        this.xml = xml;
    }
    tallyFunction = function () {
        return new Promise((success,error)=>{
            request.post({
                headers : {"content-type":"applicaiton/xml","content":"UTF-8"},
                url : `http://${this.tallyHost}:${this.tallyPort}`,
                body:this.xml
            },
            function(err,response,body){
                if(response){
                    const start = body.indexOf("<DATA");
                    const end = body.indexOf("</DATA") + 7;
                    body = body.slice(start,end);
                    xml2js.parseString(body,(err,result)=>{
                        if(result){
                            success(result.DATA.RESULT[0]._);
                        }else{
                            console.log(err)
                            error("Unable to Convert function Xml -> JSON");
                        }
                    });
                }else{
                    error("Tally Server not running");
                }
            })
        });
    }

    tallyCollection = function(){
        return new Promise((success,error)=>{
            request.post({
                headers : {"content-type" : "application/xml","content" : "UTF-8"},
                url : `http://${this.tallyHost}:${this.tallyPort}`,
                body : this.xml
            },function(err,response,body){
                if(response){
                    const start = body.indexOf("<COLLECTION");
                    const end   = body.indexOf("</COLLECTION>") + 13;
                    body        = body.slice(start,end);

                    xml2js.parseString(body,(err,result)=>{
                        if(result){
                            success(result);
                        }else{
                            console.log(err)
                            error("Unable to Convert collection Xml -> JSON");
                        }
                    });
                }else{
                    error("Tally Server not running");
                }
            });
        });
    }
}

class JSONtrim{
    constructor(type,value){
        this.type = type;
        this.value = value;
        this.collection = value["COLLECTION"][type];
        this.length = !this.collection ? 0 : this.collection.length;
    }
    js2Obj = function(){
        return new Promise((success,error)=>{
            try{
                var obj = [];
                
                function right(value){
                    if(value){
                        return value.replace("\x04 ","").replace("\"","'").trim()
                    }
                }
                
                for(var i = (this.length-1);i>=0;i--){
                    obj[i] = {};
                    
                    if(this.collection[i].MASTERID){
                        obj[i].masterid = parseInt(this.collection[i].MASTERID[0]._);
                    }

                    if(this.collection[i].ALTERID){
                        obj[i].alterid = parseInt(this.collection[i].ALTERID[0]._);
                    }

                    if(this.collection[i].STOCKITEMNAME){
                        obj[i].name = right(this.collection[i].STOCKITEMNAME[0]._);
                    }

                    if(this.collection[i].NAME){
                        if(this.collection[i].NAME[0]._){
                            obj[i].name = right(this.collection[i].NAME[0]._);
                        }
                    }

                    if(this.collection[i].$){
                        if(this.type == "VOUCHER"){
                            obj[i].name = right(this.collection[i].$.VCHTYPE);
                        }else
                        {
                            obj[i].name = right(this.collection[i].$.NAME);
                        }
                    }

                    if(this.collection[i].GODOWNNAME){
                        obj[i].godown = right(this.collection[i].GODOWNNAME[0]._);
                    }
                    
                    if(this.collection[i].BATCHNAME){
                        obj[i].batch = right(this.collection[i].BATCHNAME[0]._);
                    }
                    
                    if(this.collection[i].ORDERNO){
                        obj[i].order = right(this.collection[i].ORDERNO[0]._);
                    }
                    
                    if(this.collection[i].TRACKINGNUMBER){
                        obj[i].tracking = right(this.collection[i].TRACKINGNUMBER[0]._);
                    }
                    
                    if(this.collection[i].STARTINGFROM){
                        obj[i].startFrom = right(this.collection[i].STARTINGFROM[0]._);
                    }

                    if(this.collection[i]["LANGUAGENAME.LIST"]){
                        var a= this.collection[i]["LANGUAGENAME.LIST"][0]
                        ["NAME.LIST"][0]["NAME"];
                        if(a[1]){
                            a.splice(0,1);
                            obj[i].alias = a.toString();
                        }
                    }

                    if(this.collection[i]["MAILINGNAME.LIST"]){
                        obj[i].mailName = right(this.collection[i]["MAILINGNAME.LIST"][0]
                        ["MAILINGNAME"].toString());
                    }

                    if(this.collection[i].DESCRIPTION){
                        obj[i].description = right(this.collection[i].DESCRIPTION[0]._);
                    }

                    if(this.collection[i].PARENT){
                        obj[i].parent = right(this.collection[i].PARENT[0]._);
                    }

                    if(this.collection[i].RESERVENAME){
                        obj[i].ledGroup = right(this.collection[i].RESERVENAME[0]._);
                    }

                    if(this.collection[i].CATEGORY){
                        obj[i].category = right(this.collection[i].CATEGORY[0]._);
                    }

                    if(this.collection[i].TYPEOFVOUCHER){
                        obj[i].vchType = right(this.collection[i].TYPEOFVOUCHER[0]._);
                    }
                    
                    if(this.collection[i].BILLTYPE){
                        obj[i].billType = right(this.collection[i].BILLTYPE[0]._);
                    }
                    
                    if(this.collection[i].VOUCHERNUMBER){
                        obj[i].vchNo = right(this.collection[i].VOUCHERNUMBER[0]);
                    }

                    if(this.collection[i].REFERENCE){
                        if(this.collection[i].REFERENCE[0]._){
                            obj[i].vchRef = right(this.collection[i].REFERENCE[0]._);
                        }
                    }

                    if(this.collection[i].DATE){
                        obj[i].vchDate = parseInt(this.collection[i].DATE[0]._);
                    }

                    if(this.collection[i].REFERENCEDATE){
                        if(this.collection[i].REFERENCEDATE[0]._){
                            obj[i].vchRefDate = parseInt(this.collection[i].REFERENCEDATE[0]._);
                        }
                    }

                    if(this.collection[i].PARTYLEDGERNAME){
                        if(this.collection[i].PARTYLEDGERNAME[0]._){
                            obj[i].vchParty = right(this.collection[i].PARTYLEDGERNAME[0]._);
                        }
                    }
                    
                    if(this.collection[i].LEDGERNAME){
                        if(this.collection[i].LEDGERNAME[0]._){
                            if(this.type != "LEDGERENTRY"){
                                obj[i].ledger = right(this.collection[i].LEDGERNAME[0]._);
                            }
                        }
                    }
                    
                    if(this.collection[i].BASEUNITS){
                        obj[i].unit = right(this.collection[i].BASEUNITS[0]._);
                    }

                    if(this.collection[i].BILLEDQTY){
                        if(this.collection[i].BILLEDQTY[0]._){
                            obj[i].qty = parseInt(this.collection[i].BILLEDQTY[0]._);
                        }
                    }

                    if(this.collection[i].RATE){
                        if(this.collection[i].RATE[0]._){
                            let rate = right(this.collection[i].RATE[0]._);
                            if(rate.indexOf("=") != -1){
                                rate = rate.split("=");
                                rate = rate[1].replace(/[\s,a-z,A-Z]/g,"");
                            }
                            obj[i].rate = parseFloat(rate);
                        }
                    }

                    if(this.collection[i].AMOUNT){
                        if(this.collection[i].AMOUNT[0]._){
                            let amount = right(this.collection[i].AMOUNT[0]._);
                            if(amount.indexOf("=") != -1){
                                amount = amount.split("=");
                                amount = amount[1].replace(/[\s,a-z,A-Z]/g,"");
                            }
                            obj[i].amount = parseFloat(amount);
                        }
                    }

                    if(this.collection[i].DISCOUNT){
                        if(this.collection[i].DISCOUNT[0]._){
                            obj[i].discPerc = parseInt(this.collection[i].DISCOUNT[0]._);
                        }
                    }

                    if(this.collection[i].ISDEEMEDPOSITIVE){
                        if(this.collection[i].ISDEEMEDPOSITIVE[0]._)
                        {
                            obj[i].isDeemed = right(this.collection[i].ISDEEMEDPOSITIVE[0]._);
                        }
                    }

                    if(this.collection[i].ISOPTIONAL){
                        if(this.collection[i].ISOPTIONAL[0]._)
                        {
                            obj[i].isOptional = right(this.collection[i].ISOPTIONAL[0]._);
                        }
                    }

                    if(this.collection[i].ISPOSTDATED){
                        if(this.collection[i].ISPOSTDATED[0]._)
                        {
                            obj[i].isPostDate = right(this.collection[i].ISPOSTDATED[0]._);
                        }
                    }

                    if(this.collection[i].CLOSINGBALANCE){
                        if(this.collection[i].CLOSINGBALANCE[0]._){
                            if(this.type == "STOCKITEM"){
                                obj[i].closingQty = parseFloat(this.collection[i].CLOSINGBALANCE[0]._);
                            }else{
                                obj[i].closingBalance = parseFloat(this.collection[i].CLOSINGBALANCE[0]._);
                            }
                        }  
                    }

                    if(this.collection[i].CLOSINGRATE){
                        if(this.collection[i].CLOSINGRATE[0]._){
                            obj[i].closingRate = parseFloat(this.collection[i].CLOSINGRATE[0]._);
                        }  
                    }

                    if(this.collection[i].CLOSINGVALUE){
                        if(this.collection[i].CLOSINGVALUE[0]._){
                            obj[i].closingAmount = parseFloat(this.collection[i].CLOSINGVALUE[0]._);
                        }
                    }

                    if(this.collection[i].LASTSALEDATE){
                        if(this.collection[i].LASTSALEDATE[0]._){
                            obj[i].saleDate = parseFloat(this.collection[i].LASTSALEDATE[0]._);
                        }
                    }

                    if(this.collection[i].LASTPURCDATE){
                        if(this.collection[i].LASTPURCDATE[0]._){
                            obj[i].purcDate = parseInt(this.collection[i].LASTPURCDATE[0]._);
                        }
                    }

                    if(this.collection[i].LASTSALEPRICE){
                        if(this.collection[i].LASTSALEPRICE[0]._){
                            obj[i].saleRate = parseFloat(this.collection[i].LASTSALEPRICE[0]._);
                        }
                    }

                    if(this.collection[i].LASTPURCPRICE){
                        if(this.collection[i].LASTPURCPRICE[0]._){
                            obj[i].purcRate = parseInt(this.collection[i].LASTPURCPRICE[0]._);
                        }
                    }

                    if(this.collection[i].BILLDATE){
                        if(this.collection[i].BILLDATE[0]._){
                            obj[i].billDate = parseInt(this.collection[i].BILLDATE[0]._);
                        }
                    }

                    if(this.collection[i].BILLCREDITPERIOD){
                        if(this.collection[i].BILLCREDITPERIOD[0]._){
                            obj[i].dueDate = right(this.collection[i].BILLCREDITPERIOD[0]._);
                        }
                    }

                    if(this.collection[i].CREDITLIMIT){
                        if(this.collection[i].CREDITLIMIT[0]._){
                            obj[i].creditLimit = parseFloat(this.collection[i].CREDITLIMIT[0]._);
                        }
                    }

                    if(this.collection[i]["ADDRESS.LIST"]){
                        obj[i].address = right(this.collection[i]["ADDRESS.LIST"][0].ADDRESS.toString());
                    }

                    if(this.collection[i].LEDSTATENAME){
                        obj[i].state = right(this.collection[i].LEDSTATENAME[0]._);
                    }

                    if(this.collection[i].COUNTRYNAME){
                        obj[i].country = right(this.collection[i].COUNTRYNAME[0]._);
                    }

                    if(this.collection[i].LEDGERMOBILE){
                        obj[i].mobile = right(this.collection[i].LEDGERMOBILE[0]._);
                    }

                    if(this.collection[i].LEDGERCONTACT){
                        obj[i].contact = right(this.collection[i].LEDGERCONTACT[0]._);
                    }

                    if(this.collection[i].LEDGERPHONE){
                        obj[i].phone = right(this.collection[i].LEDGERPHONE[0]._);
                    }

                    if(this.collection[i].EMAIL){
                        obj[i].email = right(this.collection[i].EMAIL[0]._);
                    }

                    if(this.collection[i].WEBSITE){
                        obj[i].web = right(this.collection[i].WEBSITE[0]._);
                    }

                    if(this.collection[i].VATTINNUMBER){
                        obj[i].tin = right(this.collection[i].VATTINNUMBER[0]._);
                    }

                    if(this.collection[i].PINCODE){
                        obj[i].pin = right(this.collection[i].PINCODE[0]._);
                    }

                    if(this.collection[i].OPENINGBALANCE){
                        if(this.collection[i].OPENINGBALANCE[0]._){
                            let opening = right(this.collection[i].OPENINGBALANCE[0]._);
                            if(opening.indexOf("=") != -1){
                                opening = opening.split("=");
                                opening = opening[1].replace(/[\s,a-z,A-Z]/g,"");
                            }
                            obj[i].opening = parseFloat(opening);
                        }
                    }
                }
                success(obj);
            }catch(err){
                console.log(err);
                error("Unable to JSON parse");
            } 
        });
    }
}

class Config{
    configJSON = async function (){
      try{
        return await file().catch(err=>console.log(err));
        function file(){
          return new Promise((success,error)=>{
            fs.readFile("config.json","utf8",(err,data)=>{
              if(data){
                success(JSON.parse(data));
              }else{
                error(err);
              }
            });
          });
        }
      }catch(err){
        console.log(err);
      }
    }
}

module.exports = {
    Tally,
    JSONtrim,
    Config
};
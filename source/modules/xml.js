exports.xmlquery = ()=>{
    const serialXml = "<ENVELOPE>" + 
        "<HEADER>" + 
            "<VERSION>1</VERSION>" + 
            "<TALLYREQUEST>Export</TALLYREQUEST>" + 
            "<TYPE>Function</TYPE>" + 
            "<ID>$$LicenseInfo</ID>" + 
        "</HEADER>" + 
        "<BODY>" + 
            "<DESC>" + 
                "<FUNCPARAMLIST>" + 
                    "<PARAM>Serial Number</PARAM>" + 
                "</FUNCPARAMLIST>  " + 
            "</DESC>" + 
        "</BODY>" + 
    "</ENVELOPE>";

    const currCompanyXml = "<ENVELOPE>" +
        "<HEADER>" +
            "<VERSION>1</VERSION>" +
            "<TALLYREQUEST>Export</TALLYREQUEST>" +
            "<TYPE>Function</TYPE>" +
            "<ID>$$currentCompany</ID>" +
        "</HEADER>" +
        "<BODY>" +
            "<DESC>  " +
            "</DESC>" +
        "</BODY>" +
    "</ENVELOPE>";
    
    const companyXml = "<ENVELOPE>" + 
    "<HEADER>" + 
        "<VERSION>1</VERSION>" + 
        "<TALLYREQUEST>Export</TALLYREQUEST>" + 
        "<TYPE>COLLECTION</TYPE>" + 
        "<ID>expCompany</ID>" + 
    "</HEADER>" + 
    "<BODY>" + 
        "<DESC>" + 
            "<TDL>" + 
                "<TDLMESSAGE>" + 
                    '<COLLECTION Name="expCompany" ISMODIFY="No">' + 
                        "<SOURCECOLLECTION>company</SOURCECOLLECTION>"+
                        "<FETCH>startingfrom,name</FETCH>" + 
                    "</COLLECTION>" + 
                "</TDLMESSAGE>" + 
            "</TDL>" + 
        "</DESC>" + 
    "</BODY>" + 
    "</ENVELOPE>";

    const stocksXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportStockitems</ID>"+
            "</HEADER>"+
            "<BODY>"+
                "<DESC>"+
                    "<TDL>"+
                        "<TDLMESSAGE>"+
                            '<COLLECTION Name="exportStockitems" ISMODIFY="No">'+
                                "<SOURCECOLLECTION>stockitem</SOURCECOLLECTION>"+
                                "<FETCH>masterid,alterid,name,mailingname,parent,category,"+
                                "description,baseunits,closingbalance,closingvalue,closingrate,"+
                                "lastsaledate,lastpurcdate,lastsaleprice,lastpurcprice</FETCH>"+
                            "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    const ledgerBillsXml = "<ENVELOPE>"+
        "<HEADER>" +
            "<VERSION>1</VERSION>" +
            "<TALLYREQUEST>Export</TALLYREQUEST>" +
            "<TYPE>Collection</TYPE>" +
            "<ID>exportledgerBills</ID>" +
        "</HEADER>" +
        "<BODY>" +
            "<DESC>" +
                "<TDL>" +
                    "<TDLMESSAGE>" +
                    '<COLLECTION Name="exportledgerBills" ISMODIFY="No">' +
                        '<SOURCECOLLECTION>ledger</SOURCECOLLECTION>' +
                        '<WALK>BILLALLOCATIONS</WALK>' +
                        '<FETCH>masterid,name,billdate,openingbalance,billcreditperiod</FETCH>' +
                    '</COLLECTION>' +
                    "</TDLMESSAGE>" +
                "</TDL>" +
            "</DESC>" +
        "</BODY>" +
    "</ENVELOPE>";

    return {
        serialXml : serialXml,
        currCompanyXml : currCompanyXml,
        companyXml : companyXml,
        stocksXml : stocksXml,
        ledgerBillsXml : ledgerBillsXml
    }
}
exports.xmlQueryWithDate = (date)=>{
    const ledgerXml = "<ENVELOPE>"+
        "<HEADER>" +
            "<VERSION>1</VERSION>" +
            "<TALLYREQUEST>Export</TALLYREQUEST>" +
            "<TYPE>Collection</TYPE>" +
            "<ID>exportCustomer</ID>" +
        "</HEADER>" +
        "<BODY>" +
            "<DESC>" +
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>" +
                    "<TDLMESSAGE>" +
                        '<COLLECTION Name="exportCustomer" ISMODIFY="No">' +
                            "<SOURCECOLLECTION>Ledger</SOURCECOLLECTION>" +
                            "<FETCH>masterid,alterid,name,mailingname,parent,billcreditperiod,creditlimit,address," +
                            "countryname,pincode,ledgermobile,ledgercontact,ledgerphone,email,website,vattinnumber," +
                            "openingbalance,reservename,ledstatename</FETCH>" +
                        "</COLLECTION>" +
                    "</TDLMESSAGE>" +
                "</TDL>" +
            "</DESC>" +
        "</BODY>" +
    "</ENVELOPE>";

    const voucherXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportVoucher</ID>"+
        "</HEADER>"+
        "<BODY>"+
            "<DESC>"+
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>"+
                    "<TDLMESSAGE>"+
                        '<COLLECTION Name="exportVoucher" ISMODIFY="No">'+
                            "<TYPE>vouchers</TYPE>"+
                            "<FETCH>typeofvoucher,reference,referencedate,partyledgername,alterid</FETCH>"+
                        "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    const inventoryXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportVoucher</ID>"+
        "</HEADER>"+
        "<BODY>"+
            "<DESC>"+
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>"+
                    "<TDLMESSAGE>"+
                        '<COLLECTION Name="exportVoucherSrc" ISMODIFY="No">'+
                            "<TYPE>vouchers</TYPE>"+
                        "</COLLECTION>"+
                        '<COLLECTION Name="exportVoucher" ISMODIFY="No">'+
                            "<SOURCECOLLECTION>exportVoucherSrc</SOURCECOLLECTION>"+
                            "<WALK>inventoryentries, BatchAllocations</WALK>"+
                            "<FETCH>date,trackingnumber,batchname,godownname,orderno,ledgername,"+
                            "stockitemname,billedqty,rate,amount,discount,masterid,isdeemedpositive</FETCH>"+
                        "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    const ledgerEntryXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportVoucher</ID>"+
        "</HEADER>"+
        "<BODY>"+
            "<DESC>"+
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>"+
                    "<TDLMESSAGE>"+
                        '<COLLECTION Name="exportVoucherSrc" ISMODIFY="No">'+
                            "<TYPE>vouchers</TYPE>"+
                        "</COLLECTION>"+
                        '<COLLECTION Name="exportVoucher" ISMODIFY="No">'+
                            "<SOURCECOLLECTION>exportVoucherSrc</SOURCECOLLECTION>"+
                            "<WALK>AllLedgerEntries</WALK>"+
                            "<FETCH>date,amount,ledgername,masterid</FETCH>"+
                        "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    const billsXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportVoucher</ID>"+
        "</HEADER>"+
        "<BODY>"+
            "<DESC>"+
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>"+
                    "<TDLMESSAGE>"+
                        '<COLLECTION Name="exportVoucherSrc" ISMODIFY="No">'+
                            "<TYPE>vouchers</TYPE>"+
                        "</COLLECTION>"+
                        '<COLLECTION Name="exportVoucher" ISMODIFY="No">'+
                            "<SOURCECOLLECTION>exportVoucherSrc</SOURCECOLLECTION>"+
                            "<WALK>ledgerentries,billallocations</WALK>"+
                            "<NATIVEMETHOD>masterid</NATIVEMETHOD>"+
                            "<FETCH>date,ledgername,name,billdate,billcreditperiod,amount,billtype</FETCH>"+
                        "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    const costCentreXml = "<ENVELOPE>"+
        "<HEADER>"+
            "<VERSION>1</VERSION>"+
            "<TALLYREQUEST>Export</TALLYREQUEST>"+
            "<TYPE>Collection</TYPE>"+
            "<ID>exportVoucher</ID>"+
        "</HEADER>"+
        "<BODY>"+
            "<DESC>"+
                "<STATICVARIABLES>" +
                    `<SVFROMDATE TYPE="Date">${date}</SVFROMDATE>` +
                "</STATICVARIABLES>" +
                "<TDL>"+
                    "<TDLMESSAGE>"+
                        '<COLLECTION Name="exportVoucherSrc" ISMODIFY="No">'+
                            "<TYPE>vouchers</TYPE>"+
                        "</COLLECTION>"+
                        '<COLLECTION Name="exportVoucher" ISMODIFY="No">'+
                            "<SOURCECOLLECTION>exportVoucherSrc</SOURCECOLLECTION>"+
                            "<WALK>ledgerentries,costcentreallocations</WALK>"+
                            "<NATIVEMETHOD>masterid</NATIVEMETHOD>"+
                            "<FETCH>date,ledgername,name,category,amount</FETCH>"+
                        "</COLLECTION>"+
                    "</TDLMESSAGE>"+
                "</TDL>"+
            "</DESC>"+
        "</BODY>"+
    "</ENVELOPE>";

    return {
        ledgerXml : ledgerXml,
        voucherXml : voucherXml,
        inventoryXml : inventoryXml,
        ledgerEntryXml : ledgerEntryXml,
        billsXml : billsXml,
        costCentreXml : costCentreXml
    }
}
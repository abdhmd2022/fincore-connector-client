const Service = require('node-windows').Service;

const svc = new Service({
    name:'fincore',
    description: 'Fincore connector for tally',
    script: `${__dirname}\\index.js`
});

svc.on('install',function(){
    console.log("Service Created");
    svc.start();
    console.log("Service Started");
});

svc.on("alreadyinstalled",function(){
    svc.start();
    console.log("Service Started");
});
svc.install();
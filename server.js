const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition = protoLoader.loadSync('city.proto',{});
const cityProto = grpc.loadPackageDefinition(packageDefinition).city; 
const heavy_traffic = ["M50 Southbound","M50 Northbound","N11","South Quays"];


function count(call){
    let roadList =  ["South Circular", "O'Connell St","Westmoreland St", "Upper Rathmines Rd", "M50 Southbound"];
    let message = "";
    let warning = "Normal traffic conditions";
    let total_cars = 0;

    call.write({count:message});

    for (let i = 0; i < roadList.length; i++){
        message = randomInt(13,500);
        total_cars = total_cars + message;
        message = message +" cars passed " + roadList[i] + " sensor in the past 30 mins";
        call.write({count:message});
    }
    
    call.end();
} 

function lights(call,callback){
    let status ="";
    let energy = randomInt(50000,500000);
    console.log("lights function is running");

    if (call.request.toggle == "On"){
        status = "On";
    }
    else{
        status = "Off";
    }
   
    callback(null,{status:status,energy:energy});
    
}

function warning(call,callback){
    let message = "\nWarning Message\n---------------------------------------------------------------------\n";

    call.on("data",function(request){
        for (let i = 0; i<heavy_traffic.length; i++){
            if (request.location == heavy_traffic[i]){
                message = message + "Heavy Traffic warning: " + request.location + "\n"
            }
        }
    });

    call.on("end", function () {
        callback(null, {warning:message});
    });
}

function main(){
    const server = new grpc.Server();
    server.addService(cityProto.Lights.service,{switch:lights});
    server.addService(cityProto.Counter.service,{counter:count});
    server.addService(cityProto.TrafficWarning.service,{warning:warning});
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(), () => {
   // server.start();
    console.log('Server running at http://0.0.0.0:4500');
    });

}
main();

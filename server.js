const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition = protoLoader.loadSync('city.proto',{});
const cityProto = grpc.loadPackageDefinition(packageDefinition).city; 


function count(call,callback){
    let roadList = call.request.road;
    let message = "";
    let warning = "Normal traffic conditions";
    let total_cars = 0;

    for (let i = 0; i < roadList.length; i++){
        message = randomInt(13,500);
        total_cars = total_cars + message;
        message = message +" cars passed " + roadList[i] + " sensor in the past 30 mins";
        call.write({count:message});
    }
    
  /*  if ((total_cars/roadList.length)>100){
        warning = "Warning: Heavy traffic";
    } */

  //  call.write({traffic_warning:warning});

    call.end();
} 

function lights(call,callback){
    let status = call.request.status;
    let energy = 0;
    console.log("lights function is running");

    if (call.request.toggle){
        if (status.match("Off")){
            status = "On";
        }
        else{
            status = "Off";
        }
    }

   
    callback(null,{status:status,energy:energy});
    
}

function main(){
    const server = new grpc.Server();
    server.addService(cityProto.Lights.service,{switch:lights});
    server.addService(cityProto.Counter.service,{counter:count});
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(), () => {
   // server.start();
    console.log('Server running at http://0.0.0.0:4500');
    });
}
main();
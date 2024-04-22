const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition = protoLoader.loadSync('lights.proto',{});
const lightsProto = grpc.loadPackageDefinition(packageDefinition).lights; 

function main(){
    const server = new grpc.Server();
    server.addService(lightsProto.Lights.service,{switch:lights});
    server.bindAsync('0.0.0.0:4501', grpc.ServerCredentials.createInsecure(), () => {
   // server.start();
    console.log('Server running at http://0.0.0.0:4501');
    });

}
main();

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
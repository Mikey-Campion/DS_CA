/*
 * Server program for smart city project
 * This server implements the Lights grpc service
 * Unary grpc is used here
 * Author: Michael Campion
 */

// This section loads the required proto file
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const packageDefinition = protoLoader.loadSync('lights.proto',{});
const lightsProto = grpc.loadPackageDefinition(packageDefinition).lights; 

function main(){
    //This section creates the server and the connection with the client
    const server = new grpc.Server();
    server.addService(lightsProto.Lights.service,{switch:lights});
    server.bindAsync('0.0.0.0:4501', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:4501');
    });

}
main();

// This function is the implementation of the Lights grpc service
function lights(call,callback){
    let status ="";
    // These variables are used to create a value for energy consumed for today, it is based off the time of day
    let today = new Date();
    let hours = today.getHours();
    let energy = hours *1135;
 
    // If the user has chosen to turn the lights on
    if (call.request.toggle.toLowerCase() == "on"){
        status = "On";
    }
    // If the user has chosen to turn the lights off
    else if (call.request.toggle.toLowerCase() == "off"){
        status = "Off";
    }
   
    callback(null,{status:status,energy:energy}); // Send message to the client
}

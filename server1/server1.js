/*
 * Server program for smart city project
 * This server implements the Counter grpc service
 * Server side streaming is used here
 * Author: Michael Campion
 */

// This section loads the required proto file
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto'); // Used to create the data that is sent to the client
const packageDefinition = protoLoader.loadSync('count.proto',{});
const countProto = grpc.loadPackageDefinition(packageDefinition).count; 

function main(){
    //This section creates the server and the connection with the client
    const server = new grpc.Server();
    server.addService(countProto.Counter.service,{counter:count});
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:4500');
    });

}
main();

//This function is the implementation of the Counter service
function count(call){
    // List of roads that have "sensors" to measure traffic numbers
    let roadList =  ["South Circular", "O'Connell St","Westmoreland St", "Upper Rathmines Rd", "M50 Southbound"];
    let message = ""; // Message that will be sent to the client
    let total_cars = 0;

    call.write({count:message});

    // This loop sends a message with traffic statistics for each road in the list
    for (let i = 0; i < roadList.length; i++){
        message = randomInt(13,500); // Create a random number of cars that have passed to simulate a sensor
        total_cars = total_cars + message;
        message = message +" cars passed " + roadList[i] + " sensor in the past 30 mins"; // Create message to be sent to client
        call.write({count:message}); // Send message to the client
    }
    
    call.end(); // End call once streaming is finished
}

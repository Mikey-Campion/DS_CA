/*
 * Server program for smart city project
 * This server implements the TrafficWarning grpc service
 * Client side streaming is used here
 * Author: Michael Campion
 */

// This section loads the required proto file
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const packageDefinition = protoLoader.loadSync('warning.proto',{});
const warningProto = grpc.loadPackageDefinition(packageDefinition).warning; 
// Locations that have a traffic warning
const heavy_traffic = ["M50 Southbound","M50 Northbound","N11","South Quays"]; 

function main(){
    //This section creates the server and the connection with the client
    const server = new grpc.Server();
    server.addService(warningProto.TrafficWarning.service,{warning:warning});
    server.bindAsync('0.0.0.0:4502', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:4502');
    });

}
main();

// This function is the implementation of the TrafficWarning service
function warning(call,callback){
    let message = "\nWarning Message\n---------------------------------------------------------------------\n";

    // This section checks each location that has been streamed from the client against the list of locations with traffic warnings
    call.on("data",function(request){
        for (let i = 0; i<heavy_traffic.length; i++){
            // If the location has a traffic warning add it to the message to be returned
            if (request.location == heavy_traffic[i]){
                message = message + "Heavy Traffic warning: " + request.location + "\n"
            }
        }
    });

    // This sections returns one message containg all locations with a traffic warning
    call.on("end", function () {
        callback(null, {warning:message});
    });

    // If an error occurs
    call.on("error",function(error){
        console.log("An error has occured (server) " + error);
    });
}

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition = protoLoader.loadSync('count.proto',{});
const countProto = grpc.loadPackageDefinition(packageDefinition).count; 

function main(){
    const server = new grpc.Server();
    server.addService(countProto.Counter.service,{counter:count});
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(), () => {
   // server.start();
    console.log('Server running at http://0.0.0.0:4500');
    });

}
main();

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
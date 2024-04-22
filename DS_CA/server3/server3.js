const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const packageDefinition = protoLoader.loadSync('warning.proto',{});
const warningProto = grpc.loadPackageDefinition(packageDefinition).warning; 
const heavy_traffic = ["M50 Southbound","M50 Northbound","N11","South Quays"];

function main(){
    const server = new grpc.Server();
    server.addService(warningProto.TrafficWarning.service,{warning:warning});
    server.bindAsync('0.0.0.0:4502', grpc.ServerCredentials.createInsecure(), () => {
   // server.start();
    console.log('Server running at http://0.0.0.0:4502');
    });

}
main();

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
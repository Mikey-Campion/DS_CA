const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition1 = protoLoader.loadSync('count.proto',{});
const countProto = grpc.loadPackageDefinition(packageDefinition1).count;  
const packageDefinition2 = protoLoader.loadSync('lights.proto',{});
const lightsProto = grpc.loadPackageDefinition(packageDefinition2).lights; 
const packageDefinition3 = protoLoader.loadSync('warning.proto',{});
const warningProto = grpc.loadPackageDefinition(packageDefinition3).warning;


function main(){
    const client1 = new countProto.Counter('localhost:4500', grpc.credentials.createInsecure());
    const client2 = new lightsProto.Lights('localhost:4501', grpc.credentials.createInsecure());
    const client3 = new warningProto.TrafficWarning('localhost:4502', grpc.credentials.createInsecure());
    const readline = require('readline-sync');

    console.log("Client program is running\n");
    let option = ""; 

   // while (true){
 
        console.log("\n---------------------------------------------------------------------");
        console.log("Enter the number corresponding to the option you would ike to select");
        console.log("1.Traffic statistics");
        console.log("2.Control of street lighting"); 
        console.log("3.Check for traffic warning");
      //  console.log("4.Q for quit");
        console.log("---------------------------------------------------------------------")
        option = readline.question("Enter your desired option: ");
        
            if (option == '1'){

                console.log("\nOption 1: Traffic Stats\n---------------------------------------------------------------------");
                
                let call1 = client1.counter({});
 
                call1.on('data',function(response){
                    console.log(response.count);
                 });    

                call1.on("end",function(){
                    console.log("Stream is finished");
                });
                
            }     
            else if (option =="2"){   

                console.log("\nOption 2: Lighting\n---------------------------------------------------------------------");
                
                client2.switch({toggle:"Off"},function(error,response){
                    if (error) {
                        console.error(error);
                        } else {
                        console.log("The current status of the City lights is: " + response.status);
                        console.log("The City lights have consumed " + response.energy + " KwH today");
                        }
                       
                });
            }
            else if (option == "3"){

                console.log("\nOption 3: Warning\n---------------------------------------------------------------------");

                let call2 = client3.warning(function(error,response){
                    if (error){
                        console.log("An error has occured (client): " + error);
                    } else{
                        console.log(response.warning + " ");
                    }
                });

                let location = "";

                while (true) {
                    location = readline.question("Enter a location to check or Q for quit: ");

                    if (location.toLowerCase() == "q"){
                        break;
                    }
                    else{
                        call2.write({location:location});
                    } 

                }
                call2.end();

            }
        /*    else if (option.toLowerCase() == "q"){
                break;
            }      
    } */
}
main(); 


const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const { randomInt } = require('crypto');
const packageDefinition = protoLoader.loadSync('city.proto',{});
const cityProto = grpc.loadPackageDefinition(packageDefinition).city;  

function main(){
    const client1 = new cityProto.Counter('localhost:4500', grpc.credentials.createInsecure());
    const client2 = new cityProto.Lights('localhost:4500', grpc.credentials.createInsecure());
    const readline = require('readline-sync');
    const roadList = ["South Circular", "O'Connell St","Westmoreland St", "Upper Rathmines Rd", "M50 Southbound"];
    let cont = "Yes";


    console.log("Client program is running\n---------------------------------------------------------------------");
    console.log("Enter the number corresponding to the option you would ike to select");
    console.log("1.Traffic statistics");
    console.log("2.Control of street lighting\n"); 
    console.log("---------------------------------------------------------------------")
    let option = "";

   // while (cont.match("Yes")){
        //cont = readline.question("Would you like to continue Yes/No: ");
        option = readline.question("Enter your desired option: ");

        switch (option){
            case '1':
                console.log("This is option a")
                
                let call1 = client1.counter({road: roadList});
 
                call1.on('data',function(response){
                console.log(response.count);
                 //  console.log(response.traffic_warning);
                });
                //cont = readline.question("Would you like to continue Yes/No: ");
                break;
            case '2':
                client2.switch({status:"Off",toggle:true},function(error,response){
                    if (error) {
                        console.error(error);
                        } else {
                        console.log("The current status of the City lights is: " + response.status);
                        console.log("The City lights have consumed " + response.energy + " KwH");
                        //cont = readline.question("Would you like to continue Yes/No: ");
                        }
                       
                });
                //cont = readline.question("Would you like to continue Yes/No: ");
                cont = "No";
                break;  

            default:
                console.log("No valid option selected");
                cont = false; 

        }
 //   }

    /*client2.switch({status:"Off",toggle:true},function(error,response){
        if (error) {
            console.error(error);
            } else {
            console.log("The current status of the City lights is: " + response.status);
            console.log("The City lights have consumed " + response.energy + " KwH");
            }
           
    }); */

   /* let call1 = client1.counter({road: roadList});
 
    call1.on('data',function(response){
    console.log(response.count);
  //  console.log(response.traffic_warning);
    }); */




    
}
main();
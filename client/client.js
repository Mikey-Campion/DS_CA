/*
 * Client program for smart city project
 * Author: Michael Campion
 */

// This section loads the required proto files for the program
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
const packageDefinition1 = protoLoader.loadSync('count.proto',{});
const countProto = grpc.loadPackageDefinition(packageDefinition1).count;  
const packageDefinition2 = protoLoader.loadSync('lights.proto',{});
const lightsProto = grpc.loadPackageDefinition(packageDefinition2).lights; 
const packageDefinition3 = protoLoader.loadSync('warning.proto',{});
const warningProto = grpc.loadPackageDefinition(packageDefinition3).warning;


function main(){
    // This section creates channels with the respective servers
    const client1 = new countProto.Counter('localhost:4500', grpc.credentials.createInsecure());
    const client2 = new lightsProto.Lights('localhost:4501', grpc.credentials.createInsecure());
    const client3 = new warningProto.TrafficWarning('localhost:4502', grpc.credentials.createInsecure());
    const readline = require('readline-sync'); // This is used to take user input from the command line

    console.log("Client program is running\n"); // Show the user that the client program is running
    let option = ""; 

    // This section prints the different options for the user to see
    console.log("\n---------------------------------------------------------------------");
    console.log("Enter the number corresponding to the option you would ike to select");
    console.log("1.Traffic statistics");
    console.log("2.Control of street lighting"); 
    console.log("3.Check for traffic warning");
    console.log("---------------------------------------------------------------------")
    option = readline.question("Enter your desired option: "); // Take the user inputed option
    
    // 1st option: Get statistics on number of cars that have passed busy locations in Dublin
    if (option == '1'){

        console.log("\nOption 1: Traffic Stats\n---------------------------------------------------------------------");
        
        let call1 = client1.counter({}); // Send request message, message is empty as it does not take any input

        // This logs the response messages as they are received from the server
        call1.on('data',function(response){
            console.log(response.count);
            });    

        // This tells the user when the server is done streaming
        call1.on("end",function(){
            console.log("Stream is finished");
        });

        // Tell the user if there is an error
        call1.on("error",function(error){
            console.log("An error has occured" + error);
        });
        
    }     
    // 2nd option: Switch the lights on or off and find out the amount energy the street lights have consumed
    else if (option =="2"){   

        console.log("\nOption 2: Lighting\n---------------------------------------------------------------------");
        let toggle = readline.question("Would you like the lights On or Off: "); //Take user input for switching On/Off

        // This checks that the user has entered a valid input, it is not case sensitive
        if (toggle.toLowerCase() != "on" && toggle.toLowerCase() != "off"){
            console.log("Error, input must be: \"On\" or \"Off\"");
        }
        // If the input is valid the message is sent to the server
        else{
            client2.switch({toggle:toggle},function(error,response){
                if (error) {
                    console.error(error); // Log an error if it occurs
                }
                // Show the user whether the lights are on or off and the amount of energy they have consumed today
                else {
                    console.log("The current status of the City lights is: " + response.status);
                    console.log("The City lights have consumed " + response.energy + " KwH today");
                }
                
            });
        }
    }
    // 3rd Option: Check if there are any traffic warnings for user inputted locations
    else if (option == "3"){

        console.log("\nOption 3: Warning\n---------------------------------------------------------------------");

        let call2 = client3.warning(function(error,response){
            if (error){
                console.log("An error has occured (client): " + error); // Tell the user if there is an error
            } else{
                console.log(response.warning + " "); // Print the response which will contain any traffic warnings
            }
        });

        let location = "";

        // This loop continues to ask the user for input until they chose to quit. 
        while (true) {
            // Ask user for input
            location = readline.question("Enter a location to check or Q if you have no more locations to enter: ");

            // If user has no more input exit the loop
            if (location.toLowerCase() == "q"){
                break;
            }
            // Stream user input as it is received
            else{
                call2.write({location:location});
            } 

        }
        call2.end(); // Finish streaming

    } 
    // If user enters an option other than 1,2 or 3 print an error message
    else{
        console.log("Error: Input was not valid, please enter a valid option");
    }
}
main(); 

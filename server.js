 	var express		=require('express');
 	app			=express();
 	var path 		=require('path');
 	var bodyParser	=require('body-parser');
 	var FBMessenger = require("fb-messenger")
 	const request = require('request')
 	var chatScrapper = require('./functions/chatScrapper.js')();
 	var releventFinder = require('./functions/releventFinder.js')();
 	app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

 	//App Configurations
 	app.use(express.static(path.join(__dirname, 'public')));
 	app.use(bodyParser.json());
    const token = "EAAWR38prIEIBAHuBFytmbVzdZAmvXQJCd8cYM6K0OHuZCgcy5zQRcMbd93iMfTtXAzZC71yIWjZB0WgJTggXT6oFrokSgzZCslHfqwMN3dVQuJ6OsfnB7PiXJjXN9vCJAYtZAWfaTZAuJANfID8nGlGZAeo2zLldhABteZCFOBz3iHgZDZD"

    var messenger = new FBMessenger(token)
 	app.use(bodyParser.urlencoded({ extended: true }));
 	app.use('/user',require('./routers/userR.js'));
 	app.use('/qflow',require('./routers/qflowR.js'))
 	app.use('/hoteldata',require('./routers/hotelDataR.js'))
 	app.get('/relevent/:id',function(req,res){
 	    releventFinder.releventFood(req.params.id)
 	    
 	})
 
 	//ORM Configurations
 
 
 // to authenticate first time with facebook
messenger.setPersistentMenu (923030857854803, [{"title":"Restart Bot",
            "type":"postback",
            "payload":"start_again" }
        //     {"title":"Get Help",
        //     "type":"postback",
        //     "payload":"help"},
	       // {"title":"About Me",
	       //     "type":"postback",
	       //     "payload":"about_me"}
        ]) // Set's Page's Persistent Menu 

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    console.log(new Date())
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});


app.post('/webhook/', function (req, res) {
    
    let messaging_events = req.body.entry[0].messaging

    if(req.body.entry[0].messaging){
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    console.log(event.message)
	   if (event.postback) {
			processPostback(event)
		}
	   else if (event.message && event.message.text) {
	       
		    let text = event.message.text
		   	if (event.message.quick_reply) 
		   	{
		   	    console.log("quick reply is called")
		   		processPostback(event)
			}
			else{

			    chatScrapper.qflow(sender,event.message.text)
		      //  messenger.sendTextMessage(sender, 'Which coin you want to track? (example: btc)');
                }
	    }else if(event.message){
	        	 if(event.message.attachments)
	        	 {
            	    locationGetter(event)
            	  }
			}
    }
    res.sendStatus(200)
    }
})

function locationGetter(event){
     var senderId = event.sender.id;
     if(event.message.attachments[0].payload.coordinates){
    console.log("location is called")
    var lat = event.message.attachments[0].payload.coordinates.lat
    var long = event.message.attachments[0].payload.coordinates.long
 		db('user').update({user_id:senderId},{ "address_lat":lat, "address_long":long}).exec(function (err, data){  
 			if(err){ console.log("location updated") }
 		})
 		 setTimeout(function(){messenger.sendTextMessage(senderId, "Found something great!");},100)	
 									   setTimeout(function() {
 									       releventFinder.releventFood(senderId)
 									   },500)
 	//	 messenger.sendTextMessage(senderId, 'Would you like me to invite anybody to join? Just add their email.');
}
}
// postback function
function processPostback(event) 
{
  var senderId = event.sender.id;
  if( event.postback){
  
		 var payload = event.postback.payload;
		 	console.log(new Date())
		 	console.log(payload)
	}
	
  if(event.message){
	var quickReply = event.message.quick_reply.payload;
  }
	if(payload){	
			  if (payload === "USER_DEFINED_PAYLOAD") {
			  
			  			messenger.getProfile(senderId, function(err,data){
			    		 if(data){ 
			    		    console.log(data)
			    		 	 db('user').findOrCreate({user_id:data.id},{
		 					  	user_id:data.id,
		 					  	user_name:data.first_name+' '+data.last_name,
		 					  	user_image : data.profile_pic,
		 				        sex:	  data.gender
		 				}).exec(function(err){ 
		 						if(err){ 
		 							console.log(new Date())
		 							console.log(err); 
		 						}else{ 
		 							console.log(new Date())
		 							console.log('User has been created/updated '); 
		 						} 
	 					});		
			        	
			    		 	 messenger.sendQuickRepliesMessage(senderId, "Hi "+data.first_name+", I\'m Foodie, your personal food finder to make sure you always have a delicious meal. To get started do you mind if I ask you a few questions?",[{
                                                                      "content_type":"text",
                                                                      "title":"Sure!",
                                                                      "payload":"sure"
                                                                    }])
			    		 }
			  						
			  			})
			  			
				
			  	
			  }else if (payload === "start_again") {
			      db('qflow').update({user_id:senderId},{q1_turn:false,q2_turn:false,q3_turn:false,q4_turn:false,q1_ans:"",q2_ans:"",q3_ans:"",q4_ans:""}).exec(function (err, data){  
			          console.log("Data is restored on start_again")
			          	 
			  
			  			messenger.getProfile(senderId, function(err,data){
			    		 if(data){
			    		 	 messenger.sendQuickRepliesMessage(senderId, "Hi "+data.first_name+", I\'m Foodie, your personal food finder to make sure you always have a delicious meal. To get started do you mind if I ask you a few questions?",[{
                                                                      "content_type":"text",
                                                                      "title":"Sure!",
                                                                      "payload":"sure"
                                                                    }])
			    		 }
			  						
			  			})
			      })    
			  }
	}
	
  if(quickReply){
	console.log(quickReply)
	if (quickReply.includes('sure')) {
	      
 								db('qflow').findOrCreate({user_id:senderId},{user_id:senderId, q1_turn:false,q2_turn:false,q3_turn:false,q4_turn:false}).exec(function (err, data){  
 									if(err){  
 										res.status(500).send(err);  
 									}else{  
 									 
 									     db('qflow').update({user_id:senderId},{ q1_turn:true}).exec(function (err, data){console.log("q1_turn is true now")  })

 									}  
 								});  
 						
	    	messenger.sendTextMessage(senderId, "Are there any foods or things you don't like such as avocados or spicy foods?");
       
	}
	if (quickReply.includes('direction_yes')) {
	    	
 			db('user').findOne({user_id: senderId}).exec(function(err,data){ 
 				if(err){ 
 					res.status(500).send(err); 
 				}else{ 
 				    
 				    console.log(data)
 				     messenger.sendButtonsMessage(senderId, "Click here For direction", [
                          {
                            "type":"web_url",
                            "url":data.likedObject.Restaurant_Name_Address_url+"/"+data.address_lat+","+data.address_long,
                            "title":"Direction"
                          }])
 					  setTimeout(function(){
 					   messenger.sendTextMessage(senderId, "Thanks for letting me find you something delicious. When you go, will you send me a picture of your meal and let me know what you thought? I'll be able to use this information to better recommend other meals in the future!");

 					  },1000)
 				}  
 			});   
	   
	    
	}
		if (quickReply.includes('direction_no')) {
	    		    	messenger.sendTextMessage(senderId, "Thanks for letting me find you something delicious. When you go, will you send me a picture of your meal and let me know what you thought? I'll be able to use this information to better recommend other meals in the future!");
    
	}
	if (quickReply.includes('location_no')) {
	    		    	messenger.sendTextMessage(senderId, "Oh! Sorry i am unable to move forward. Please restart bot and allow me your to get your location.");
                               db('qflow').update({user_id:senderId},{q1_turn:false,q2_turn:false,q3_turn:false,q4_turn:false,q1_ans:"",q2_ans:"",q3_ans:"",q4_ans:""}).exec(function (err, data){ })
	}
  }  //end of if quickeply only
}  // end of postback function
 
 
 
 
 	
 	var waterlineConfig = require('./waterline/config')
 	, waterlineOrm = require('./waterline/init').waterlineOrm;
 	var modelPath = path.join(__dirname, '/models');
 	require('./waterline/init')(modelPath);
 	//ORM Initialization 
 	waterlineOrm.initialize(waterlineConfig, function (err, models) {
 	if (err) throw err;
 	db = function (table) { return models['collections'][table]; };
 	db.collections = models.collections;
 	db.connections = models.connections;
 	
 	});

 //	module.exports = app;
 app.listen(process.env.PORT);

var FBMessenger = require('fb-messenger')
const token = "EAAWR38prIEIBAHuBFytmbVzdZAmvXQJCd8cYM6K0OHuZCgcy5zQRcMbd93iMfTtXAzZC71yIWjZB0WgJTggXT6oFrokSgzZCslHfqwMN3dVQuJ6OsfnB7PiXJjXN9vCJAYtZAWfaTZAuJANfID8nGlGZAeo2zLldhABteZCFOBz3iHgZDZD"
var messenger = new FBMessenger(token)
var request = require('request');
  var releventFinder = require('./releventFinder.js')();

var main =function(){
   
            var qflow = function(id,text){
                          
                  db('qflow').findOne({user_id: id}).exec(function(err,data){ 
                    if(err){ 
                      res.status(500).send(err); 
                    }else{ 
                        console.log(data)
                    if(data){
                      if(data.q1_turn){
                            db('qflow').update({user_id:id},{q1_ans:text}).exec(function (err, data){  
                                      if(err){  
                                        res.status(500).send(err);
                                      }else{
                                          console.log("q1 is updated")
                                          var query = {
                                                                         query:text
                                                                        }
                                                          
                                                            var donts = []
                                                           request({
                                                              url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
                                                              method: 'POST',
                                                               headers: {
                                                                            'Accept': 'application/json',
                                                                            'x-app-id': 'b2b65a1e',
                                                                            'x-app-key': '3b6af677df186e5b2b0beb5315a96e81'
                                                                        },
                                                              json: query
                                                            }, function(error, response, body){
                                                              
                                                            //   db('user').findOne({user_id:id}).exec(function(err,data){
                                                                  
                                                                //   donts = data.donts
                                                                    for(obj in body.foods){
                                                                          donts.push(body.foods[obj].food_name)
                                                                      }
                                                              
                                                                     db('user').update({user_id:id},{donts:donts}) .exec(function (err, data){})
                                                         
                                                                   
                                                                        })

                                                                //  });
                                          messenger.sendTextMessage(id, "None of that for you then! Anything you're craving right now?");
                                                            db('qflow').update({user_id:id},{q2_turn:true,q1_turn:false}) .exec(function (err, data){})
                                                            
                                      }
                                
                            })
                      }
                      else if(data.q2_turn){
                            db('qflow').update({user_id:id},{q2_ans:text}).exec(function (err, data){  
                                      if(err){  
                                        res.status(500).send(err);
                                      }else{
                                           console.log("q2 is updated")
                                          var likes = []
                                           var query = {
                                                                         query:text
                                                                        }
                                                           request({
                                                              url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
                                                              method: 'POST',
                                                               headers: {
                                                                            'Accept': 'application/json',
                                                                            'x-app-id': 'b2b65a1e',
                                                                            'x-app-key': '3b6af677df186e5b2b0beb5315a96e81'
                                                                        },
                                                              json: query
                                                            }, function(error, response, body){
                                                              console.log(body);
                                                              for(obj in body.foods){
                                                                  likes.push(body.foods[obj].food_name)
                                                              }
                                                              db('user').update({user_id:id},{likes:likes}) .exec(function (err, data){})
                                                            });
                                          messenger.sendQuickRepliesMessage(id,"Want me to use your location to find your meal?", [{
                                                                      "content_type":"location",
                                                                      "title":"Yes",
                                                                      "payload":"location_yes"
                                                                    },{
                                                                      "content_type":"text",
                                                                      "title":"No",
                                                                      "payload":"location_no"
                                                                    }]) // Sends a Quick Replies Message 
                                                            db('qflow').update({user_id:id},{q2_turn:false,q3_turn:true}).exec(function (err, data){})   
                                          
                                      }
                                
                            })
                      }
                      else if(data.q3_turn){
                            db('qflow').update({user_id:id},{q3_ans:text}).exec(function (err, data){  
                                      if(err){  
                                        res.status(500).send(err);
                                      }else{
                                             console.log("q1 is updated")
                                        //  messenger.sendQuickRepliesMessage(id,"Would you like me to get directions for you?", [{
                                //                                       "content_type":"text",
                                //                                       "title":"Yes",
                                //                                       "payload":"direction_yes"
                                //                                     },{
                                //                                       "content_type":"text",
                                //                                       "title":"No",
                                //                                       "payload":"direction_no"
                                //                                     }])
                                        
                                            messenger.sendTextMessage(id, "Thanks for letting me find you something delicious. When you go, will you send me a picture of your meal and let me know what you thought? I'll be able to use this information to better recommend other meals in the future!");

                                          
                                                            db('qflow').update({user_id:id},{q4_turn:true,q3_turn:false}) .exec(function (err, data){
                                                                       
                                                            })   
                                      
                                          
                                      }
                                
                            })
                      }
                      else if(data.q4_turn){
                       
                                         
                                         
                                                            db('qflow').update({user_id:id},{q4_turn:false,q5_turn:true}) .exec(function (err, data){
                                                                 messenger.getProfile(id, function(err,data){
                                                              messenger.sendTextMessage(id, "Thanks "+ data.first_name+"! Enjoy your meal!");

                                                      
                                                               })
                                                                
                                                            }) 
                      }
                      else if(data.q5_turn){
                          console.log("i turn 5")
                                                            db('qflow').update({user_id:id},{q5_turn:false}) .exec(function (err, data){
                              
                  
                                                             

                                                            })   
                                      
                                    
                        

                      }
                      
                    } 
                  }
                  });  
                
            
            }; //function

                

        
        return{
            qflow : qflow
        }
}  // end of main function

module.exports = main;


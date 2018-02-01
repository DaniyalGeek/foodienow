
var FBMessenger = require('fb-messenger')
const token = "EAAWR38prIEIBAHuBFytmbVzdZAmvXQJCd8cYM6K0OHuZCgcy5zQRcMbd93iMfTtXAzZC71yIWjZB0WgJTggXT6oFrokSgzZCslHfqwMN3dVQuJ6OsfnB7PiXJjXN9vCJAYtZAWfaTZAuJANfID8nGlGZAeo2zLldhABteZCFOBz3iHgZDZD"
var messenger = new FBMessenger(token)
var request = require('request');
const Geo = require('geo-nearby');
const geolib = require('geolib');
var Geohash = require('latlon-geohash');

var main =function(){
   
            var releventFood = function(id){

                
                	 var likes = []
                	 var donts = []
 									db('user').findOne({user_id: id}).exec(function(err,user_data){ 
 										if(err){ 
 										//	res.status(500).send(err); 
 										}else{ 
 										   
 										    var str = ""
 										    for(obj in user_data.likes){
         										    str =  new RegExp(user_data.likes[obj])
         										   likes.push(str)
 										    }
 										    for(obj in user_data.donts){
     										    str =  new RegExp(user_data.donts[obj])
     										   donts.push(str)
 										    }

 										    
 										        db('hoteldata').find({$and:[{ "Restaurant_Name_Catergory_Menu_Item_Description":likes},{ "Restaurant_Name_Catergory_Menu_Item_Description":{$nin:donts}}]}).exec(function (err, data){  
                 									if(err){  
                 										res.status(500).send(err); 
                 									}else{  
                 									    var arr = []
                 									    var object = {}
                 									    for(obj in data){
                 									        object = {}
                 									        object.lat = data[obj].Restaurant_lat
                 									        object.lon = data[obj].Restaurant_long
                 									       
                 									        object.id = data[obj].id
                 									        arr.push(object)
                 									    }
                 									  //  console.log(arr)
                 									        const dataGeo = arr                      
                                                            const geo = new Geo(dataGeo, {sorted: true, limit: 1 , setOptions: { lat: 'lat', lon: 'lon', id:'hotelid', } });
                                                             console.log(user_data.address_lat)
                                                              var nearest = geo.nearBy(user_data.address_lat,user_data.address_long, 25000);
                                                            
                                                          
                                                              console.log(nearest)
                                                              var distance = geolib.getDistance(
                                                                                 {latitude: user_data.address_lat, longitude: user_data.address_long},
                                                                                 {latitude: nearest[0].lat, longitude: nearest[0].lon}
                                                                             );
                                                                            
                                                            var distanceMiles = geolib.convertUnit('mi', distance, 2)
                                                            	db('hoteldata').findOne({id: nearest[0].id}).exec(function(err,data){ 
                                 										if(err){ 
                                 										//	res.status(500).send(err); 
                                 										}else{ 
                                 										    data.distance = distanceMiles +" miles"
                                 										     db('user').update({user_id:id},{likedObject:data}) .exec(function (err, dataUser){
                                                                                      sendGenericMessage(id,data,function(data){
                                                                                          if(data){
                                                                                              setTimeout(function(){messenger.sendTextMessage(id, "How does that sound?");},1000)
                                                                                              
                                                                                          }
                                                                                      })
                                                                                })
                                                                                
                                 										
                                 											//res.json(data);
                                 											// res.json(nearest);
                                 										}  
                                 									});  
                 										 
                 								//	console.log(data)
                 									} 
                 								}); 
 										}  
 									});  
 								  
                
                		
                
            }; //function

                

        
        return{
            releventFood : releventFood
        }
}  // end of main function

module.exports = main;


function sendGenericMessage(sender,data,callback) {
    var menuItemName = data.Restaurant_Name_Catergory_Menu_Item_name
    var restaurantName = data.Restaurant_Name_name
    var distance = data.distance
    var price = data.Restaurant_Name_Catergory_Menu_Item_Price
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [
           {
            "title":menuItemName,
            "image_url":"https://foodienow-withease.c9users.io/images/logo.png",
            "subtitle":restaurantName+"\nDistance: "+distance +"\nPrice :"+price,
            
            // ,
            "buttons":[
              {
                "type":"element_share",
                
              }           
            ]      
          }
        ]

		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }else{
	        callback(true)
	    }
    })
}




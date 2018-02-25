var FBMessenger = require('fb-messenger')
const token = "EAAWR38prIEIBAHuBFytmbVzdZAmvXQJCd8cYM6K0OHuZCgcy5zQRcMbd93iMfTtXAzZC71yIWjZB0WgJTggXT6oFrokSgzZCslHfqwMN3dVQuJ6OsfnB7PiXJjXN9vCJAYtZAWfaTZAuJANfID8nGlGZAeo2zLldhABteZCFOBz3iHgZDZD"
var messenger = new FBMessenger(token)
var request = require('request');
const Geo = require('geo-nearby');
const geolib = require('geolib');
var Geohash = require('latlon-geohash');

var main =function(){
   
            var releventFood = function(id,res){
                     var likes = []
                     var donts = []
                                    db('user').findOne({user_id: id}).exec(function(err,user_data){ 
                                        if(err){ 
                                        //  res.status(500).send(err); 
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
                                                            object.hotelname = data[obj].Restaurant_Name_Restaurant
                                                            arr.push(object)
                                                        }
                                                      // console.log(arr)
                                                            var dataGeo = arr  
                                                            var arrOfId = []
                                                            for(var i =0; i <4; i++){
                                                                const geo = new Geo(dataGeo, {sorted: true, limit: 1 , setOptions: { lat: 'lat', lon: 'lon', id:'hotelid',hotelname:'hotelname' } });
                                                                // console.log(user_data.address_lat)
                                                                var nearest = geo.nearBy(user_data.address_lat,user_data.address_long, 25000);
                                                              if(nearest[0]){
                                                               dataGeo = RemoveNode(nearest[0].id)
                                                              //console.log(nearest)
                                                              arrOfId.push(nearest[0].hotelname)
                                                              }
                                                            }
                                                            // console.log(arrOfId)
                                                           
                                                            function RemoveNode(id) {
                                                                    return dataGeo.filter(function(emp) {
                                                                        if (emp.id == id) {
                                                                            return false;
                                                                        }
                                                                        return true;
                                                                    });
                                                                }
                                                                
                                                           
                                                            
                                                            //   console.log(nearest)
                                                              
                                                              if(nearest[0]){
                                                      
                                                                            
                                                           
                                                                db('hoteldata').find({Restaurant_Name_Restaurant: arrOfId,$and:[{ "Restaurant_Name_Catergory_Menu_Item_Description":likes},{ "Restaurant_Name_Catergory_Menu_Item_Description":{$nin:donts}}]}).limit(50).exec(function(err,data){ 
                                                                        if(err){ 
                                                                        //  res.status(500).send(err); 
                                                                        }else{ 
                                                                             data = getUniqueValuesOfKey(data, 'Restaurant_Name_name');
                                                                              var distance
 
                                                                                for(obj in data){
                                                                                    if(data[obj].Restaurant_Name_name){
                                                                                             distance = geolib.getDistance(
                                                                                             {latitude: user_data.address_lat, longitude: user_data.address_long},
                                                                                             {latitude:data[obj].Restaurant_lat, longitude:data[obj].Restaurant_long}
                                                                                            
                                                                                                 );
                                                                                    }
                                                                                     data[obj].distance = geolib.convertUnit('mi', distance, 2)
                                                                                }
                                                                                      sendGenericMessage(id,data,user_data.address_lat,user_data.address_long,function(data){
                                                                                          if(data){
                                                                                              setTimeout(function(){messenger.sendTextMessage(id, "How does that sound?");},1000)
                                                                                              
                                                                                          }
                                                                                      })
                                                                        }  
                                                                    });  
                                                         
                                                //  console.log(data)
                                                              }else{
                                                                  messenger.sendTextMessage(id,"Sorry we are still updating.")
                                                              }
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


function sendGenericMessage(sender,data,userlat,userlong,callback) {
   // console.log(data)
     var menuItemName = ""
    var restaurantName = ""
  //  var distance = distance
    var price = ""
    var element = []
    var object = {}
    
    for(obj in data){
       console.log(data[obj].Restaurant_Name_Address_url+"/"+userlat+","+userlong)
        if(data[obj].Restaurant_Name_name){
        object = {}
         menuItemName = data[obj].Restaurant_Name_Catergory_Menu_Item_name
         restaurantName = data[obj].Restaurant_Name_name
       
         price = data[obj].Restaurant_Name_Catergory_Menu_Item_Price
            //  console.log(menuItemName)
       object.title = menuItemName,
        object.image_url="https://bot-jxnenterprises.c9users.io/images/logo.png"
        object.subtitle=restaurantName+"\nDistance: "+data[obj].distance +"\nPrice :"+price
        object.buttons=[
              {
                "type":"element_share",
              }  ,{
                    "type":"web_url",
                    "url":data[obj].Restaurant_Name_Address_url+"/"+userlat+","+userlong,
                    "title":"Direction"
                 }         
            ]      
          element.push(object)
    }
    
}
    //  console.log(element)
    
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": element

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



function getUniqueValuesOfKey(array, key){
    var arr = []
  return array.reduce(function(carry, item){
       
    if(item[key] && !~carry.indexOf(item[key])) 
    {  
       
         carry.push(item[key]);
          arr.push(item)
    }
     return arr;
  }, []);
}


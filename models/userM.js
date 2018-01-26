module.exports = { 
 						identity:'user', 
 						connection: 'mysqlDB',   
 						schema:true,              
 						migrate:'safe',
 						attributes: {
 						     
 						    "user_name":"string",
 						    "user_id":"string",
 						    "user_image":"string",
 						    "user_dob":"string",
 						    "sex":"string",
 						    "address":"string"
 						    
 						}   
 					};
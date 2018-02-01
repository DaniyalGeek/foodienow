module.exports = { 
 						identity:'hoteldata', 
 						connection: 'mysqlDB',   
 						schema:true,              
 						migrate:'safe',
 						attributes: {
 						     
 						Restaurant_Name_name:"string",
                        Restaurant_Name_Street:"string",
                        Restaurant_Name_City_State_Zip:"string",
                        Restaurant_Name_Catergory_name:"string",
                        Restaurant_Name_Catergory_Menu_Item_name:"string",
                        Restaurant_Name_Catergory_Menu_Item_Price:"string",
                        Restaurant_Name_Catergory_Menu_Item_Description:"string",
                        Restaurant_Name_Restaurant:"string",
                        Restaurant_Name_Telephone:"string",
                        Restaurant_Name_Address:"string",
                        Restaurant_Name_Address_url:"string",
                        Restaurant_Name_Website:"string",
                        Restaurant_Name_Price:"string",
                        Restaurant_Name_Catergory:"string",
                        Restaurant_lat:"string",
                        Restaurant_long:"string",
 						    
 						}   
 					};
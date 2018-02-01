module.exports = { 
 						identity:'qflow', 
 						connection: 'mysqlDB',   
 						schema:true,              
 						migrate:'safe',
 						attributes: {
 						    "user_id":"string",
 						    "q1_ans":"string",
 						    "q2_ans":"string",
 						    "q3_ans":"string",
 						    "q4_ans":"string",
 						     "q5_ans":"string",
 						    "q1_turn":"boolean",
 						    "q2_turn":"boolean",
 						    "q3_turn":"boolean",
 						    "q4_turn":"boolean",
 						    "q5_turn":"boolean"
 						    
 						}   
 					};
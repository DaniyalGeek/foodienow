var dani =function (){ 
 					var get=function (req,res){ 

 								db('hoteldata').find().sort('updatedAt DESC').limit(1000).exec(function (err, data){  
 									if(err){  
 										res.status(500).send(err); 
 									}else{  
 									    
 									      // for(obj in data){
 									      //     if(data[obj].Restaurant_Name_Address_url){
 									      //    var value =  data[obj].Restaurant_Name_Address_url
 									      // var arr =    value.split('/');
 									      // var arrLoc = arr[5].split(',')
 									      // var lat = arrLoc[0];
 									      // var long = arrLoc[1];
 									      //  	db('hoteldata').update({id:data[obj].id},{  Restaurant_lat:lat,Restaurant_long:long}).exec(function (err, data){  
             			// 						if(err){  
             									    
                //      									}
         							// 		})
 									      //     }
 									    //   }
 										res.json(data); 
 									} 
 								}); 
 							}; 
 					var post=function (req,res){ 
 								db('hoteldata').create(req.body).exec(function(err,data){ 
 									if(err){ 
 										res.status(500).send(err); 
 									}else{ 
 										res.status(201).json({data}); 
 									} 
 								});	 
 							}; 
 					var getOne=  function (req,res){ 
 									db('hoteldata').findOne({id: req.params.id}).exec(function(err,data){ 
 										if(err){ 
 											res.status(500).send(err); 
 										}else{ 
 											res.json(data);  
 										}  
 									});  
 								};  
 					var put=function (req,res){  
 								db('hoteldata').update({id:req.params.id},req.body).exec(function (err, data){  
 									if(err){  
 										res.status(500).send(err);  
 									}else{  
 										db('hoteldata').findOne({id:req.params.id}).exec(function(err,data){  
 											if(err){  
 												res.status(500).send(err);  
 											}else{  
 												res.json(data)  
 											}  
 										});  
 									}  
 								});  
 							};  
 					var del=function (req,res){  
 									db('hoteldata').destroy({id:req.params.id}).exec(function (err){  
 										if(err){  
 											res.status(500).send(err);  
 										}else{  
 											res.send('User with id: '+req.params.id+' has been deleted');  
 										}  
 									});  
 								};  
 					return {  
 						get: 	get,  
 						post: 	post,  
 						getOne: getOne,  
 						put: 	put,  
 						delete: del  
 					}  
 				}  
 				module.exports=dani;  
 			
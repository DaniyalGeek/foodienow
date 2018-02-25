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
                            "address_lat":"string",
                            "address_long":"string",
                            "likes": {
                                type: 'array',
                                defaultsTo: [],
                            },
                            "donts": {
                                type: 'array',
                                defaultsTo: [],
                            },
                            "likedObject": {
                                type: 'object',
                                defaultsTo: {},
                            }
                            
                        }   
                    };
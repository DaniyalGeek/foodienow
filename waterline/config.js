var mysqlAdapter = require('sails-mongo');

module.exports = {
	adapters: {
		mysqlAdapt: mysqlAdapter
	},

  connections: {
    mysqlDB: {
		adapter: 'mysqlAdapt',
		
		host: 'localhost', // defaults to `localhost` if omitted
        port: 27017, 
		database: 'c9',
		user:'root',
		password:'',
		supportBigNumbers:true, //true/false
		debug:['ComQueryPacket'], //false or array of node-mysql debug options
		trace:true //true/false
    } 
  }
};

// var mysqlAdapter = require('sails-mysql');

// module.exports = {
// 	adapters: {
// 		mysqlAdapt: mysqlAdapter
// 	},

//   connections: {
//     mysqlDB: {
// 		adapter: 'mysqlAdapt',
// 		host: 'localhost',
// 		port: '3306',
// 		database: 'bsit',
// 		user:'root',
// 		password:'',
// 		supportBigNumbers:true, //true/false
// 		debug:['ComQueryPacket'], //false or array of node-mysql debug options
// 		trace:true //true/false
//     } 
//   }
// };

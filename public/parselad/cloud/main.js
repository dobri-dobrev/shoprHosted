
// // Use Parse.Cloud.define to define as many cloud functions as you want.
// // For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

Parse.Cloud.define("ladGiver", function(request, response) {
  var query = new Parse.Query("shopr");
  var cardTypes = new Object();
  var userTypes = [];
  var sendData = [];

  query.find().then(function(results) {

  for (var i = 0; i < results.length; i++) {
    cardTypes[results[i].id] = {"title":results[i].get("name"), "image":results[i].get("imageurl"), "objId":results[i].id};
  }

  var userquery = new Parse.Query("users");
  userquery.equalTo('userid',request.params.user);

  return userquery.find();
}).then(function(results) {

  for (var i = 0; i < results.length; i++) {
   userTypes = results[i].get("viewed");
 }

 	for (var i = 0; i < userTypes.length; i++)
 	{
 		delete cardTypes[userTypes[i]];
 	}

 	for (key in cardTypes)
 	{
 		if (cardTypes.hasOwnProperty(key))
 		{
 			sendData.push(cardTypes[key]);
 		}
 	}

 // console.log(sendData);
 // console.log(userTypes);
 // console.log(cardTypes);

 response.success(sendData);
}, function(error) {
  response.error("lookup failed");
});

});

Parse.Cloud.define("ladUpdater", function(request, response) {
 
  var userquery = new Parse.Query("users");
  userquery.equalTo('userid',request.params.user);
  var temp = [];

  userquery.find({
  success: function(results) {
    if (results.length == 0)
    {


		  var userUpdate = Parse.Object.extend("users");
		  var user = new userUpdate();

		  user.set("userid",request.params.user);
		  user.set("viewed",request.params.viewed);

		  user.save(null, {
		  success: function(user) {
		  	response.success("New User Saved!");  
		    //alert('New object created with objectId: ' + user.id);
		  },
		  error: function(user, error) {
		    
		    alert('Failed to create new object, with error code: ' + error.description);
		  }
		});

    }
    else
    {
    	temp = results[0].get("viewed");
    	if (request.params.viewed.length > 0)
    	{
    		for (var i = 0; i < request.params.viewed.length; i++)
    		{
    			temp.push(request.params.viewed[i]);
    		}
    	}
    	results[0].set("viewed",temp);
    	results[0].save(null,{
    		success: function(user) {
    			response.success("User Updated");
    		},
    		error: function(user, error) {

    			alert('Failed to update object, with error code: ' + error.description);
    		}
    	});
    	
    }
  },

  error: function(error) {
    // error is an instance of Parse.Error.
  }
});



  
});

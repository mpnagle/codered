Alerts = new Meteor.Collection("alerts");
AlertEvents = new Meteor.Collection("alertsevents");

if (Meteor.isClient) {



  Template.main.events({
      'click #red' : function() {
	  Session.set("alertLevel", 2);
      },
      'click #yellow' : function() {
	  Session.set("alertLevel", 1);
      },
      'click #green' : function() {
	  Session.set("alertLevel", 0);
      },
      
      'click #submit' : function() {
	  
	  var lastObject = ""
	  Alerts.insert({
	      alertLevel: Session.get("alertLevel"), 
	      status: 0,
	      message: $("#message").val()
	      },
	      function(error,result){
		  
		  AlertEvents.insert({
			  "alertId": result,
			  "state":"created",
			  "time": (new Date()).getTime(),
		      });
	      }
	      );
	  
		      
	  
		  
	  
	  //	  console.log(Alerts.find(
	  //		  {sort: {$natural: -1}}
	  //		  ));
	      //	  AlertEvents.insert({
	  console.log($("#message").val());
      }
  });



  Template.main.alertLevel = function(){
      return Session.get("alertLevel");
  }

  Template.log.logEntries = function(){
      return AlertEvents.find({}).fetch();
  }

  Template.showRedAlerts.redAlert = function(){
      
      return Alerts.find({alertLevel:2, status:0}).fetch();
  }


  Template.friends.users = function()
      {
	  return Meteor.users.find({}).fetch();
      }
  
  Template.friends.events({
      'click #submit': function(){
	  /* 
	  emailAddress = $("#submit").val();
	  
	  var currentUser = Meteor.user();
	  currentId = currentUser._id;
	  if (currentUser.hasOwnProperty('friends'))
	      {
		  var friends = currentUser.friends;
		  friends.append(emailAddress);

	      }
	  else
	      {
		  var friends = [emailAddress];
	      }

	  Meteor.users.update({_id:currentId},{$set:{"friends":friends}});

      }
      
	  */
      }});

	  
		  
      


}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

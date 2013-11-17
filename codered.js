Alerts = new Meteor.Collection("alerts");
AlertEvents = new Meteor.Collection("alertsevents");

if (Meteor.isClient) {



  Template.main.events({
      'click #red' : function() {
	  Session.set("alertLevel", 2);
	  $('body').css("background-color","#FFE0E0");
      },
      'click #yellow' : function() {
	  Session.set("alertLevel", 1);
	  $('body').css("background-color","#faF7D2");
      },
      'click #green' : function() {
	  Session.set("alertLevel", 0);
	  $('body').css("background-color","#E4FFE4");
      },
      
      'click #submit' : function() {
	  
	  var lastObject = "";
	  Alerts.insert({
	      alertLevel: Session.get("alertLevel"), 
	      status: 0,
	      message: $("#message").val(),
	      "userId":Meteor.userId()
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
      var alertEvents = AlertEvents.find({}).fetch();
      if (alertEvents.length > 0) {
	  alertEvents.map(function(event) {
	      event.alert = Alerts.findOne({'_id':event.alertId});
	      event.user = Meteor.users.findOne({'_id':event.alert.userId});	  
	  });
      }
      return alertEvents;
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

	  
		  
      


  Template.logEntry.helpers({
      icon_map: function(alertType) {
	  return {
	      "created":"icon-plus-sign"
	  }[alertType];
      },
      firstAddress: function(arrayObject) {
	  if (arrayObject && arrayObject.length > 0) {
	      return arrayObject[0].address
	  } else {
	      return null;
	  }
      },
      timeAgo:function(time) {
	  var now = new Date().getTime();
	  var elapsed = (now-time)/1000;
	  if (elapsed > 60*60*24) {
	      return Math.round(elapsed/(60*60*24)) + " days ago";
	  } else if (elapsed > 60*60) {
	      return Math.round(elapsed/(60*60)) + " hours ago";
	  } else if (elapsed > 60) {
	      return Math.round(elapsed/60) + " minutes ago";
	  } else {
	      return Math.round(elapsed) + " seconds ago";
	  }
      }
  });


}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

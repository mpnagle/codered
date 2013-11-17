Alerts = new Meteor.Collection("alerts");
AlertEvents = new Meteor.Collection("alertsevents");

if (Meteor.isClient) {

    Meteor.subscribe("allUsers");
    Meteor.subscribe("allUserData");



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
	      "userId":Meteor.userId()},
	      function(error,result){
		  
		  AlertEvents.insert({
			  "alertId": result,
			  "state":"created",
			  "time": (new Date()).getTime(),
		          "author":Meteor.userId()
		      });
	      });
      }
  });



  Template.main.alertLevel = function(){
      return Session.get("alertLevel");
  }



  Template.log.logEntries = function(){
      var alertEvents = AlertEvents.find({},{sort: {time:-1}}).fetch();
      if (alertEvents.length > 0) {
	  alertEvents.map(function(event) {
	      event.alert = Alerts.findOne({'_id':event.alertId});
	      event.user = Meteor.users.findOne({'_id':event.alert.userId});	  
	      event.author = Meteor.users.findOne({'_id':event.author});	  
	  });
      }
      return alertEvents;
  }


  Template.showRedAlerts.redAlert = function(){
      
      return Alerts.find({alertLevel:2, status:0}).fetch();
  }

  Template.friends.friends = function() {
      var friendIds = [];
      var currentUser = Meteor.user();
      if (currentUser.hasOwnProperty("friends")) {
	  friendIds = currentUser.friends;
      }
      var users = Meteor.users.find({"_id":{"$in":friendIds}}).fetch();
      return users;
  };

  Template.friends.users = function() {
      var users = Meteor.users.find({}).fetch();
      return users;
  };
  
  Template.friends.events({
      'click #submit': function(){
	  var contactId = $('#friendtoadd').val();
	  var currentUser = Meteor.user();
	  if (!currentUser.hasOwnProperty("friends")) {
	      currentUser.friends = [];
	  }
	  if (currentUser.friends.indexOf(contactId) == -1) {
	      currentUser.friends.push(contactId);
	  }
	  Meteor.users.update(currentUser._id,{"$set":{"friends":currentUser.friends}});
      },
      'click .removeUser': function(event){
	  var contactId = $(event.target).data("userid");
	  var currentUser = Meteor.user();
	  if (!currentUser.hasOwnProperty("friends")) {
	      currentUser.friends = [];
	  }
	  if (currentUser.friends.indexOf(contactId) != -1) {
	      currentUser.friends.splice(currentUser.friends.indexOf(contactId),1);
	  }
	  Meteor.users.update(currentUser._id,{"$set":{"friends":currentUser.friends}});
      }
  });

  Template.logEntry.helpers({
      icon_map: function(alertType) {
	  return {
	      "created":"icon-bell",
	      "acknowledged":"icon-eye-open",
	      "resolved":"icon-check"
	  }[alertType];
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
  
  Template.redAlertCheckbox.events({
	  
	  'click #acknowledged':function(){
	      AlertEvents.insert({
		  "alertId":this._id,
		  "state":"acknowledged",
		  "time":(new Date()).getTime(),
		  "author":Meteor.user()._id
	      });
	      console.log("acknowledged");

	      id = this._id;
	      
	      Alerts.update({_id:id},{$set:{status:1}});

	  },
	  'click #resolved':function(){
	      AlertEvents.insert({
		  "alertId":this._id,
		  "state":"resolved",
		  "time":(new Date()).getTime(),
		  "author":Meteor.user()._id
	      });
	      console.log("resolved");
	      console.log(this);
	      id = this._id;
	      
	      Alerts.update({_id:id},{$set:{status:2}});
	  }
  });

    Handlebars.registerHelper("firstAddress",
			      function(arrayObject) {
				  if (arrayObject && arrayObject.length > 0) {
				      return arrayObject[0].address
				  } else {
				      return null;
				  }
			      });

    Handlebars.registerHelper("logMessage",
			      function(alert,author,state,user) {
				  console.log(state);
				  if (state == "created") {
				      return user.emails[0].address + " created an alert: " + alert.message;
				  } else if (state == "acknowledged") {
				      console.log(author);
				      return author.emails[0].address + " acknowledged "+user.emails[0].address + "'s alert";
				  } else if (state == "resolved") {
				      return author.emails[0].address + " resolved "+user.emails[0].address + "'s alert";
				  } else {
				      return "";
				  }
			      });
			      
}
if (Meteor.isServer) {
    Meteor.publish("allUsers", function () {
        return Meteor.users.find({});
    });
    Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {fields: {"emails.address": 1}});
    });
  Meteor.startup(function () {

      Meteor.methods({
	  'update_user':function(user) {
	      Meteor.users.update({"_id":user._id});
	  }
      });
  });
    
    Deps.autorun(function() {
	var redAlerts = Alerts.find({alertLevel:2,status:0}).fetch();
	
	if (redAlerts){
	    //alert("red alert!");
	}
    });

}

Meteor.users.allow({
    "insert":function(userId,checkin) {
	return true;
    },
    "remove":function(userId,checkin) {
	return true;
    },
    "update":function(userId,checkin) {
	return true;
    }
});

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
	  
		      
	  
	  	  Meteor.call("postTwilio");
	  
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
	      //event.user = Meteor.users.findOne({'_id':event.alert.userId});	  
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
  
  Template.redAlertCheckbox.events({
	  
	  'click #acknowledged':function(){
	      console.log("acknowledged");

	      id = this._id;
	      
	      Alerts.update({_id:id},{$set:{status:1}});

	  },
	      'click #resolved':function(){
		  console.log("resolved");
		  console.log(this);

		  id = this._id;
		  
		  Alerts.update({_id:id},{$set:{status:2}});
	      }
      });

}
if (Meteor.isServer) {
  Meteor.startup(function () {


	  Meteor.methods({
		  'postTwilio': function(){
		      
		      HTTP.call('post',
				'https://api.twilio.com/2010-04-01/Accounts/AC504dcad90a9b4647b890e9b1f71025ba/SMS/Messages.json',
				{
				    params:{From:'+14014415503', To:'+14014394754', Body: 'ZOMG'},
					auth: 'AC504dcad90a9b4647b890e9b1f71025ba:c2ba241dca61e7c363703f9c393f8099',
					headers: {'content-type':'application/x-www-form-urlencoded'}
				}, function () {
				    console.log(arguments)
					}
				);
		  }
	      });

	  
	  //console.log(client);
	  
	  Deps.autorun(function() {
		  var redAlerts = Alerts.find({alertLevel:2,status:0}).fetch();
		  
		  if (redAlerts){
		      //alert("red alert!");
		  }
	      });
      });
		      
  




  
}

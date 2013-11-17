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
	  
	  var lastObject = ""
	  Alerts.insert({
	      alertLevel: Session.get("alertLevel"), 
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

}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

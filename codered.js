Alerts = new Meteor.Collection("alerts");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to codered.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });


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
	  Alerts.insert({
	      alertLevel: Session.get("alertLevel"), 
	      message: $("#message").val()
	  })
	  console.log($("#message").val());
      }
  });



  Template.main.alertLevel = function(){
      return Session.get("alertLevel");
  }


}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

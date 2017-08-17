// Defining a connection to the server hub.
whiteboardHub = $.connection.whiteboardHub;

// Setting logging to true so that we can see whats happening in the browser console log. [OPTIONAL]
$.connection.hub.logging = true;

$(function () {
    //// Start the hub
    window.hubReady = $.connection.hub.start();
});

// Client method to broadcast the message as user draw or erase sketch
whiteboardHub.client.broadcastSketch = function (message) {
    var parsedSketchData = JSON.parse(message);
    setDrawCordinates(parsedSketchData);
};

// Client method to broadcast clear canvas messsage
whiteboardHub.client.clearCanvas = function () {
    ctx.clearRect(0, 0, w, h);
};

whiteboardHub.client.chatJoined = function (name) {
    $("#divMessage").append("<span><i> <b>" + name + " joined. <br/></b></i></span>");
    $("#dialog-form").dialog("close");
}

whiteboardHub.client.broadcastChatMessage = function (name, message) {
    $("#divMessage").append("<span>" + name + ": " + message + "</span><br/>");
    var objDiv = document.getElementById("divMessage");
    objDiv.scrollTop = objDiv.scrollHeight;
};




$(document).bind("clearCanvas", function (e) {
    whiteboardHub.server.clearCanvas($("#userName").val(), $("#groupName").val());
});

$(document).bind("sendChatClicked", function (e) {
    if (e.message.length > 0) {
        whiteboardHub.server.publishChatMesssage(e.message, $("#userName").val(), $("#groupName").val());
        $("#txtMessage").val("");
    }
})

$(document).bind("JoinClicked", function (e) {
    var name = $("#name").val();
    var name = $.trim(name);

    if (name.length > 0) {
        $("#userName").val(name);
    }
    $.connection.hub.start().done(function () {
        // Call the server side function AFTER the connection has been started


        // whiteboardHub.server.drawSketchHistory(guestId); 
        whiteboardHub.server.joinGroup($("#groupName").val()).done(function () {
            whiteboardHub.server.joinChat($("#userName").val(), $("#groupName").val());
        });

        // Sending mouseEventCordinates to Server method
        $(document).bind("drawSketch", function (e) {
            whiteboardHub.server.publishDraw(e.message, $("#userName").val(), $("#groupName").val());
        });

    })
});


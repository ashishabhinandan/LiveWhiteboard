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

whiteboardHub.client.broadcastUndoCanvas = function (message) {
    var parsedUndoSketches = JSON.parse(message);
    if (parsedUndoSketches.length > 0) {
        parsedUndoSketches.forEach(function (item) { setDrawCordinates(item); })
    } else {
        alert("Either there is nothing to Undo or undo limit crossed !!!");
    }
    resetCanvasPen();
};

$(document).bind("clearCanvas", function (e) {
    whiteboardHub.server.clearCanvas($("#userName").val(), $("#groupName").val());
});

$(document).bind("undoSketch", function (e) {
    whiteboardHub.server.undoCanvasSketch($("#userName").val(), $("#groupName").val());
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
        remvoeErrorMsg();
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

var tryingToReconnect = false;

$.connection.hub.reconnecting(function () {
    tryingToReconnect = true;
});

$.connection.hub.reconnected(function () {
    tryingToReconnect = false;
});

$.connection.hub.disconnected(function () {
    if (tryingToReconnect) {
        notifyError("hub disconnected !! trying to reconnect ...");
        $.connection.hub.start();
    }
});

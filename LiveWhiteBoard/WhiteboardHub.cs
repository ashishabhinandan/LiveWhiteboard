using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using LiveWhiteBoard.Models;

namespace LiveWhiteBoard
{
    public class WhiteboardHub : Hub
    {
        public void JoinGroup(string groupName)
        {
            Groups.Add(Context.ConnectionId, groupName);
        }
        public void JoinChat(string name, string groupName)
        {
            Clients.Group(groupName).ChatJoined(name);
        }

        public void PublishChatMesssage(string message, string name, string groupName)
        {
            Clients.Group(groupName).broadcastChatMessage(name, message);
        }

        public void PublishDraw(SketchMetaData linecordinates, string name, string groupName)
        {
            var returnData = JsonConvert.SerializeObject(linecordinates);
            Clients.Group(groupName).broadcastSketch(returnData);
        }

        public void ClearCanvas(string name, string groupName)
        {
            Clients.Group(groupName).clearCanvas();
        }


    }
}
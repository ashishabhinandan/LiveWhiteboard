using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using LiveWhiteBoard.Models;
using System.Configuration;

namespace LiveWhiteBoard
{
    public class WhiteboardHub : Hub
    {
        private static Dictionary<string, DrawSketchCommand> _groupWiseSketchCommand = new Dictionary<string, DrawSketchCommand>();
        int capacity = Convert.ToInt32(ConfigurationManager.AppSettings["RollOutstackCapacity"]);
        public void JoinGroup(string groupName)
        {
            try
            {
                if (!_groupWiseSketchCommand.ContainsKey(groupName))
                {
                    _groupWiseSketchCommand.Add(groupName, new DrawSketchCommand(new DropOutStack<SketchMetaData>(capacity)));
                }
                Groups.Add(Context.ConnectionId, groupName);
            }
            catch (Exception ee)
            {
                Console.WriteLine(ee.Message);
            }
        }
        public void JoinChat(string name, string groupName)
        {
            Clients.Group(groupName).chatJoined(name);
        }

        public void PublishChatMesssage(string message, string name, string groupName)
        {
            Clients.Group(groupName).broadcastChatMessage(name, message);
        }

        public void PublishDraw(SketchMetaData linecordinates, string name, string groupName)
        {
            try
            {
                if (_groupWiseSketchCommand.ContainsKey(groupName))
                {
                    _groupWiseSketchCommand[groupName].sketch = linecordinates;
                    _groupWiseSketchCommand[groupName].Do();
                }

                var returnData = JsonConvert.SerializeObject(linecordinates);
                Clients.Group(groupName).broadcastSketch(returnData);
            }
            catch (Exception ee)
            {
                Console.WriteLine(ee.Message);
            }
        }

        public void ClearCanvas(string name, string groupName)
        {
            Clients.Group(groupName).clearCanvas();
        }

        public void UndoCanvasSketch(string name, string groupName)
        {
            try
            {
                if (_groupWiseSketchCommand.ContainsKey(groupName))
                {
                    var returnData = JsonConvert.SerializeObject(_groupWiseSketchCommand[groupName].UnDo());
                    Clients.Group(groupName).broadcastUndoCanvas(returnData);
                }
            }
            catch (Exception ee)
            {
                Console.WriteLine(ee.Message);
            }
        }

    }
}

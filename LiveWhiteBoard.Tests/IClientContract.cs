using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveWhiteBoard.Tests
{
    public interface IClientContract
    {
        void chatJoined(string name);
        void broadcastChatMessage(string name, string message);
        void broadcastSketch(string sketchData);
        void clearCanvas();
        void broadcastUndoCanvas(string listSketchData);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LiveWhiteBoard.Models;
using System.Collections;

namespace LiveWhiteBoard
{
    public class DrawSketchCommand:ICommand
    {
        private DropOutStack<SketchMetaData> _stackSketchHistory;
        public SketchMetaData sketch { get; set; }

        //Constructor
        public DrawSketchCommand(DropOutStack<SketchMetaData> dropOutSketch)
        {
            _stackSketchHistory = dropOutSketch;
        } 

        public void Do()
        {
            _stackSketchHistory.Push(sketch);
        }

        public IList UnDo()
        {
            DrawState currSketchDrawState;
            IList<SketchMetaData> undoList = new List<SketchMetaData>();
            try
            {
                do
                {
                    SketchMetaData popedSketch = _stackSketchHistory.Pop();
                    if (popedSketch != null)
                    {
                        currSketchDrawState = popedSketch.DrawState;
                        popedSketch.Color = "white";
                        //change down to move for erasing purpose
                        popedSketch.DrawState = popedSketch.DrawState == DrawState.down ? DrawState.move : popedSketch.DrawState;
                        popedSketch.Width++;
                        undoList.Add(popedSketch);
                    }
                    else
                    {
                        break;
                    }

                } while (currSketchDrawState != DrawState.down);
            }
            catch(Exception ee)
            {
                throw ee;
            }
            return undoList.ToList();
        }
    }
}
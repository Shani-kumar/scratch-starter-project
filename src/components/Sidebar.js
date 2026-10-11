import React from "react";
import Icon from "./Icon";

export default function Sidebar({ removeBlockFromMidArea }) {
  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData("blockType", blockType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const removeIndex = e.dataTransfer.getData("removeIndex");
    if (removeIndex) {
      removeBlockFromMidArea(parseInt(removeIndex, 10));
    }
  };

  return (
    <div
      className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >

      <div className="font-bold"> {"Motion"} </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "MOTION_MOVE")}
      >
        {"Move "} <div className="bg-white text-black w-8 mx-2 text-center rounded">10</div> {" steps"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "MOTION_TURN_LEFT")}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        <div className="bg-white text-black w-8 mx-2 text-center rounded">15</div>
        {" degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "MOTION_GOTO")}
      >
        {"Go to x: "} <div className="bg-white text-black w-8 mx-2 text-center rounded">0</div> {" y: "} <div className="bg-white text-black w-8 mx-2 text-center rounded">0</div>
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "MOTION_TURN_RIGHT")}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        <div className="bg-white text-black w-8 mx-2 text-center rounded">15</div>
        {" degrees"}
      </div>
      <div className="font-bold mt-4"> {"Controls"} </div>
      <div
        className="flex flex-row flex-wrap text-white px-2 py-1 my-2 text-sm cursor-pointer rounded"
        style={{ backgroundColor: "#ffab19" }}
        draggable
        onDragStart={(e) => handleDragStart(e, "MOTION_REPEAT")}
      >
        {"Repeat Animation"}
      </div>

      <div className="font-bold mt-4"> {"Looks"} </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "LOOKS_SAY")}
      >
        {"Say "} <div className="bg-white text-black px-1 mx-2 text-center rounded">Hello!</div> {" for "} <div className="bg-white text-black w-6 mx-2 text-center rounded">2</div> {" seconds"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer items-center rounded"
        draggable
        onDragStart={(e) => handleDragStart(e, "LOOKS_THINK")}
      >
        {"Think "} <div className="bg-white text-black px-1 mx-2 text-center rounded">Hmm...</div> {" for "} <div className="bg-white text-black w-6 mx-2 text-center rounded">2</div> {" seconds"}
      </div>
    </div>
  );
}

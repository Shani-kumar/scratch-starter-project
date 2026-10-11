import React from "react";
import Icon from "./Icon";

export default function MidArea({ midAreaBlocks, addBlockToMidArea, updateBlockInMidArea }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType");
    if (blockType) {
      addBlockToMidArea(blockType);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("removeIndex", index);
  };

  const handleNumberChange = (index, block, field, val) => {
    if (val === "" || val === "-") {
      updateBlockInMidArea(index, { ...block, [field]: val });
    } else {
      const parsed = parseInt(val, 10);
      updateBlockInMidArea(index, { ...block, [field]: isNaN(parsed) ? "" : parsed });
    }
  };

  const handleNumberBlur = (index, block, field, fallback = 0) => {
    if (block[field] === "" || block[field] === "-") {
      updateBlockInMidArea(index, { ...block, [field]: fallback });
    }
  };

  const renderBlock = (block, index) => {
    switch (block.type) {

      case "MOTION_MOVE":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Move "}
            <input
              type="number"
              className="text-black w-16 mx-2 px-1 text-center rounded outline-none"
              value={block.steps}
              onChange={(e) => handleNumberChange(index, block, "steps", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "steps", 10)}
            />
            {" steps"}
          </div>
        );
      case "MOTION_TURN_LEFT":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Turn "}
            <Icon name="undo" size={15} className="text-white mx-2" />
            <input
              type="number"
              className="text-black w-16 mx-2 px-1 text-center rounded outline-none"
              value={block.degrees}
              onChange={(e) => handleNumberChange(index, block, "degrees", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "degrees", 15)}
            />
            {" degrees"}
          </div>
        );
      case "MOTION_GOTO":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Go to x: "}
            <input
              type="number"
              className="text-black w-14 mx-2 px-1 text-center rounded outline-none"
              value={block.x}
              onChange={(e) => handleNumberChange(index, block, "x", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "x", 0)}
            />
            {" y: "}
            <input
              type="number"
              className="text-black w-14 mx-2 px-1 text-center rounded outline-none"
              value={block.y}
              onChange={(e) => handleNumberChange(index, block, "y", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "y", 0)}
            />
          </div>
        );
      case "MOTION_TURN_RIGHT":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Turn "}
            <Icon name="redo" size={15} className="text-white mx-2" />
            <input
              type="number"
              className="text-black w-16 mx-2 px-1 text-center rounded outline-none"
              value={block.degrees}
              onChange={(e) => handleNumberChange(index, block, "degrees", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "degrees", 15)}
            />
            {" degrees"}
          </div>
        );
      case "MOTION_REPEAT":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap text-white px-2 py-1 mb-1 text-sm cursor-pointer rounded" style={{ backgroundColor: "#ffab19" }}>
            {"Repeat Animation"}
          </div>
        );
      case "LOOKS_SAY":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Say "}
            <input type="text" className="text-black w-24 mx-2 px-1 text-center rounded outline-none" value={block.message} onChange={(e) => updateBlockInMidArea(index, { ...block, message: e.target.value })} />
            {" for "}
            <input
              type="number"
              className="text-black w-12 mx-2 px-1 text-center rounded outline-none"
              value={block.duration}
              onChange={(e) => handleNumberChange(index, block, "duration", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "duration", 2)}
            />
            {" seconds"}
          </div>
        );
      case "LOOKS_THINK":
        return (
          <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 mb-1 text-sm cursor-pointer items-center rounded">
            {"Think "}
            <input type="text" className="text-black w-24 mx-2 px-1 text-center rounded outline-none" value={block.message} onChange={(e) => updateBlockInMidArea(index, { ...block, message: e.target.value })} />
            {" for "}
            <input
              type="number"
              className="text-black w-12 mx-2 px-1 text-center rounded outline-none"
              value={block.duration}
              onChange={(e) => handleNumberChange(index, block, "duration", e.target.value)}
              onBlur={() => handleNumberBlur(index, block, "duration", 2)}
            />
            {" seconds"}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex-1 h-full overflow-auto p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`w-full min-h-[300px] border-2 border-dashed border-gray-300 py-8 px-4 rounded flex flex-col ${midAreaBlocks.length === 0 ? 'items-center justify-center' : ''}`}>
        {midAreaBlocks.length === 0 ? (
          <div className="text-gray-400 font-medium">
            {"Drag and drop actions here"}
          </div>
        ) : (
          midAreaBlocks.map((block, index) => renderBlock(block, index))
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Icon from "./Icon";

export default function MidArea({ 
  activeSprite, 
  midAreaBlocks = [], 
  addBlockToMidArea, 
  updateBlockInMidArea, 
  reorderBlocksInMidArea 
}) {
  const [dropIndicator, setDropIndicator] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropIndicator(null);
    const sourceIndexStr = e.dataTransfer.getData("midAreaIndex");
    if (sourceIndexStr !== "") {
      const sourceIndex = parseInt(sourceIndexStr, 10);
      if (!isNaN(sourceIndex) && reorderBlocksInMidArea) {
        reorderBlocksInMidArea(sourceIndex, midAreaBlocks.length);
      }
      return;
    }
    const blockType = e.dataTransfer.getData("blockType");
    if (blockType) {
      addBlockToMidArea(blockType);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("removeIndex", index);
    e.dataTransfer.setData("midAreaIndex", index);
  };

  const handleItemDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isBottom = (e.clientY - rect.top) > (rect.height / 2);
    const position = isBottom ? "bottom" : "top";
    if (!dropIndicator || dropIndicator.index !== index || dropIndicator.position !== position) {
      setDropIndicator({ index, position });
    }
  };

  const handleItemDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const position = dropIndicator ? dropIndicator.position : "top";
    setDropIndicator(null);

    const sourceIndexStr = e.dataTransfer.getData("midAreaIndex");
    if (sourceIndexStr !== "") {
      const fromIndex = parseInt(sourceIndexStr, 10);
      if (!isNaN(fromIndex) && reorderBlocksInMidArea) {
        const targetPosition = position === "bottom" ? targetIndex + 1 : targetIndex;
        reorderBlocksInMidArea(fromIndex, targetPosition);
      }
      return;
    }

    const blockType = e.dataTransfer.getData("blockType");
    if (blockType) {
      const targetPosition = position === "bottom" ? targetIndex + 1 : targetIndex;
      addBlockToMidArea(blockType, targetPosition);
    }
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
      className="flex-1 h-full overflow-auto p-4 flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Sprite:</span>
          <span className="font-bold text-sm text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            {activeSprite ? (activeSprite.name || activeSprite.type) : "None (Add/Select a Sprite)"}
          </span>
        </div>
        <span className="text-xs text-gray-400 italic">
          Drag blocks to reorder
        </span>
      </div>

      <div className={`w-full flex-1 min-h-[300px] border-2 border-dashed border-gray-300 py-6 px-4 rounded flex flex-col ${midAreaBlocks.length === 0 ? 'items-center justify-center' : ''}`}>
        {midAreaBlocks.length === 0 ? (
          <div className="text-gray-400 font-medium">
            {"Drag and drop actions here"}
          </div>
        ) : (
          midAreaBlocks.map((block, index) => (
            <div
              key={index}
              onDragOver={(e) => handleItemDragOver(e, index)}
              onDragLeave={() => setDropIndicator(null)}
              onDrop={(e) => handleItemDrop(e, index)}
              className={`relative transition-all duration-150 ${
                dropIndicator?.index === index && dropIndicator?.position === "top"
                  ? "border-t-4 border-yellow-400 pt-1"
                  : dropIndicator?.index === index && dropIndicator?.position === "bottom"
                  ? "border-b-4 border-yellow-400 pb-1"
                  : ""
              }`}
            >
              {renderBlock(block, index)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from "react";
import CatSprite from "./CatSprite";
import BeetleSprite from "./BeetleSprite";
import DogSprite from "./DogSprite";
import RobotSprite from "./RobotSprite";

export default function PreviewArea({ sprites = [], updateSpritePosition }) {
  const getSpriteComponent = (type) => {
    switch (type) {
      case "beetle": return <BeetleSprite />;
      case "dog": return <DogSprite />;
      case "robot": return <RobotSprite />;
      case "cat":
      default: return <CatSprite />;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const spriteId = e.dataTransfer.getData("spriteId");
    if (!spriteId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = parseFloat(e.dataTransfer.getData("offsetX") || 0);
    const offsetY = parseFloat(e.dataTransfer.getData("offsetY") || 0);

    const newX = (e.clientX - rect.left) - centerX - offsetX;
    const newY = (e.clientY - rect.top) - centerY - offsetY;

    if (updateSpritePosition) {
      updateSpritePosition(spriteId, newX, newY);
    }
  };

  const handleDragStart = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - (rect.width / 2);
    const offsetY = e.clientY - rect.top - (rect.height / 2);
    e.dataTransfer.setData("spriteId", id);
    e.dataTransfer.setData("offsetX", offsetX);
    e.dataTransfer.setData("offsetY", offsetY);
  };

  return (
    <div
      className="flex-none h-full overflow-y-auto p-2 relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {sprites.map(spriteState => (
        <div
          key={spriteState.id}
          draggable
          onDragStart={(e) => handleDragStart(e, spriteState.id)}
          className="cursor-move"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(calc(-50% + ${spriteState.x}px), calc(-50% + ${spriteState.y}px)) rotate(${spriteState.angle}deg)`,
            transition: "transform 0.3s ease",
            transformOrigin: "center center"
          }}
        >
          {spriteState.message && (
            <div
              className="absolute left-1/2 z-20 pointer-events-none"
              style={{
                bottom: "calc(100% + 26px)",
                transform: `translateX(-50%) rotate(${-spriteState.angle}deg)`,
                transformOrigin: "bottom center"
              }}
            >
              {spriteState.messageType === "think" ? (
                <div className="relative bg-white border-2 border-gray-400 rounded-2xl px-4 py-1.5 text-sm shadow-md whitespace-nowrap text-center">
                  <span className="italic text-gray-700">{spriteState.message}</span>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 mt-1">
                    <div className="w-2.5 h-2.5 bg-white border border-gray-400 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white border border-gray-400 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="relative bg-white border-2 border-gray-400 rounded-xl px-3.5 py-1 text-sm shadow-md whitespace-nowrap text-center">
                  <span className="font-semibold text-gray-900">{spriteState.message}</span>
                </div>
              )}
            </div>
          )}
          {getSpriteComponent(spriteState.type)}
        </div>
      ))}
    </div>
  );
}

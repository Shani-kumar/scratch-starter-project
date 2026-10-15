import React, { useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import CatSprite from "./components/CatSprite";
import DogSprite from "./components/DogSprite";
import RobotSprite from "./components/RobotSprite";
import BeetleSprite from "./components/BeetleSprite";

export default function App() {
  const [sprites, setSprites] = useState([
    { id: "sprite-1", type: "cat", name: "Cat", x: 0, y: 0, angle: 0, message: "", messageType: "", blocks: [] }
  ]);
  const [activeSpriteId, setActiveSpriteId] = useState("sprite-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spriteToDelete, setSpriteToDelete] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const activeSprite = sprites.find(s => s.id === activeSpriteId);

  const addBlockToMidArea = (blockType, insertIndex = null) => {
    let newBlock;
    switch (blockType) {
      case "MOTION_MOVE": newBlock = { type: blockType, steps: 10 }; break;
      case "MOTION_TURN_RIGHT": newBlock = { type: blockType, degrees: 15 }; break;
      case "MOTION_TURN_LEFT": newBlock = { type: blockType, degrees: 15 }; break;
      case "MOTION_GOTO": newBlock = { type: blockType, x: 0, y: 0 }; break;
      case "LOOKS_SAY": newBlock = { type: blockType, message: "Hello!", duration: 2 }; break;
      case "LOOKS_THINK": newBlock = { type: blockType, message: "Hmm...", duration: 2 }; break;
      case "MOTION_REPEAT": newBlock = { type: blockType }; break;
      default: return;
    }

    setSprites(prevSprites => prevSprites.map(s => {
      if (s.id === activeSpriteId) {
        const newBlocks = [...s.blocks];
        if (insertIndex !== null && insertIndex >= 0) {
          newBlocks.splice(insertIndex, 0, newBlock);
        } else {
          newBlocks.push(newBlock);
        }
        return { ...s, blocks: newBlocks };
      }
      return s;
    }));
  };

  const reorderBlocksInMidArea = (fromIndex, targetPosition) => {
    setSprites(prevSprites => prevSprites.map(s => {
      if (s.id === activeSpriteId) {
        const newBlocks = [...s.blocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        const finalIndex = fromIndex < targetPosition ? targetPosition - 1 : targetPosition;
        newBlocks.splice(finalIndex, 0, moved);
        return { ...s, blocks: newBlocks };
      }
      return s;
    }));
  };

  const updateBlockInMidArea = (index, updatedBlock) => {
    setSprites(sprites.map(s => {
      if (s.id === activeSpriteId) {
        const newBlocks = [...s.blocks];
        newBlocks[index] = updatedBlock;
        return { ...s, blocks: newBlocks };
      }
      return s;
    }));
  };

  const removeBlockFromMidArea = (index) => {
    setSprites(sprites.map(s => {
      if (s.id === activeSpriteId) {
        const newBlocks = [...s.blocks];
        newBlocks.splice(index, 1);
        return { ...s, blocks: newBlocks };
      }
      return s;
    }));
  };

  const getNextSpriteName = (type, currentSprites) => {
    const baseName = type.charAt(0).toUpperCase() + type.slice(1);
    const names = currentSprites.map(s => s.name || (s.type.charAt(0).toUpperCase() + s.type.slice(1)));
    if (!names.includes(baseName)) {
      return baseName;
    }
    let counter = 2;
    while (names.includes(`${baseName}${counter}`)) {
      counter++;
    }
    return `${baseName}${counter}`;
  };

  const addSprite = (type) => {
    stopAll();
    const newId = `sprite-${Date.now()}`;
    const name = getNextSpriteName(type, sprites);
    setSprites([...sprites, {
      id: newId,
      type: type,
      name: name,
      x: sprites.length * 50,
      y: 0,
      angle: 0,
      message: "",
      messageType: "",
      blocks: []
    }]);
    setActiveSpriteId(newId);
    setIsModalOpen(false);
  };

  const requestDeleteSprite = (e, sprite) => {
    e.stopPropagation();
    setSpriteToDelete(sprite);
  };

  const confirmDeleteSprite = () => {
    if (!spriteToDelete) return;
    const remaining = sprites.filter(s => s.id !== spriteToDelete.id);
    setSprites(remaining);
    if (activeSpriteId === spriteToDelete.id) {
      setActiveSpriteId(remaining.length > 0 ? remaining[0].id : null);
    }
    setSpriteToDelete(null);
  };

  const cancelDeleteSprite = () => {
    setSpriteToDelete(null);
  };

  const getSpriteComponent = (type) => {
    switch (type) {
      case "beetle": return <BeetleSprite />;
      case "dog": return <DogSprite />;
      case "robot": return <RobotSprite />;
      case "cat":
      default: return <CatSprite />;
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const stopAll = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const runAllBlocks = async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);

    let execSprites = JSON.parse(JSON.stringify(sprites));
    let stateMachine = execSprites.map(() => ({ ip: 0, waitTicks: 0, cooldown: 0 }));

    while (isPlayingRef.current) {
      let anyActive = false;

      for (let sm of stateMachine) {
        if (sm.cooldown > 0) sm.cooldown--;
      }

      for (let i = 0; i < execSprites.length; i++) {
        for (let j = i + 1; j < execSprites.length; j++) {
          const s1 = execSprites[i];
          const s2 = execSprites[j];
          const dist = Math.sqrt(Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2));

          if (dist < 80 && stateMachine[i].cooldown === 0 && stateMachine[j].cooldown === 0) {
            const s1Remaining = s1.blocks.slice(stateMachine[i].ip);
            const s2Remaining = s2.blocks.slice(stateMachine[j].ip);

            s1.blocks = [...s1.blocks.slice(0, stateMachine[i].ip), ...s2Remaining];
            s2.blocks = [...s2.blocks.slice(0, stateMachine[j].ip), ...s1Remaining];

            stateMachine[i].cooldown = 5;
            stateMachine[j].cooldown = 5;
          }
        }
      }

      for (let i = 0; i < execSprites.length; i++) {
        const sprite = execSprites[i];
        const sm = stateMachine[i];

        if (sm.waitTicks > 0) {
          sm.waitTicks--;
          anyActive = true;
          if (sm.waitTicks === 0) {
            sprite.message = "";
            sprite.messageType = "";
          }
          continue;
        }

        if (sm.ip < sprite.blocks.length) {
          anyActive = true;
          const block = sprite.blocks[sm.ip];

          if (block.type === "MOTION_MOVE") {
            const steps = Number(block.steps) || 0;
            sprite.x += steps * Math.cos(sprite.angle * Math.PI / 180);
            sprite.y += steps * Math.sin(sprite.angle * Math.PI / 180);
          } else if (block.type === "MOTION_TURN_RIGHT") {
            sprite.angle += Number(block.degrees) || 0;
          } else if (block.type === "MOTION_TURN_LEFT") {
            sprite.angle -= Number(block.degrees) || 0;
          } else if (block.type === "MOTION_GOTO") {
            sprite.x = Number(block.x) || 0;
            sprite.y = Number(block.y) || 0;
          } else if (block.type === "MOTION_REPEAT") {
            sm.ip = -1;
          } else if (block.type === "LOOKS_SAY") {
            sprite.message = block.message;
            sprite.messageType = "say";
            sm.waitTicks = Math.round(((Number(block.duration) || 0) * 1000) / 300);
          } else if (block.type === "LOOKS_THINK") {
            sprite.message = block.message;
            sprite.messageType = "think";
            sm.waitTicks = Math.round(((Number(block.duration) || 0) * 1000) / 300);
          }

          sm.ip++;
        }
      }

      setSprites([...execSprites]);

      if (!anyActive) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        break;
      }

      await sleep(300);
    }
    setIsPlaying(false);
  };

  const updateSpritePosition = (id, x, y) => {
    setSprites(sprites.map(s => s.id === id ? { ...s, x, y } : s));
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar removeBlockFromMidArea={removeBlockFromMidArea} />
          <MidArea 
            activeSprite={activeSprite}
            midAreaBlocks={activeSprite ? activeSprite.blocks : []} 
            addBlockToMidArea={addBlockToMidArea} 
            updateBlockInMidArea={updateBlockInMidArea}
            reorderBlocksInMidArea={reorderBlocksInMidArea}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <div className="p-2 border-b border-gray-200 flex justify-between items-center">
            <button
              onClick={() => {
                stopAll();
                setIsModalOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              + Add Sprite
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={stopAll}
                disabled={!isPlaying}
                className={`font-bold py-1 px-4 rounded text-sm transition-all ${
                  isPlaying 
                    ? "bg-red-500 hover:bg-red-600 text-white shadow cursor-pointer" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Stop
              </button>
              <button
                type="button"
                onClick={runAllBlocks}
                disabled={isPlaying}
                className={`font-bold py-1 px-4 rounded text-sm transition-all ${
                  isPlaying 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-green-500 hover:bg-green-600 text-white shadow cursor-pointer"
                }`}
              >
                {isPlaying ? "Playing..." : "Play"}
              </button>
            </div>
          </div>
          <div className="flex-1 relative border-b border-gray-200">
            <PreviewArea 
              sprites={sprites} 
              setActiveSpriteId={setActiveSpriteId}
              updateSpritePosition={updateSpritePosition} 
            />
          </div>
          <div className="h-1/4 p-2 overflow-y-auto bg-gray-50">
            <h3 className="font-bold mb-2 text-sm text-gray-600">Sprites</h3>
            <div className="flex flex-wrap gap-2">
              {sprites.map(s => (
                <div
                  key={s.id}
                  onClick={() => setActiveSpriteId(s.id)}
                  className={`cursor-pointer flex items-center space-x-2 py-1.5 px-2.5 border-2 rounded-lg font-semibold text-sm select-none transition-colors ${activeSpriteId === s.id ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  <div
                    style={{ width: 28, height: 28 }}
                    className="flex items-center justify-center overflow-hidden shrink-0 pointer-events-none bg-gray-50 rounded border border-gray-100"
                  >
                    <div
                      style={{ transform: "scale(0.28)", transformOrigin: "center center" }}
                      className="flex items-center justify-center shrink-0"
                    >
                      {getSpriteComponent(s.type)}
                    </div>
                  </div>
                  <span>{s.name || (s.type.charAt(0).toUpperCase() + s.type.slice(1))}</span>
                  <button
                    type="button"
                    title={`Delete ${s.name || s.type}`}
                    onClick={(e) => requestDeleteSprite(e, s)}
                    className="ml-2 w-4 h-4 rounded-full bg-gray-200 hover:bg-red-500 text-gray-500 hover:text-white flex items-center justify-center text-xs font-bold transition-colors leading-none shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {sprites.length === 0 && (
                <div className="text-gray-400 text-xs italic py-2">
                  No sprites. Click "+ Add Sprite" above to add one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[500px] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6">Choose a Sprite</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { type: "cat", Component: CatSprite, name: "Cat" },
                { type: "dog", Component: DogSprite, name: "Dog" },
                { type: "robot", Component: RobotSprite, name: "Robot" },
                { type: "beetle", Component: BeetleSprite, name: "Beetle" },
              ].map(spriteInfo => (
                <div
                  key={spriteInfo.type}
                  onClick={() => addSprite(spriteInfo.type)}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="w-16 h-16 flex items-center justify-center transform scale-75">
                    <spriteInfo.Component />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-gray-700">{spriteInfo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {spriteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              ✕
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Sprite?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {spriteToDelete.name || (spriteToDelete.type.charAt(0).toUpperCase() + spriteToDelete.type.slice(1))}
              </span>
              ?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                type="button"
                onClick={cancelDeleteSprite}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSprite}
                className="flex-1 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { createContext, useState } from "react";

export const GameContext = createContext();

const GameContextProvider = (props) => {
  const [playerDirection, setPlayerDirection] = useState(0);
  const [characterInfo, setCharacterInfo] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState({});
  const [logs, setLogs] = useState([]);

  const sendLog = (message, type = "event", sender = "Spice Rush") => {
    const allLogs = [...logs];
    allLogs.push({type, sender, message})
    setLogs(allLogs);
  }

  return (
    <GameContext.Provider
      value={{
        playerDirection,
        setPlayerDirection,
        characterInfo,
        setCharacterInfo,
        tiles,
        setTiles,
        selectedTile,
        setSelectedTile,
        logs,
        sendLog
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;

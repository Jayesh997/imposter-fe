import React from 'react';

const PlayerCard = ({ player, gameState, isVoting, selectedVote, handleVote }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
      <div className="text-lg font-bold mb-2">{player.name}</div>
      <div className="text-lg font-bold mb-2">Score: {player.score}</div>
      <div className="mb-2">
        <img src={`https://robohash.org/${player.id}`} alt="icon" className="w-20 h-20 mx-auto mb-2" />
      </div>
      <div className="mb-2">
        Clue: {player.word || 'Not submitted'}
      </div>
      <div className="mb-2">
        Voted: {gameState.players.find(p => p.id === player.vote)?.name || 'Not voted'}
      </div>
      {gameState.started && isVoting && !gameState.roundResult && (
        <div className="flex items-center justify-center mt-4">
          <input
            type="checkbox"
            id={`vote-${player.id}`}
            checked={selectedVote === player.id}
            onChange={() => handleVote(player.id)}
            className="mr-2"
          />
          <label htmlFor={`vote-${player.id}`} className="ml-2">Vote</label>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;

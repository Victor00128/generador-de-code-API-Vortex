import React, { useState } from 'react';
import { type ApiKey } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { CopyIcon, CheckIcon, TrashIcon, ClockIcon, PencilIcon, SaveIcon } from './icons/Icons';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
  onCopy: () => void;
  onUpdate: (updatedKey: ApiKey) => void;
}

export const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ apiKey, onDelete, onCopy, onUpdate }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(apiKey.name || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setIsCopied(true);
    onCopy();
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleSaveName = () => {
    onUpdate({ ...apiKey, name: editedName });
    setIsEditingName(false);
  };

  const timeRemaining = useCountdown(apiKey.expirationDate, () => {
    // Automatically delete the key when the countdown finishes
    onDelete(apiKey.id);
  });

  const isExpired = timeRemaining === 'Expired';
  const isExpiringSoon = timeRemaining.includes('days') ? parseInt(timeRemaining.split(' ')[0]) <= 3 : true;

  const timerColor = isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-500' : 'text-gray-400';

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-lg p-5 flex flex-col gap-4 shadow-lg transition-all hover:border-red-500/50 hover:shadow-red-500/10">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-gray-800 text-gray-200 text-lg font-bold rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  }
                }}
              />
              <button
                onClick={handleSaveName}
                className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                aria-label="Save name"
              >
                <SaveIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg text-gray-200">{apiKey.name || 'API Key'}</h4>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors"
                aria-label="Edit name"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500">ID: {apiKey.id.split('-')[0]}</p>
        </div>
        <button
          onClick={() => onDelete(apiKey.id)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
          aria-label="Delete key"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 bg-black/50 p-3 rounded-md">
        <span className="font-mono text-sm text-gray-300 flex-grow truncate">{apiKey.key}</span>
        <button
          onClick={handleCopy}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
          aria-label="Copy key"
        >
          {isCopied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <ClockIcon className={`h-5 w-5 ${timerColor}`} />
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm text-gray-400">Expires in:</span>
          <span className={`font-mono font-medium ${timerColor}`}>{timeRemaining}</span>
        </div>
      </div>
    </div>
  );
};
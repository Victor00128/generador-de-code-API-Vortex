import React from 'react';
import { ShieldCheckIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-center sm:justify-start py-4">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          API Key Manager
        </h1>
      </div>
    </header>
  );
};
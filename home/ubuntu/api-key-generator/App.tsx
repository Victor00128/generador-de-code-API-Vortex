import React, { useState, useEffect, useCallback } from 'react';
import { type ApiKey, type NotificationMessage } from './types';
import { ApiService } from './services/apiService';
import { Header } from './components/Header';
import { ApiKeyCard } from './components/ApiKeyCard';
import { Notification } from './components/Notification';
import { KeyIcon, ExclamationTriangleIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [config, setConfig] = useState({ maxKeys: 2, expirationDays: 15 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [keysData, configData] = await Promise.all([
        ApiService.getKeys(),
        ApiService.getConfig()
      ]);
      setKeys(keysData);
      setConfig(configData);
    } catch (error) {
      console.error("Failed to load initial data", error);
      showNotification('Error loading data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleGenerateKey = useCallback(async () => {
    if (keys.length >= config.maxKeys) {
      showNotification(`API limit reached. You can only have ${config.maxKeys} active keys.`, 'error');
      return;
    }

    try {
      const newKey = await ApiService.createKey(`API Key ${keys.length + 1}`);
      setKeys(prevKeys => [...prevKeys, newKey]);
      showNotification('New API Key generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate API key';
      showNotification(errorMessage, 'error');
    }
  }, [keys.length, config.maxKeys]);

  const handleDeleteKey = useCallback(async (id: string) => {
    try {
      await ApiService.deleteKey(id);
      setKeys(prevKeys => prevKeys.filter(key => key.id !== id));
      showNotification('API Key revoked.', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete API key';
      showNotification(errorMessage, 'error');
    }
  }, []);

  const handleCopyKey = () => {
    showNotification('API Key copied to clipboard!');
  };

  const handleUpdateKey = useCallback(async (updatedKey: ApiKey) => {
    try {
      const serverUpdatedKey = await ApiService.updateKey(updatedKey.id, updatedKey.name);
      setKeys(prevKeys => prevKeys.map(key => (key.id === updatedKey.id ? serverUpdatedKey : key)));
      showNotification("API Key updated successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update API key';
      showNotification(errorMessage, 'error');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen font-sans text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Notification notification={notification} />
      <Header />
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full p-8 bg-black/50 border border-red-500/30 rounded-2xl shadow-2xl backdrop-blur-sm mt-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-500">Your Secure API Keys</h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Generate a new API key for your project. Each key is valid for {config.expirationDays} days.
            You can have up to {config.maxKeys} active keys at a time.
          </p>
          <button
            onClick={handleGenerateKey}
            disabled={keys.length >= config.maxKeys}
            className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-500 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-2"
          >
            <KeyIcon />
            Generate New API Key
          </button>
        </div>

        <div className="w-full mt-12">
          <h3 className="text-xl font-semibold text-gray-300 mb-6">Active Keys ({keys.length}/{config.maxKeys})</h3>
          {keys.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {keys.map(apiKey => (
                <ApiKeyCard 
                  key={apiKey.id} 
                  apiKey={apiKey} 
                  onDelete={handleDeleteKey} 
                  onCopy={handleCopyKey} 
                  onUpdate={handleUpdateKey}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl">
                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mb-4" />
                <h4 className="text-lg font-semibold text-gray-300">No Active API Keys</h4>
                <p className="text-gray-500 mt-2">Click the "Generate New API Key" button to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
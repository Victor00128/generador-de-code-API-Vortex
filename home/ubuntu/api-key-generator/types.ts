
export interface ApiKey {
  id: string;
  key: string;
  expirationDate: number; // Stored as a UTC timestamp (Date.now())
  name?: string; // Optional name or description for the API key
}

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error';
}

import {useEffect, useRef, useState} from 'react';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

export const useSignalR = (url: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const connectToSignalR = async () => {
      const newConnection = new HubConnectionBuilder().withUrl(url).build();
      try {
        await newConnection.start();
        console.log('Đã kết nối');
        setConnection(newConnection);
        connectionRef.current = newConnection;
      } catch (error) {
        console.error('Kết nối thất bại', error);
      }
    };

    connectToSignalR();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        console.log('Đã ngắt kết nối');
      }
    };
  }, [url]);

  return connection;
};

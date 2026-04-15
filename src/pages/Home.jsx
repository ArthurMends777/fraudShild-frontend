import { useEffect } from 'react';
import { api } from '../services/api';

export function Home() {
//   useEffect(() => {
//     api.get('/health').then(res => console.log(res.data));
//   }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">FraudShield</h1>
    </div>
  );
}
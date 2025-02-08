import React, { useState } from 'react';
import CreateTicket from './components/CreateTicket';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard'); // default to dashboard view

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 text-white py-4">
        <h1 className="text-3xl font-bold text-center">
          Ticketing System
        </h1>
      </header>
      
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-2">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`px-3 py-2 rounded-md ${
                activeMenu === 'dashboard' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveMenu('create')}
              className={`px-3 py-2 rounded-md ${
                activeMenu === 'create' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create New Ticket
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        {activeMenu === 'create' ? (
          <CreateTicket />
        ) : (
          <div className="text-center text-gray-600">
            Welcome to the Dashboard
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
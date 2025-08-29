import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import './App.css';
import Chat from './components/chat';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
     useEffect(() =>{
       document.body.classList.toggle('dark', darkMode);
       }, [darkMode]);
       


  return (
 <>
 <Header />
 <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '8px',
          background: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
        }}
      >
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
      <Chat />
 </>
  );
}

export default App;

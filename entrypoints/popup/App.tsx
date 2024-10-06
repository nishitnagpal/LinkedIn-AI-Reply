import { useState } from 'react';
//import reactLogo from '@/assets/react.svg';
//import wxtLogo from '/wxt.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="p-4">
        <h1 className="text-lg font-bold">LinkedIn Reply Assistant</h1>
        <p>Focus on a LinkedIn message input field to see the AI icon.</p>
      </div>
    </>
  );
}

export default App;

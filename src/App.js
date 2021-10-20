import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
const { ipcRenderer } = window.require('electron')

const App = () => {
  const [clickTime, setClickTime] = useState(0);
  const [echo, setEcho] = useState('');
  const sendMsg = useCallback(() => {
    ipcRenderer.send('asynchronous-message', clickTime)
  }, [clickTime]);

  useEffect(() => {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log('renderer:', arg)
      setClickTime((clickTime) => clickTime += 1)
      setEcho(arg)
    })
    ipcRenderer.invoke('handle-message').then((res) => {
      console.log('handle-message:', res)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={sendMsg}>
          click to send Msg
        </p>
        <p>
          echo : {echo}
        </p>
      </header>
    </div>
  );
}

export default App;

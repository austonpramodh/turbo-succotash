import { SnackbarProvider } from 'notistack';
import React from 'react';

import './App.css';
import TodoList from './components/TodoList';

function App(): JSX.Element {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <TodoList />
      </div>
    </SnackbarProvider>
  );
}

export default App;

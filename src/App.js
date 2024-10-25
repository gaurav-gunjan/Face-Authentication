import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FaceComponent from './components/FaceComponent';

const App = () => {
  return (
    <>
      <FaceComponent />

      <ToastContainer />
    </>
  )
}

export default App;
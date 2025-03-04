import React, { Suspense, lazy } from 'react';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO : Components

//! Lazy Load Pages
const LandingPage = lazy(() => import('./pages/landing-page'));
const TermsOfService = lazy(() => import('./pages/terms-of-service'));
const PrivacyPolicy = lazy(() => import('./pages/privacy-policy'));

const App = () => {
  return (
    <>
      <Suspense fallback={<div className='flex justify-center items-center min-h-screen min-w-full text-lg'>Loading...</div>}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/terms-of-service' element={<TermsOfService />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  )
}

export default App;
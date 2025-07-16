import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router'
import UserContextProvider from './context/Context';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import HomePageContextProvider from './context/HomePageContext';
function App() {

  return (
    <>
    <HomePageContextProvider>
       <UserContextProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </UserContextProvider>
    </HomePageContextProvider>
     
    </>

  )

}


export default App


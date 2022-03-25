import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authContext from './container/authContext';
import './styles/styles.scss';
import { getAuth } from './container/localstorage';
import Home from './pages/home';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

function App(props) {
    const [authentication, setAuthentication] = useState(getAuth());

    return (
        <AlertProvider template={AlertTemplate} {...options}>
        <authContext.Provider value={{ authentication, setAuthentication }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </authContext.Provider>
        </AlertProvider>
    );
}

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
  }

export default App;

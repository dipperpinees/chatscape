import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authContext from './container/authContext';
import Home from './components/home';
import SignIn from './components/signin';
import SignUp from './components/signup';
import "./styles/styles.scss";
import { getAuth } from './container/localstorage';
import JoinBox from './components/joinbox';

function App(props) {
    
    const [authentication, setAuthentication] = useState(getAuth());
  
    return (
        <authContext.Provider value={{ authentication, setAuthentication }}>
            <BrowserRouter> 
            <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/test" element={<JoinBox />} />
            </Routes>
            </BrowserRouter>
      </authContext.Provider>
  );
}

export default App;



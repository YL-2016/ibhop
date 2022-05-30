import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from 'react';
//MUI
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'

// Components
import Home from './Components/Home';
import Login from './Components/Login';
import Placelist from './Components/PlaceList';
import Header from './Components/Header';
import Buddy from './Components/Buddy';



function App() {
  return(
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
      <CssBaseline/>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/Placelist' element={<Placelist />} />
        <Route path='/Buddy' element={<Buddy />} />
      </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}


export default App;

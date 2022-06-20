import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React, { useEffect } from 'react';
import { useImmerReducer } from "use-immer";
//MUI
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'

// Components
import Home from './Components/Home';
import Login from './Components/Login';
import Placelist from './Components/PlaceList';
import Header from './Components/Header';
import Buddy from './Components/Buddy';
import UserRegister from './Components/UserRegister';

//contexts
import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';

function App() {
  const initialState = {
    //need to get from the localstorage, ow refresh will wipe out
    userUserName: localStorage.getItem('theUserUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogin: localStorage.getItem('theUserId') ? true : false,
	};

	function Reducer(draft, action) {
		switch (action.type) {
			case 'catchToken':
				draft.userToken = action.tokenValue;
				break;
      case 'userSignIn':
        draft.userUserName = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.idInfo;
        draft.userIsLogin = true;
				break;
      case 'logout':
        draft.userIsLogin = false;

		}
	}
	const [state, dispatch] = useImmerReducer(Reducer, initialState);

  useEffect(()=>{
    if(state.userIsLogin){
      localStorage.setItem('theUserUsername', state.userUserName)
      localStorage.setItem('theUserEmail', state.userEmail)
      localStorage.setItem('theUserId', state.userId)
      localStorage.setItem('theUserToken', state.userToken)
    }
    else{
      localStorage.removeItem('theUserUsername')
      localStorage.removeItem('theUserEmail')
      localStorage.removeItem('theUserId')
      localStorage.removeItem('theUserToken')
    }
  },[state.userIsLogin])

  return(
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
          <CssBaseline/>
          <Header/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/Placelist' element={<Placelist />} />
            <Route path='/UserRegister' element={<UserRegister />} />
            <Route path='/Buddy' element={<Buddy />} />
          </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
    
  );
}


export default App;

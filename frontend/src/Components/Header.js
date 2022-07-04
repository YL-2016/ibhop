import React, { useState, useContext, useEffect} from 'react';
import Axios from "axios";
import {Link, useNavigate} from "react-router-dom";
//MUI
import { Button, Typography, Grid, AppBar, Toolbar, Menu, MenuItem,Snackbar} from '@mui/material';
import { makeStyles } from '@mui/styles';
//Component
import { borderRadius } from '@mui/system';
//contexts
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

const useStyles = makeStyles({
    leftNav:{
        marginRight: "auto"
    },
    titleExplain:{
        color: "white",
        marginRight: "auto"
    },

    rightNav:{
        marginLeft: "auto",
    },
    newLocationBtn:{
        backgroundColor:'#E9B7C6',
        color: 'white',
        width: '11rem',
        fontSize: '1rem',
        "&:hover":{
            backgroundColor: '#139879'
        },
        marginLeft: "2rem",
    },

    loginBtn:{
        backgroundColor:'#E9B7C6',
        color: 'white',
        width: '11rem',
        fontSize: '1.1rem',
        marginLeft: '1rem',
        "&:hover":{
            backgroundColor: '#139879'
        },
    },

    userPageBtn:{
		color: "black",
		//backgroundColor: '#71AFED',
		width: "8rem",
		fontWeight:'1.1rem',
		borderRadius: "10px",
		marginBottom: "0.25rem",
    },

    logoutBtn:{
		color: "black",
		//backgroundColor: '#71AFED',
		width: "8rem",
		fontWeight: '1.1rem',
		borderRadius: "10px",
    }
})


function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [openSnack, setopenSnack] = useState(false)


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  function handleProfile(){
      setAnchorEl(null);
      navigate('/Profile')
  }

  async function handleLogOut() {
    setAnchorEl(null);
    const confirmLogout = window.confirm("Logging out?");
    if (confirmLogout) {
        try {
            const response = await Axios.post(
                "http://localhost:8000/api-auth/token/logout/",
                globalState.userToken,
                { headers: { Authorization: "Token ".concat(globalState.userToken) } }
            );

            globalDispatch({ type: "logout" });
            setopenSnack(true);
        } catch (error) {
            console.log(error.response)
        }
    }
}
useEffect(() => {
    if (openSnack) {
        setTimeout(() => {
            navigate(0);
        }, 1200);
    }
}, [openSnack]);

  return (
    <AppBar position="static" style={{backgroundColor:'#71AFED'}}>
        <Toolbar>
            <div className={classes.leftNav}>
                <Button color="inherit" onClick={()=>navigate('/')}>
                    <Typography variant="h6" component="div">
                    Location-Based Hang Out Planner
                    </Typography>
                </Button>
            </div>
            {/* <div className={classes.titleExplain}>
                <Typography variant="subtitle2" component="div">
                        Location-Based Travelling-Together Planner
                </Typography>
            </div> */}
            <div className={classes.rightNav}>
                <Button color="inherit" onClick={()=>navigate('/PlaceList')}>
                    <Typography variant="h7" component="div" style={{marginRight:"1rem"}}>
                        Places
                    </Typography>
                </Button>
                <Button color="inherit" onClick={()=>navigate('/Buddy')}>
                    <Typography variant="h7" component="div" style={{marginLeft:"1rem"}}>
                        Buddies
                    </Typography>
                </Button>
                <Button className={classes.newLocationBtn} onClick={()=>navigate('/AddPlace')}>
                        Add New Place
                </Button>
                {globalState.userIsLogin ? (
						<Button className={classes.loginBtn}
                        onClick={handleClick}
                        >
                            {globalState.userUserName}
						</Button>
					) : (
						<Button
							className={classes.loginBtn}
							onClick={() => navigate("/login")}
						>
							Login
						</Button>
				)}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                    
                >
                    <MenuItem className={classes.userPageBtn} onClick={handleProfile}>Update Profile</MenuItem>
                    <MenuItem className={classes.logoutBtn} onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
                <Snackbar
				open={openSnack}
				message="You have successfully logged out!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
		        />
            </div>
        </Toolbar>
        </AppBar> 
  )
}

export default Header
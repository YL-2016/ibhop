import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
//MUI
import { Button, Typography, Grid, AppBar, Toolbar} from '@mui/material';
import { makeStyles } from '@mui/styles';
//Component
import { borderRadius } from '@mui/system';


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
        width: '5rem',
        fontSize: '1.1rem',
        marginLeft: '1rem',
        "&:hover":{
            backgroundColor: '#139879'
        },
    },
})

function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <AppBar position="static" style={{backgroundColor:'#71AFED'}}>
        <Toolbar>
            <div className={classes.leftNav}>
                <Button color="inherit" onClick={()=>navigate('/')}>
                    <Typography variant="h4" component="div">
                        LBTTP
                    </Typography>
                </Button>
            </div>
            <div className={classes.titleExplain}>
                <Typography variant="subtitle2" component="div">
                        Location-Based Travelling-Together Planner
                </Typography>
            </div>
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
                <Button>
                    <Typography variant="h7" component="div" className={classes.newLocationBtn}>
                        Add New Place
                    </Typography>
                </Button>
                <Button onClick={()=>navigate('/Login')}>
                    <Typography variant="h7" component="div" className={classes.loginBtn}>
                        Login
                    </Typography>
                </Button>
            </div>
        </Toolbar>
        </AppBar> 
  )
}

export default Header
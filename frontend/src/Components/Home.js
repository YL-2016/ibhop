import React, { useState } from 'react';
import {Link} from "react-router-dom";
//MUI
import { Button, Typography, Grid, AppBar, Toolbar} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { borderRadius } from '@mui/system';
//Assets
import homePic from '../Assets/w1.jpeg'
//Components
import Header from './Header';

const useStyles = makeStyles({
    homePic:{
        width: '100%',
        height: "98vh"
    },
    overlayText:{
        top: '320px',
        left: '30px',
        position: 'absolute',
        zIndex: '100',
        textAlign:'center'

    },
    homePicText:{
        color:'#71AFED',
        fontWeight: 'bolden',
        fontSize:'2.5rem'
    },
    allList:{
        color:'white',
        fontWeight: 'bolden',
        fontSize:'1.5rem',
        borderRadius: '20px',
        marginTop:'1rem',
        marginLeft:'25rem',
        backgroundColor: '#E9B7C6',
        boxShadow: '2px 2px 2px #71AFED'
    }
})

function Home() {
    const classes = useStyles();
    return(
        <>
        <div style={{position:"relative"}}>
            <img src={homePic} className={classes.homePic}/>
            <div className={classes.overlayText}>
                <Typography variant="h3" className={classes.homePicText}>
                    WHERE THE ADVENTURE <span style={{color:'#99D7AA', fontSize:'3.8rem'}}>BEGINS</span>
                 </Typography>
                 <button variant="contained" className={classes.allList}>See all lists</button>
            </div>
        </div>
        </>
        
    );
}

export default Home
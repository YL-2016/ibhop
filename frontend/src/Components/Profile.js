import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,
	AppBar,
	Typography,
	Button,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CircularProgress,
	TextField,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { color } from "@mui/system";
//Contexts
import StateContext from "../Contexts/StateContext";
//Components
import ProfileUpdate from "./ProfileUpdate";
//Assets
import DefaultPic from "../Assets/DefaultPic.jpeg";


const useStyles = makeStyles({
    formContainer: {
		width: "75%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "3rem",
		border: "5px solid",
		padding: "2rem",
        color: "#E9B7C6",
        boxShadow: '3px 3px 3px #E9B7C6'
	},
    registerBtn: {
		backgroundColor: "#E9B7C6",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "#139879",
		},
	},
    addPicBtn:{
        backgroundColor: "#E9B7C6",
		color: "white",
		fontSize: "0.8rem",
		marginLeft: "1rem",
        border: "1px solid white",
		"&:hover": {
			backgroundColor: "#139879",
		},
    }

});

function Profile() {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);

    const initialState = {
        userProfile: {
			creatorName: "",
			emailAddress: "",
            profilePic:"",
            bio:"",
            placeListing:[]
		},
        dataIsLoading: true,

        
	};

	function Reducer(draft, action) {
		switch (action.type) {
            case "catchUserProfileInfo":
                draft.userProfile.creatorName = action.profileObject.creator_name;
				draft.userProfile.emailAddress = action.profileObject.email_address;
				draft.userProfile.profilePic = action.profileObject.profile_picture;
				draft.userProfile.bio = action.profileObject.bio;
                draft.userProfile.placeListing = action.profileObject.buddy_places_list;
				break;
            case "loadingDone":
                draft.dataIsLoading = false;
                break;
            
		}
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState);


    //request to get profile info
    useEffect(() => {
		async function GetProfileInfo() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/profiles/${GlobalState.userId}/`
				);
                console.log(response.data)
				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
                dispatch({ type: "loadingDone" });
			} catch (e) {}
		}
		GetProfileInfo();
	}, []);

    function placesDisplay(){
        if (state.userProfile.placeListing.length === 0) {
          return (
            <Button disabled size="small">
              Haven't Created Any Places Yet
            </Button>
          );
        } else if (state.userProfile.placeListing.length === 1) {
          return (
            <Button size="small">
              One Place Created
            </Button>
          );
        } else {
          return (
            <Button size="small">
              Created{" "}{state.userProfile.placeListing.length}{" "} places
            </Button>
          );
        }
      }

    function WelcomeDisplay(){
        if(
            state.userProfile.creatorName === null ||
            state.userProfile.emailAddress === null ||
			state.userProfile.creatorName === "" ||
			state.userProfile.emailAddress === ""
        ){
            return(
                <Typography variant="h6" style={{textAlign:'center', marginTop:'1.1rem'}}>
                    Welcome new buddy{' '}
                    <span style={{color:'#139879', fontSize: '1.8rem', fontWeight:'bolder'}}>
                        {GlobalState.userUserName}
                    </span>
                    ,{' '}please update your profile.
                </Typography>
            );
        }else {
			return (
				<Grid
					container
					style={{
						width: "60%",
						marginLeft: "auto",
						marginRight: "auto",
						marginTop: "1rem",
                        border: "5px solid",
                        padding: "0.5rem",
                        color: "#E9B7C6",
                        boxShadow: '2px 2px 2px #E9B7C6'
					}}>
					<Grid item xs={5}>
						<img
							style={{ height: "10rem", width: "15rem" }}
							src={
								state.userProfile.profilePic !== null 
                                ? state.userProfile.profilePic 
                                : DefaultPic
							}
						/>
					</Grid>
                    <Grid item container direction="column" justifyContent="center" xs={5}>
                        <Grid item xs={5}>
                            <Typography variant="h5" style={{textAlign:'center', marginTop:'0.8rem'}}>
                                Welcome {' '}
                                <span style={{color:'#139879', fontSize: '1.8rem', fontWeight:'bolder'}}>
                                    {GlobalState.userUserName}
                                </span>
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h5" style={{textAlign:'center', marginTop:'0.8rem'}}>
                                {placesDisplay()}
                            </Typography>
                        </Grid>
                    </Grid>
				</Grid>
			);
		}
    }
    if (state.dataIsLoading === true) {
		return (
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				style={{ height: "100vh" }}
			>
				<CircularProgress />
			</Grid>
		);
	}
    return (
        <>
        <div>
            {WelcomeDisplay()}
            <ProfileUpdate userProfile={state.userProfile}/>
        </div>

        </>
  )
}

export default Profile
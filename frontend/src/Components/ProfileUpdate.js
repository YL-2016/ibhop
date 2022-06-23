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
import StateContext from "../Contexts/StateContext";
import { color } from "@mui/system";

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

function ProfileUpdate(props) {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);
    console.log(props.userProfile);

    const initialState = {
        creatorName: props.userProfile.creatorName,
        emailAddress: props.userProfile.emailAddress,
        bio:props.userProfile.bio,
        profilePic:[],
        curPicture:props.userProfile.curPicture,
        placeList: [],
        sendRequest:0
        
	};

	function Reducer(draft, action) {
		switch (action.type) {
            case "catchCreatorNameChange":
                draft.creatorName = action.creatorNameChosen;
                break;
            case "catchEmailAddressChange":
                draft.emailAddress = action.emailAddressChosen;
                break
            case "catchBioChange":
                draft.bio = action.bioChosen;
                break
            case "catchProfilePic":
                draft.profilePic = action.profilePicChosen;
                break
            case "catchProfilePictureChange":
                draft.curPicture = action.curPictureChosen;
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break;
            
		}
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState);

    //use effect to catch uploaded profile pictures
	useEffect(() => {
		if (state.profilePic[0]) {
			dispatch({
				type: "catchProfilePictureChange",
				curPictureChosen: state.profilePic[0],
			});
		}
	}, [state.profilePic[0]]);

    //use request to 
    useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProfile() {
				const formData = new FormData();
				formData.append("creator_name", state.creatorName);
                formData.append("email_address", state.emailAddress);
                formData.append("bio", state.bio);
                formData.append("profile_picture", state.curPicture);
                formData.append("creator", GlobalState.userId);
                //take from the current of login user
                //child component of APP conponent
				try {
					const response = await Axios.patch(
						`http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
						formData
					);
				} catch (e) {
					console.log(e.response)
				}
			}
			UpdateProfile();
		}
	}, [state.sendRequest]);

    function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
	}
    
    return (
        <>
        <div className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
					<Typography variant="h4">MY INFO</Typography>
				</Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField 	
					id="creatorName" 
                    required
					label="Name" 
					variant="outlined" 
					fullWidth
					value={state.creatorName}
					onChange={(e) =>dispatch({type: "catchCreatorNameChange", creatorNameChosen: e.target.value})}
					/>
                </Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField 	
					id="emailAddress" 
					label="Email" 
					variant="outlined" 
					fullWidth
					value={state.emailAddress}
					onChange={(e) =>dispatch({type: "catchEmailAddressChange", emailAddressChosen: e.target.value})}
					/>
                </Grid>

                <Grid item container style={{ marginTop: "1.5rem" }}>
                    <TextField 	
					id="bio" 
					label="bio" 
                    multiline
                    rows={6}
					variant="outlined"
					fullWidth
					value={state.bio}
					onChange={(e) =>dispatch({type: "catchBioChange", bioChosen: e.target.value})}
					/>
                </Grid>
                <Grid item container xs={6}
                    style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Button 
                    variant="contained" 
                    conponent="label"
                    fullWidth 
                    className={classes.addPicBtn}
                    >
                        Upload Profile Picture
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/gif, image/jpeg"
                            onChange={(e)=>dispatch({type: "catchProfilePic", profilePicChosen: e.target.files})}
                        />
                    </Button>
                </Grid>
                <Grid item container>
                    <ul>
                        {state.curPicture ? <li>{state.curPicture.name}</li> : ""}
                    </ul>
                </Grid>
                <Grid item container xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
					<Button 
					variant="contained" 
					fullWidth 
					type="submit" 
					className={classes.registerBtn}
					>
						Update My Profile
					</Button>
				</Grid>
                
            </form>
        </div>
        </>
  )
}

export default ProfileUpdate
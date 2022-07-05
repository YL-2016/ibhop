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
	Snackbar,
	styled
} from "@mui/material";
//import { makeStyles } from "@mui/styles";
import StateContext from "../Contexts/StateContext";
import { color } from "@mui/system";

const useStyles = styled({
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
        curPicture:props.userProfile.profilePic,
        placeList: [],
        sendRequest:0,
		openSnack: false,
		disabledBtn: false,
        
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
			case "openTheSnack":
				draft.openSnack = true;
				break;
			case "disableTheButton":
				draft.disabledBtn = true;
				break;
			case "allowTheButton":
				draft.disabledBtn = false;
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

    //use request to send request
    useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProfile() {
				const formData = new FormData();
                if(typeof state.curPicture === "string" || state.curPicture === null){
                    formData.append("creator_name", state.creatorName);
                    formData.append("email_address", state.emailAddress);
                    formData.append("bio", state.bio);
                    formData.append("creator", GlobalState.userId);
                }else{
                    formData.append("creator_name", state.creatorName);
                    formData.append("email_address", state.emailAddress);
                    formData.append("bio", state.bio);
                    formData.append("profile_picture", state.curPicture);
                    formData.append("creator", GlobalState.userId);
                }
                //take from the current of login user
                //child component of APP conponent
				try {
					const response = await Axios.patch(
						`https://www.lbhop.com/api/profiles/${GlobalState.userId}/update/`,
						formData
					);
                    //REFRESH AFTER SUCCESSFUL
					dispatch({ type: "openTheSnack" });
				} catch (e) {
					dispatch({ type: "allowTheButton" });
				}
			}
			UpdateProfile();
		}
	}, [state.sendRequest]);

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1200);
		}
	}, [state.openSnack]);

    function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
		dispatch({ type: "disableTheButton" });
	}
    function ProfilePicDisplay() {
		if (typeof state.curPicture !== "string") {
			return (
				<ul>
					{state.curPicture ? (
						<li>{state.curPicture.name}</li>
					) : (
						""
					)}
				</ul>
			);
		} else if (typeof state.curPicture === "string") {
			return (
				<Grid
					item
					style={{
						marginTop: "0.5rem",
						marginRight: "auto",
						marginLeft: "auto",
					}}
				>
                    <Typography style={{textAlign:'center', marginTop:'1.1rem'}}>
                        Current Profile Picture: 
                    </Typography>
					<img
						src={props.userProfile.profilePic}
						style={{ height: "4rem", width: "4rem"}}
					/>
				</Grid>
			);
		}
	}

    return (
        <>
        <div 
		style={{width: "75%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "3rem",
		border: "5px solid",
		padding: "2rem",
        color: "#E9B7C6",
        boxShadow: '3px 3px 3px #E9B7C6'}}
		className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
					<Typography variant="h4">UPDATE MY INFO</Typography>
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
                <Grid item container>
                    {ProfilePicDisplay()}
                </Grid>

                <Grid item container xs={6}
                    style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Button 
                    variant="contained" 
                    conponent="label"
                    fullWidth 
					style={{backgroundColor: "#E9B7C6",
					color: "white",
					fontSize: "0.8rem",
					marginLeft: "1rem",
					border: "1px solid white",
					"&:hover": {
						backgroundColor: "#139879",
					},}}
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

                <Grid item container xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
					<Button 
					variant="contained" 
					fullWidth 
					type="submit" 
					style={{backgroundColor: "#E9B7C6",
					color: "white",
					fontSize: "1.1rem",
					marginLeft: "1rem",
					"&:hover": {
						backgroundColor: "#139879",
					},}}
					className={classes.registerBtn}
					disabled={state.disabledBtn}
					>
						Update My Profile
					</Button>
				</Grid>
                
            </form>
			<Snackbar
				open={state.openSnack}
				message="You have successfully updated your profile!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
		    />
        </div>
        </>
  )
}

export default ProfileUpdate
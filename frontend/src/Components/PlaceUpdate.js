import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
//https://www.npmjs.com/package/use-immer
import { useImmerReducer } from "use-immer";
//https://djoser.readthedocs.io/en/latest/settings.html#send-activation-email
// MUI
import {
	Grid,AppBar,Typography,Button,Card,CardHeader,CardMedia,CardContent,CircularProgress,
    TextField,Snackbar,Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
// Contexts
import StateContext from "../Contexts/StateContext";

const useStyles = makeStyles({
    formContainer: {
		width: "80%",
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


const placeTypeOptions = [
    {
		value: "",
		label: "",
	},
    {
        value: "Library",
        label: "Library",
    },
    {
        value: "Conservation Park",
        label: "Conservation Park",
    },
    {
        value: "Gallery",
        label: "Gallery",
    },
    {
        value: "Playground",
        label: "Playground",
    },
]

const parkingFeeTypeOptions = [
    {
		value: "",
		label: "",
	},
    {
        value: 'free',
        label: 'free',
    },
    {
        value: 'per hour',
        label: 'per hour',
    },
    {
        value: 'per day',
        label: 'per day',
    },
]

function PlaceUpdate(props) {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);

    const initialState = {
		titleValue: props.placeData.title,
        placeTypeValue: props.placeData.place_type,
        descriptionValue:props.placeData.description,
        entryFeeValue:props.placeData.entry_fee,
        parkingValue:props.placeData.parking,
        buddyNumValue:props.placeData.buddy_num,
        sendRequest: 0,
        openSnack: false,
		disabledBtn: false,
	};

	function Reducer(draft, action) {
		switch (action.type) {
			case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				break;
            case "catchPlaceTypeChange":
				draft.placeTypeValue = action.placeTypeChosen;
				break;
            case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;
            case "catchEntryFeeChange":
                draft.entryFeeValue = action.entryFeeChosen;
                break;
            case "catchParkingChange":
                draft.parkingValue = action.parkingChosen;
                break;
            case "catchBuddyNumChange":
                draft.buddyNumValue = action.buddyNumChosen;
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


    function FormSubmit(e) {
        e.preventDefault();
        dispatch({ type: "changeSendRequest" });
        dispatch({ type: "disableTheButton" });
    }

    useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1200);
		}
	}, [state.openSnack]);

    useEffect(() => {
		if (state.sendRequest) {
			async function UpdatePlace() {
				const formData = new FormData();
				formData.append("title", state.titleValue);
                formData.append("place_type", state.placeTypeValue);
                formData.append("description", state.descriptionValue);
                formData.append("entry_fee", state.entryFeeValue);
                formData.append("parking", state.parkingValue);
                formData.append("buddy_num", state.buddyNumValue);
                //take from the current of login user
                //child component of APP conponent
                formData.append("creator", GlobalState.userId);
				try {
					const response = await Axios.patch(
						`http://localhost:8000/api/places/${props.placeData.id}/update/`,
						formData
					);
                    dispatch({ type: "openTheSnack" });
				} catch (e) {
                    dispatch({ type: "allowTheButton" });
					//console.log(e.response)
				}
			}
			UpdatePlace();
		}
	}, [state.sendRequest]);

    return (
        <div className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
                    <Typography variant="h4">Update Place Info</Typography>
                </Grid>
                <Grid item container style={{ marginTop: "0.5rem" }}>
                    <TextField 	
                    id="title" 
                    label="Title" 
                    required
                    variant="standard" 
                    fullWidth
                    value={state.titleValue}
                    onChange={(e) =>dispatch({type: "catchTitleChange", titleChosen: e.target.value})}
                    />
                </Grid>
                <Grid item container justifyContent="space-between">
                    <Grid item xs={5} container style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="placeType" 
                        select
                        label="Select Place Type" 
                        variant="standard" 
                        fullWidth
                        value={state.placeTypeValue}
                        onChange={(e) =>dispatch({type: "catchPlaceTypeChange", placeTypeChosen: e.target.value})}
                        SelectProps={{
                            native: true,
                          }}
                        >
                            {placeTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid item container justifyContent="space-between">
                    <Grid item container xs={5} style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="parking"
                        select 
                        label="Parking Fee Type" 
                        variant="standard" 
                        fullWidth
                        value={state.parkingValue}
                        onChange={(e) =>dispatch({type: "catchParkingChange", parkingChosen: e.target.value})}
                        SelectProps={{
                            native: true,
                        }}
                        >
                            {parkingFeeTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item container xs={5} style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="entryFee" 
                        label="Entry Fee" 
                        type="number"
                        variant="standard" 
                        fullWidth
                        value={state.entryFeeValue}
                        onChange={(e) =>dispatch({type: "catchEntryFeeChange", entryFeeChosen: e.target.value})}
                        />
                    </Grid>
                </Grid>
                <Grid item container xs={5} style={{ marginTop: "0.5rem" }}>
                    <TextField 	
                    id="buddyNum" 
                    label="Buddy Number" 
                    type="number"
                    variant="standard" 
                    fullWidth
                    value={state.buddyNumValue}
                    onChange={(e) =>dispatch({type: "catchBuddyNumChange", buddyNumChosen: e.target.value})}
                    />
                </Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField 	
                    id="description" 
                    label="Description" 
                    variant="outlined"
                    multiline
                    rows={6}
                    fullWidth
                    value={state.descriptionValue}
                    onChange={(e) =>dispatch({type: "catchDescriptionChange", descriptionChosen: e.target.value})}
                    />
                </Grid>
                <Grid item container xs={6}
                    style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Button 
                    variant="contained" 
                    fullWidth 
                    type="submit" 
                    className={classes.registerBtn}
                    disabled={state.disabledBtn}
                    >
                        UPDATE
                    </Button>
                </Grid>
            </form>
            <Button variant="contained" onClick={props.closeDialog}>
                CANCEL
            </Button>
            <Snackbar
				open={state.openSnack}
				message="You have successfully updated your profile!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
		    />
        </div>
        )
}

export default PlaceUpdate

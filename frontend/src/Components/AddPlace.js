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
// React Leaflet
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	Polygon,
} from "react-leaflet";
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

const areaOptions = [
    {
		value: "",
		label: "",
	},
    {
        value: "Within the Canada",
        label: "Within the Canada",
    },
    {
        value: "Outside the Canada",
        label: "Outside the Canada",
    },
]

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

function AddPlace() {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);

    const initialState = {
		titleValue: '',
        placeTypeValue: '',
        descriptionValue:'',
        areaValue:'',
        entryFeeValue:'',
        parkingValue:'',
        buddyNumValue:'',
        latitudeValue:'',
        longitudeValue:'',
        picValue:'',
        pic1Value:'',
        pic2Value:'',
        pic3Value:'',
        mapInstance:null,
        markerPosition: {
			lat: "62.69369531078332",
			lng: "-103.82354234842099",
		},
        uploadedPictures: [],
        sendRequest: 0,



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
            case "catchAreaChange":
                draft.areaValue = action.areaValueChosen;
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
            case "catchLatitudeChange":
                draft.latitudeValue = action.latitudeChosen;
                break;
            case "catchLongitudeChange":
                draft.longitudeValue = action.longitudeChosen;
                break;
            case "catchPicChange":
                draft.picValue = action.picChosen;
                break;
            case "catchPic1Change":
                draft.pic1Value = action.pic1Chosen;
                break;
            case "catchPic2Change":
                draft.pic2Value = action.pic2Chosen;
                break;
            case "catchPic3Change":
                draft.pic3Value = action.pic3Chosen;
                break;
            case "getMap":
                draft.mapInstance = action.mapData;
                break;
            case "changeMarkerPosition":
                //refer the initialstate
                draft.markerPosition.lat = action.changeLatitude;
                draft.markerPosition.lng = action.changeLongitude;
                draft.latitudeValue = "";
                draft.longitudeValue = "";
                break;
            case "catchUploadedPictures":
                draft.uploadedPictures = action.picturesChosen;
                break
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;

            
		}
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState);
    

    //https://react-leaflet.js.org/docs/api-map/
    //https://leafletjs.com/reference.html
    function TheMapConponent() {
		const map = useMap();
		dispatch({ type: "getMap", mapData: map });
		return null;
	}

    // Draggable marker
	const markerRef = useRef(null);
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
                dispatch({
					type: "catchLatitudeChange",
					latitudeChosen: marker.getLatLng().lat,
				});
				dispatch({
					type: "catchLongitudeChange",
					longitudeChosen: marker.getLatLng().lng,
				});
			},
		}),
		[]
	);

    //use effect to change the map view depending on the chosen area
    useEffect(()=>{
        if(state.areaValue === 'Within the Canada'){
            state.mapInstance.flyTo([43.647395217171116, -79.40415730007514], 6);
            dispatch({
				type: "changeMarkerPosition",
				changeLatitude: 43.647395217171116,
				changeLongitude: -79.40415730007514,
			});
        }
        else if(state.areaValue === 'Outside the Canada') {
            state.mapInstance.flyTo([45.889076327889704, 166.8795827641737], 2);
            dispatch({
				type: "changeMarkerPosition",
				changeLatitude: 45.889076327889704,
				changeLongitude: 166.8795827641737,
			});
        }
    }, [state.areaValue]);

    //Catching picture file
    useEffect(()=>{
        if(state.uploadedPictures[0]){
            dispatch({type:"catchPicChange", picChosen:state.uploadedPictures[0]})
        }
    },[state.uploadedPictures[0]])

    useEffect(()=>{
        if(state.uploadedPictures[1]){
            dispatch({type:"catchPic1Change", pic1Chosen:state.uploadedPictures[1]})
        }
    },[state.uploadedPictures[1]])

    useEffect(()=>{
        if(state.uploadedPictures[2]){
            dispatch({type:"catchPic2Change", pic2Chosen:state.uploadedPictures[2]})
        }
    },[state.uploadedPictures[2]])

    // useEffect(()=>{
    //     if(state.uploadedPictures[3]){
    //         dispatch({type:"catchPic3Change", pic3Chosen:state.uploadedPictures[3]})
    //     }
    // },[state.uploadedPictures[3]])



    function FormSubmit(e) {
        e.preventDefault();
        dispatch({ type: "changeSendRequest" });
    }
    useEffect(() => {
		if (state.sendRequest) {
			async function AddPlace() {
				const formData = new FormData();
				formData.append("title", state.titleValue);
                formData.append("place_type", state.placeTypeValue);
                formData.append("description", state.descriptionValue);
                formData.append("area", state.areaValue);
                formData.append("entry_fee", state.entryFeeValue);
                formData.append("parking", state.parkingValue);
                formData.append("buddy_num", state.buddyNumValue);
                formData.append("latitude", state.latitudeValue);
                formData.append("longtitude", state.longitudeValue);
                formData.append("pic", state.picValue);
                formData.append("pic1", state.pic2Value);
                formData.append("pic2", state.pic3Value);
                //formData.append("pic3", state.pic4Value);
                //take from the current of login user
                //child component of APP conponent
                formData.append("Author", GlobalState.userId);
				try {
					const response = await Axios.post(
						"http://localhost:8000/api/places/create/",
						formData
					);
				} catch (e) {
					console.log(e.response)
				}
			}
			AddPlace();
		}
	}, [state.sendRequest]);

    return (
        <div className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
                    <Typography variant="h4">Create A Place</Typography>
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
                    <Grid item xs={5} container style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="area" 
                        select
                        label="Area" 
                        variant="standard" 
                        fullWidth
                        value={state.areaValue}
                        onChange={(e) =>dispatch({type: "catchAreaChange", areaValueChosen: e.target.value})}
                        SelectProps={{
                            native: true,
                          }}
                        >
                            {areaOptions.map((option) => (
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
                {/* MAP -- for map to show we need to add a style*/}
                <Grid item container style={{height:"60vh",  marginTop: "1rem" }}>
                    <MapContainer center={[45.889076327889704, 166.8795827641737]} zoom={2} scrollWheelZoom={true}>
                            <TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
                            <TheMapConponent/>
                            <Marker
							draggable
							eventHandlers={eventHandlers}
							position={state.markerPosition}
							ref={markerRef}
						    ></Marker>
                    </MapContainer>
                </Grid>
                <Grid item container>
                    <Typography style={{ fontSize: "1rem", color:"black", fontStyle:"italic"}}> 
                    Note: Please choose the area first and then drag the marker to mark the precise location.
                    </Typography>
                </Grid>
                {/* <Grid item container justifyContent="space-between">
                    <Grid item container xs={5} style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="latitude" 
                        label="Latitude" 
                        variant="standard" 
                        fullWidth
                        value={state.latitudeValue}
                        onChange={(e) =>dispatch({type: "catchLatitudeChange", latitudeChosen: e.target.value})}
                        />
                    </Grid>
                    <Grid item container xs={5} style={{ marginTop: "0.5rem" }}>
                        <TextField 	
                        id="longitude" 
                        label="Longitude" 
                        variant="standard" 
                        fullWidth
                        value={state.longitudeValue}
                        onChange={(e) =>dispatch({type: "catchLongitudeChange", longitudeChosen: e.target.value})}
                        />
                    </Grid>
                </Grid> */}
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
                <Grid item container xs={5}
                    style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Button 
                    variant="contained" 
                    conponent="label"
                    fullWidth 
                    className={classes.addPicBtn}
                    >
                        Upload Pictures (Up to 3)
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/gif, image/jpeg"
                            onChange={(e)=>dispatch({type: "catchUploadedPictures", picturesChosen: e.target.files})}
                        />
                    </Button>
                </Grid>
                <Grid item container>
                    <ul>
                        {state.picValue ? <li>{state.picValue.name}</li> : ""}
                        {state.pic1Value ? <li>{state.pic1Value.name}</li> : ""}
                        {state.pic2Value ? <li>{state.pic2Value.name}</li> : ""}
                        {/* {state.pic3Value ? <li>{state.pic3Value.name}</li> : ""} */}
                    </ul>
                </Grid>
                <Grid item container xs={6}
                    style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "auto" }}>
                    <Button 
                    variant="contained" 
                    fullWidth 
                    type="submit" 
                    className={classes.registerBtn}
                    >
                        SUBMIT
                    </Button>
                </Grid>
            </form>
            {/* <Button onClick={()=>state.mapInstance.flyTo([43,-79], 15)}>TestButton</Button> */}
        </div>
        )
}

export default AddPlace

import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,
	Typography,
	CircularProgress,
    Breadcrumbs,
    Link,
    IconButton,
    Button,
    Dialog,
	Snackbar,
    
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { color } from "@mui/system";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import RoomIcon from "@mui/icons-material/Room";
import {
	MapContainer,
	TileLayer,
	Marker,
} from "react-leaflet";
//Component
import PlaceUpdate from "./PlaceUpdate";
//Contexts
import StateContext from "../Contexts/StateContext";
//Assets
import DefaultPic from "../Assets/DefaultPic.jpeg";


const useStyles = makeStyles({
	sliderContainer: {
		position: "relative",
		marginTop: "2rem",
	},

	leftArrow: {
		position: "absolute",
		cursor: "pointer",
		fontSize: "3rem",
        color: "#E9B7C6",
		top: "50%",
		left: "17.5%",
		"&:hover": {
			backgroundColor: "#71AFED",
		},
	},

	rightArrow: {
		position: "absolute",
		cursor: "pointer",
		fontSize: "3rem",
        color: "#E9B7C6",
		top: "50%",
		right: "17.5%",
		"&:hover": {
			backgroundColor: "#71AFED",
		},
	},
});

function PlaceDetail() {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);
    console.log(useParams());
    const params = useParams();

    const initialState = {
        placeInfo:"",
        creatorProfileInfo:"",
        dataIsLoading: true,
        disabledBtn: false,
        openSnack: false,
        
	};

	function Reducer(draft, action) {
		switch (action.type) {
            case "catchPlaceInfo":
                draft. placeInfo= action.placeObject;
				break;
            case "loadingDone":
                draft.dataIsLoading = false;
                break;
            case "catchCreatorProfileInfo":
                draft.creatorProfileInfo = action.profileObject;
                break;
            case "disableTheButton":
                draft.disabledBtn = true;
            case "allowTheButton":
                draft.disabledBtn = false;
				break;
            case "openTheSnack":
                draft.openSnack = true;
                break;
		}
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState);

    const listPics = [state.placeInfo.pic, state.placeInfo.pic1, state.placeInfo.pic2,
    ].filter((pic)=>pic !== null)

    const date = new Date(state.placeInfo.date_posted);
    const formattedDate = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`;

    const [currentPicture, setCurrentPicture] = useState(0);
	function NextPicture() {
		if (currentPicture === listPics.length - 1) {
			return setCurrentPicture(0);
		} else {
			return setCurrentPicture(currentPicture + 1);
		}
	}

	function PreviousPicture() {
		if (currentPicture === 0) {
			return setCurrentPicture(listPics.length - 1);
		} else {
			return setCurrentPicture(currentPicture - 1);
		}
	}
    const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
    async function DeleteHandler() {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this listing?"
		);
		if (confirmDelete) {
			try {
				const response = await Axios.delete(
					`http://localhost:8000/api/places/${params.id}/delete/`
				);
                dispatch({ type: "openTheSnack" });
                dispatch({ type: "disableTheButton" });
			} catch (e) {
				dispatch({ type: "allowTheButton" });
			}
		}
	}

    useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate('/PlaceList');
			}, 1200);
		}
	}, [state.openSnack]);

    //request to get place info
    useEffect(() => {
		async function GetPlaceInfo() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/places/${params.id}/`
				);
                console.log(response.data)
				dispatch({
					type: "catchPlaceInfo",
					placeObject: response.data,
				});
                dispatch({ type: "loadingDone" });
			} catch (e) {}
		}
		GetPlaceInfo();
	}, []);

    // request to get profile info
	useEffect(() => {
		if (state.placeInfo) {
			async function GetProfileInfo() {
				try {
					const response = await Axios.get(
						`http://localhost:8000/api/profiles/${state.placeInfo.creator}/`
					);

					dispatch({
						type: "catchCreatorProfileInfo",
						profileObject: response.data,
					});
					dispatch({ type: "loadingDone" });
				} catch (e) {}
			}
			GetProfileInfo();
		}
	}, [state.placeInfo]);
    
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
    <div style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}>
        <Grid item style={{ marginTop: "1rem" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate("/Placelist")}
                    style={{ cursor: "pointer" }}
                >
                    Place List
                </Link>

                <Typography color="text.primary">
                    {state.placeInfo.title}
                </Typography>
            </Breadcrumbs>
        </Grid>
        {/* Image slider */}
		{listPics.length > 0 ? (
            <Grid
                item
                container
                justifyContent="center"
                className={classes.sliderContainer}
            >
                {listPics.map((picture, index) => {
                    return (
                        <div key={index}>
                            {index === currentPicture ? (
                                <img
                                    src={picture}
                                    style={{ width: "45rem", height: "35rem" }}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    );
                })}
                <ArrowBackIosNewOutlinedIcon
                    onClick={PreviousPicture}
                    className={classes.leftArrow}
                />
                <ArrowForwardIosOutlinedIcon
                    onClick={NextPicture}
                    className={classes.rightArrow}
                />
            </Grid>
        ) : (
            ""
        )}

        {/* More place information */}
        <Grid
            item
            container
            style={{
                padding: "1rem",
                border: "3px solid #E9B7C6",
                marginTop: "1rem",
            }}
        >
            <Grid item container xs={5} justifyContent="center" direction="column">
                <Grid item>
                    <Typography variant="h5">{state.placeInfo.title}</Typography>
                </Grid>
                <Grid item container xs={5} direction="column" spacing={1}>
                    <Grid item>
                        <IconButton> <RoomIcon />
                        <Typography varaiant="h6">{state.placeInfo.area}</Typography></IconButton>
                    </Grid>
                    <Grid item>
                        <Typography varaiant="subtitle1">Posted Date: {formattedDate}</Typography>
                        <Typography 
                        varaiant="subtitle1"
                        onClick={()=>navigate(`/Buddy/${state.placeInfo.creator}`)}
                        style={{cursor:"pointer"}}
                        >
                            Creator: {state.creatorProfileInfo.creator_name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container marginTop="0.5rem">
                <Typography varaiant="subtitle1">Description: {state.placeInfo.description}</Typography>
                </Grid>
            </Grid>
        </Grid>

        <Grid
            item
            container
            justifyContent="flex-start"
            style={{
                padding: "1rem",
                border: "3px solid #E9B7C6",
                marginTop: "1rem",
            }}
        >
            {state.placeInfo.place_type ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Type: {state.placeInfo.place_type} </Typography>
                </Grid>
            ) : (
                ""
            )}
            {state.placeInfo.buddy_num ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Prefered Buddy Numbers: {state.placeInfo.buddy_num}</Typography>
                </Grid>
            ) : (
                ""
            )}

            {state.placeInfo.parking ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Parking: {state.placeInfo.parking} </Typography>
                </Grid>
            ) : (
                ""
            )}

            {state.placeInfo.entry_fee ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Entry Fee: ${state.placeInfo.entry_fee} </Typography>
                </Grid>
            ) : (
                ""
            )}
            {state.placeInfo.latitude ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Latitude: {state.placeInfo.latitude} </Typography>
                </Grid>
            ) : (
                ""
            )}
            {state.placeInfo.longtitude ? (
                <Grid item xs={4} style={{ display: "flex" }}>
                    {" "}
                    <Typography variant="h6">Longitude: {state.placeInfo.longtitude} </Typography>
                </Grid>
            ) : (
                ""
            )}
            <Grid item container style={{height:"80vh",  marginTop: "1rem" }}>
                <MapContainer center={[state.placeInfo.latitude,state.placeInfo.longtitude]} zoom={16} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                        position={[state.placeInfo.latitude,state.placeInfo.longtitude]}
                        ></Marker>
                </MapContainer>
            </Grid>
        </Grid>
        <Grid item container justifyContent="flex-start" 
        style={{padding: "1rem", marginTop: "1rem",}}>
            {GlobalState.userId == state.placeInfo.creator ? (
                <Grid item container justifyContent="space-around">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={DeleteHandler}
                        disabled={state.disabledBtn}
                    >
                        Delete
                    </Button>
                    <Dialog open={open} onClose={handleClose} fullScreen>
                        <PlaceUpdate
                            placeData={state.placeInfo}
                            closeDialog={handleClose}
                        />
                    </Dialog>
                </Grid>
            ) : (
                ""
            )}
        </Grid>
        <Snackbar
            open={state.openSnack}
            message="You have successfully deleted this place!"
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
        />

    </div>
  )
}

export default PlaceDetail
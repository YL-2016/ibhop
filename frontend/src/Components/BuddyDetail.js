import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,
	AppBar,
	Typography,
	Button,
	Card,
	CardMedia,
	CardContent,
	CircularProgress,
	TextField,
    IconButton,
    CardActions
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { color } from "@mui/system";
import EmailIcon from '@mui/icons-material/Email';
//Contexts
import StateContext from "../Contexts/StateContext";
//Assets
import DefaultPic from "../Assets/DefaultPic.jpeg";


const useStyles = makeStyles({

});

function BuddyDetail() {
    const classes = useStyles();
    const navigate = useNavigate();  
    const GlobalState = useContext(StateContext);
    
    console.log(useParams());
    const params = useParams();

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
					`http://localhost:8000/api/profiles/${params.id}/`
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
    <div>
        <Grid
            container
            style={{
                width: "80%",
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
                    style={{ height: "10rem", width: "12rem" }}
                    src={
                        state.userProfile.profilePic !== null 
                        ? state.userProfile.profilePic 
                        : DefaultPic
                    }
                />
            </Grid>
            <Grid item container direction="column" justifyContent="center" xs={5}>
                <Grid item xs={5}>
                    <Typography variant="h6" style={{textAlign:'center', marginTop:'0.8rem'}}>
                        <span style={{color:'#139879', fontSize: '1.6rem', fontWeight:'bolder'}}>
                            {state.userProfile.creatorName}
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h6" style={{textAlign:'center', marginTop:'0.8rem'}}>
                        <IconButton><EmailIcon/>{state.userProfile.emailAddress}</IconButton>
                    </Typography>
                </Grid>
            </Grid>
            <Grid item style={{textAlign:'center', marginTop:'0.8rem', padding: "0.5rem",}}>
                    Bio:{state.userProfile.bio}
            </Grid>

            <Grid container justifyContent="flex-start" spacing={2} style={{ padding: "5px" }}>
            {state.userProfile.placeListing.map((place)=>{
            return(
            <Grid key={place.id} item style={{ marginTop: "1rem", maxWidth: "20rem" }}>
                                <Card style={{display: 'block',space:'1rem'}}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={
                                            `http://localhost:8000${place.pic1}`
                                            ? `http://localhost:8000${place.pic}` 
                                            : DefaultPic}
                                        alt=" Place Picture"
                                        onClick={()=>navigate(`/PlaceList/${place.id}`)}
                                        style={{cursor:"pointer"}}

                                    />
                                    <CardContent>
                                        <Typography 
                                        gutterBottom 
                                        variant="h5"
                                        style={{cursor:"pointer"}}
                                        component="div"
                                        onClick={()=>navigate(`/PlaceList/${place.id}`)}>
                                            {place.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {place.description.substring(0, 35)}...
                                        </Typography>
                                    </CardContent>
                                    {/* <CardActions>
                                        [lat:{place.latitude},
                                        long:{place.longtitude}]
                                    </CardActions> */}
                                    <Button
                                    onClick={()=>navigate(`/PlaceList/${place.id}`)}
                                    style={{color:'#71AFED'}}>
                                        More Detail
                                    </Button>
                                </Card>
                            </Grid>
            );
            }
            
            )}</Grid>

        </Grid>
    </div>
  )
}

export default BuddyDetail
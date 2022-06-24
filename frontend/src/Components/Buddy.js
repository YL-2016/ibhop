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
  CardActions,
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

});
function Buddy() {
  const classes = useStyles();
  const navigate = useNavigate();  
  const GlobalState = useContext(StateContext);

  const initialState = {
    dataIsLoading: true,
		buddyList: [],
  };

  function Reducer(draft, action) {
    switch (action.type) {
      case "catchBuddy":
				draft.buddyList = action.buddyAll;
				break;

			case "loadingDone":
				draft.dataIsLoading = false;
				break;
		}
    }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  //request to get all profile info
  useEffect(() => {
		async function GetBuddy() {
			try {
				const response = await Axios.get(
					'http://localhost:8000/api/profiles/'
				);
                console.log(response.data)
				dispatch({
					type: "catchBuddy",
					buddyAll: response.data,
				});
                dispatch({ type: "loadingDone" });
			} catch (e) {
        console.log(e.response)
      }
		}
		GetBuddy();
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

  return(
    <Grid container justifyContent="flex-start" spacing={2} style={{ padding: "5px" }}>
      {state.buddyList.map((buddy)=>{
      function placesDisplay(){
        if (buddy.buddy_places_list.length === 0) {
          return (
            <Button disabled size="small">
              Haven't Created Any Places Yet
            </Button>
          );
        } else if (buddy.buddy_places_list.length === 1) {
          return (
            <Button size="small">
              One Place Created
            </Button>
          );
        } else {
          return (
            <Button size="small">
              Created{" "}{buddy.buddy_places_list.length}{" "} places
            </Button>
          );
        }
      }
      if(buddy.creator_name && buddy.email_address){
        return(
          <Grid key={buddy.id} item style={{ marginTop: "1rem", maxWidth: "20rem" }}>
							<Card>
								<CardMedia
									component="img"
									height="140"
									image={buddy.profile_picture ? buddy.profile_picture : DefaultPic}
									alt="Profile Picture"
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{buddy.creator_name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{buddy.bio.substring(0, 35)}...
									</Typography>
								</CardContent>
								<CardActions>
                  {placesDisplay()}
                </CardActions>
							</Card>
						</Grid>
        );
      }
      
    })}</Grid>
  )
}

export default Buddy
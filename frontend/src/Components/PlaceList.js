import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useNavigate } from "react-router-dom";
//React - Leaflet
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import {Icon} from 'leaflet';
//MUI
import { Button, Typography, Grid, AppBar, Toolbar, Card, CardHeader, CardMedia, 
  CardContent, CircularProgress, IconButton, CardActions,} from '@mui/material';
import { makeStyles } from '@mui/styles';
import RoomIcon from "@mui/icons-material/Room";

//Map Marker Icons
import ArtMuseumIconPng from  '../Assets/icons/art-museum-2.png';
import LibraryIconPng from  '../Assets/icons/library.png';
import FestivalIconPng from  '../Assets/icons/festival.png';
import ConservationParkPng from  '../Assets/icons/ConservationPark.png';
//Assets
import TorontoLibImg1 from '../Assets/PlaceImg/TorontoPublicLibrary.png';
import places from '../Assets/Data/TestingData.js';

const useStyles = makeStyles({
  placeCardStyle:{
    position:'relative',
    margin:"8px",
    border: "2px solid white",
  },
  placeCardMediaStyle:{
    paddingRight:"5px",
    paddingLeft:"5px",
    height:"230px",
    width:"450px",
    cursor:"pointer",
  },
  adressOverlay:{
    position:'absolute',
    backgroundColor:'green',
    color:'white',
    top:'500px',
    left:'20px',
    padding:'5px',
  },
})

function PlaceList() {
  
  //
  //fetch('http://localhost:8000/api/places/').then(response=> response.json()).then(data=>console.log(data))
  const navigate = useNavigate();
  const classes = useStyles();
  const ArtMuseumIcon = new Icon({
    iconUrl: ArtMuseumIconPng,
    iconSize: [40,40],
  });
  const LibraryIcon = new Icon({
    iconUrl: LibraryIconPng,
    iconSize: [40,40],
  });
  const FestivalIcon = new Icon({
    iconUrl: FestivalIconPng,
    iconSize: [40,40],
  });

  const ConservationParkIcon = new Icon({
    iconUrl: ConservationParkPng,
    iconSize: [40,40],
  });

  const [latitude, setLatitude] = useState(43.6532);
  const [longtitude, setLongtitude] = useState(-79.3832)

  const initialState = {
		mapInstance: null,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "getMap":
				draft.mapInstance = action.mapData;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	function TheMapComponent() {
		const map = useMap();
		dispatch({ type: "getMap", mapData: map });
		return null;
	}

  function GoCenter(){
    setLatitude();
    setLongtitude();
  }

  const [allPlaces, setAllPlaces] = useState([]);
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(()=>{
    //https://axios-http.com/docs/intro
    //put response(promise) to asynchronize function to get data
    const source = Axios.CancelToken.source();
    async function getAllPlaces(){
      try{
        const response = await Axios.get('http://localhost:8000/api/places/', 
        { cancelToken: source.token });
        //console.log(response.data);
        setAllPlaces(response.data);
        setDataLoading(false)
      }catch(error){
        console.log(error.response)
      }
    }
    getAllPlaces();
    return()=>{
      source.cancel();
    }
  },[]);

  if (dataLoading === false){
    console.log(allPlaces[0]);
  }
  
  if (dataLoading === true){
    return (
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				style={{ height: "100vh" }}>
				<CircularProgress />
			</Grid>
		);
  }
  return (
    <Grid container>
      <Grid item xs={8} style={{marginTop:"10px"}}>
        <AppBar position='sticky'>
          <div style={{height:"100vh"}}>
            <MapContainer center={[43.6532, -79.3832]} zoom={10} scrollWheelZoom={true}>
              <TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
              <TheMapComponent/>
  
              {allPlaces.map((place)=>{
                function iconDisplay(){
                  if (place.place_type === 'Library'){
                    return LibraryIcon;
                  }
                  else if (place.place_type === 'Gallery'){
                    return ArtMuseumIcon;
                  }
                  else if (place.place_type === 'Playground'){
                    return FestivalIcon;
                  }
                  else if (place.place_type === 'Conservation Park'){
                    return ConservationParkIcon;
                  }
                }
                return (
                  <Marker
                    key={place.id}
                    icon={iconDisplay()}
                    position={[
                      place.latitude,
                      place.longtitude]}>
                    <Popup>
                      <Typography variant='h5'>{place.title}</Typography>
                      <img src={place.pic} 
                           style={{height:"12rem", 
                              width:"16rem",
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              borderRadius: '8px',
                              cursor:"pointer",}} 
                           onClick={()=>navigate(`/PlaceList/${place.id}`)}
                           
                      />
                      <Typography variant='body1'>
                        {place.description.toString(0,50)}...
                      </Typography>
                      <Button variant="contained" fullWidth
                      onClick={()=>navigate(`/PlaceList/${place.id}`)}>
                        More Info</Button>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
      <Grid item xs={4}>
        {allPlaces.map((place)=>{
          return (
            <Card key={place.id} className={classes.placeCardStyle}>
              <CardHeader
                action={
                 <IconButton aria-label="settings"
                 onClick={() =>state.mapInstance.flyTo([place.latitude, place.longtitude],16)}>
                   <RoomIcon/>
                 </IconButton>
                }
                title={place.title}
                //subheader="September 14, 2016"
              />
              <CardMedia className={classes.placeCardMediaStyle}
                component="img"
                image={place.pic}
                alt={place.title}
                onClick={()=>navigate(`/PlaceList/${place.id}`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {place.description.toString(0,50)}
                </Typography>
              </CardContent> 
              <CardActions>
                <Button
                  onClick={()=>navigate(`/PlaceList/${place.id}`)}
                  style={{color:'#71AFED'}}>
                      More Detail
                </Button>
              </CardActions>       
              <CardActions disableSpacing style={{font:"10px"}}>
                <Button aria-label="add to favorites" 
                onClick={()=>navigate(`/Buddy/${place.creator}`)}>
                  Created By:{place.creator_lname_username}
                </Button>
              </CardActions>
            </Card>
          )
        })}
      </Grid>
    </Grid>
  );
}

export default PlaceList
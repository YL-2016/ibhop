import React, {useState} from 'react';
//React - Leaflet
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
//MUI
import { Button, Typography, Grid, AppBar, Toolbar, Card, CardHeader, CardMedia, CardContent} from '@mui/material';
import { makeStyles } from '@mui/styles';
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
    width:"450px"

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

  function GoCenter(){
    setLatitude();
    setLongtitude();
  }

  return (
    <Grid container>
      <Grid item xs={8} style={{marginTop:"10px"}}>
        <AppBar position='sticky'>
          <div style={{height:"100vh"}}>
            <MapContainer center={[43.6532, -79.3832]} zoom={10} scrollWheelZoom={true}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                            
              {places.map((place)=>{
                function iconDisplay(){
                  if (place.type === 'Library'){
                    return LibraryIcon;
                  }
                  else if (place.type === 'Gallery'){
                    return ArtMuseumIcon;
                  }
                  else if (place.type === 'Conservation Park'){
                    return ConservationParkIcon;
                  }
                }
                return (
                  <Marker
                    key={place.id}
                    icon={iconDisplay()}
                    position={[
                      place.location.coordinates[0],
                      place.location.coordinates[1],
                    ]}>
                    <Popup>
                      <Typography variant='h5'>{place.title}</Typography>
                      <img src={place.pic} 
                           style={{height:"12rem", 
                              width:"16rem",
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              borderRadius: '8px',}} 
                      />
                      <Typography variant='body1'>
                        {place.description.toString(0,50)}...
                      </Typography>
                      <Button variant="contained" fullWidth>More Info</Button>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
      <Grid item xs={4}>
        {places.map((place)=>{
          return (
            <Card key={place.id} className={classes.placeCardStyle}>
              <CardHeader
                //action={
                //  <IconButton aria-label="settings">
                //    <MoreVertIcon />
                //  </IconButton>
                //}
                title={place.title}
                //subheader="September 14, 2016"
              />
              <CardMedia className={classes.placeCardMediaStyle}
                component="img"
                image={place.pic}
                alt={place.title}
              />
              <CardContent>
                <Typography variant="body2">
                  {place.description.toString(0,50)}
                </Typography>
              </CardContent>
              {/*<CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>*/}
            </Card>
          )
        })}
      </Grid>
    </Grid>
  );
}

export default PlaceList
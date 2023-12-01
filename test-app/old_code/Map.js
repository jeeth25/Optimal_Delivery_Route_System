import React from "react";
import { useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';


const apiKey = "AIzaSyCaWMTzyu3Whc_NtMtz7ol30tr328A3scM";

const containerStyle = {
    width: '100%',
    height: '100%'
    
};
const center = {
  lat: 33.8704,
  lng: -117.9242
};

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  if(!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <GoogleMap  
    mapContainerStyle={containerStyle} 
    center={center} 
    zoom={15} >
        
    </GoogleMap>
  )
};

export default MapComponent;

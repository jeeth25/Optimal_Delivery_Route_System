import "./App.css";
import { useState, useEffect } from "react";

import {
  Box,
  FormControl,
  FormLabel,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";

import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';


const apiKey = "AIzaSyCaWMTzyu3Whc_NtMtz7ol30tr328A3scM";

const containerStyle = {
    width: '100%',
    height: '100%'
    
};
const center = {
  lat: 33.8704,
  lng: -117.9242
};

const libraries = ["places"];

const OptimalDeliveryRouteSystem = () => {

  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [isValidInput, setIsValidInput] = useState(true); 

  useEffect(() => {
    if (markers.length > 0) {
      const latestMarker = markers[markers.length - 1];
      setMapCenter({ lat: latestMarker.lat, lng: latestMarker.lng });
    }
  }, [markers]);

  const handleAddLocation = (e) => {
    e.preventDefault();

    if (!isValidInput) {
      console.log("Invalid address");
      return; // Prevent adding invalid address to the list
  
    }

    setDeliveryLocations([...deliveryLocations, address]);
    setAddress("");

    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const newMarkers = [
          ...markers,
          {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        ];
        setMarkers(newMarkers);
        
      }
    }
  };

  const handleSubmit = () => {
    // Optimize route logic here
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries ,
  });

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);
        console.log("Valid address");
        setIsValidInput(true); 
        
      }
      else {
        console.log("Invalid address");
        setIsValidInput(false); 
        
      }
    }
  };

  if(!isLoaded) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div className="mainapp">
        <div className="locations">
            <Text fontSize="xl" fontWeight="bold">Enter Locations:</Text>
          <form onSubmit={handleAddLocation}>
            <FormControl>
              <FormLabel>Delivery Location:</FormLabel>
              <Autocomplete onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}>
              <Input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              </Autocomplete>
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Add Location
            </Button>
          </form>
      
          <form onSubmit={handleSubmit}>
            
              <Text fontSize="xl" fontWeight="bold">Delivery Locations:</Text>
              <ul>
                {deliveryLocations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            
            <Flex>
              <Button colorScheme="blue" type="submit">Optimize Route</Button>
              <Button onClick={handleRefresh} colorScheme="red">Refresh Page</Button>
            </Flex>
          </form>
        </div>
        
        <div className="map">
          <h1>Google Map</h1>
          <GoogleMap  
          mapContainerStyle={containerStyle} 
          center={mapCenter} 
          zoom={15}>

          {markers.map((marker, index) => (
              <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
            ))}         
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default OptimalDeliveryRouteSystem;

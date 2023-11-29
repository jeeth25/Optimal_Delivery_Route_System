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

import { GoogleMap, useJsApiLoader, Marker, Autocomplete, Polyline, DirectionsService, InfoWindow } from '@react-google-maps/api';


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
  const [cities, setCities] = useState([]);
  const [tourPath, setTourPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState([]);
  const [directions, setDirections] = useState([]);
  const [markersWithLabels, setMarkersWithLabels] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
      console.log("Lat:", place.geometry.location.lat());
      console.log("Lng:", place.geometry.location.lng());
      if (place && place.geometry && place.geometry.location) {
        const newMarkers = [
          ...markers,
          {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        ];
        setMarkers(newMarkers);

      const newCities = [
        ...cities,
        { lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
      ];
      setCities(newCities); 
      
      console.log("Cities:", newCities);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const calculateDistances = async () => {
  
      const distances = [];
      const service = new window.google.maps.DistanceMatrixService();
  
      // Calculate distances between pairs of coordinates using Google Maps API
      for (let i = 0; i < cities.length; i++) {
        const origins = { lat: cities[i].lat, lng: cities[i].lng };
        const rowDistances = [];
  
        for (let j = 0; j < cities.length; j++) {
          if (i !== j) {
            const destination = { lat: cities[j].lat, lng: cities[j].lng };
            try {
              const distance = await calculateDistance(service, origins, destination);
              rowDistances.push(distance);
            } catch (error) {
              console.error(error);
              rowDistances.push(null); // Set distance as null if there's an error
            }
          } else {
            rowDistances.push(0); // Distance from a node to itself is 0
          }
        }
        distances.push(rowDistances);
      }
  
      // Generate the distance matrix
      console.log('Distance Matrix:', distances);
      // Use the generated distance matrix for further processing
      // For instance, you can update state or perform additional operations
      const solveTSPNearest = (distances) => {
        const numCities = distances.length;
        const visited = new Array(numCities).fill(false);
        const tour = [];
        let totalDistance = 0;
  
        // Start at the first city
        let currentCity = 0;
        tour.push(currentCity);
        visited[currentCity] = true;
  
        // Repeat until all cities have been visited
        while (tour.length < numCities) {
          let nearestCity = null;
          let nearestDistance = Infinity;
  
          // Find the nearest unvisited city
          for (let city = 0; city < numCities; city++) {
            if (!visited[city] && distances[currentCity][city] !== undefined) {
              const distance = distances[currentCity][city];
              if (distance < nearestDistance) {
                nearestCity = city;
                nearestDistance = distance;
              }
            }
          }
  
          // Move to the nearest city
          if (nearestCity !== null) {
            currentCity = nearestCity;
            tour.push(currentCity);
            visited[currentCity] = true;
            totalDistance += nearestDistance;
          } else {
            // Handle the case where there's no valid nearest city
            break;
          }
        }
  
        // Complete the tour by returning to the starting city
        tour.push(0);
        totalDistance += distances[currentCity][0] !== undefined ? distances[currentCity][0] : 0;
  
        return { tour, totalDistance };
      };
  
      const { tour, totalDistance } = solveTSPNearest(distances);
      setTourPath(tour);
      setTotalDistance(totalDistance);
      console.log("Tour:", tour);
      console.log("Total distance:", totalDistance);

       // Request directions for the tour path
    if (tour.length >= 2) {
      const directionsService = new window.google.maps.DirectionsService();
      const waypoints = tour.slice(1, tour.length - 1).map(index => ({
        location: { lat: cities[index].lat, lng: cities[index].lng },
        stopover: true
      }));
      
      // Set the origin and destination for the directions request
      const origin = { lat: cities[tour[0]].lat, lng: cities[tour[0]].lng };
      const destination = { lat: cities[tour[tour.length - 1]].lat, lng: cities[tour[tour.length - 1]].lng };

      // Make the directions request
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: 'DRIVING' // Change this according to your use case
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result.routes[0].overview_path);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
    const labeledMarkers = tour.map((cityIndex, index) => {
      const city = cities[cityIndex];
      const markerLabel = index === 0 ? 'Start' : (index + 1).toString(); // Label for markers

      return {
        position: { lat: city.lat, lng: city.lng },
        label: markerLabel,
        title: city.name // Title for InfoWindow (city name)
      };
    });

    // Set the markers with labels in state
    setMarkersWithLabels(labeledMarkers);
    };
  
    await calculateDistances();
  };
  
  const calculateDistance = (service, origin, destination) => new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      },
      (response, status) => {
        if (status === 'OK') {
          const distance = response.rows[0].elements[0].distance.value;
          resolve(distance);
        } else {
          reject(new Error(`Error: ${status}`));
        }
      }
    );
  });
   

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
      
            {directions.length > 0 && (
            <Polyline
              path={directions.map(point => ({ lat: point.lat(), lng: point.lng() }))}
              options={{
                strokeColor: '#0000FF', // Blue color
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default OptimalDeliveryRouteSystem;

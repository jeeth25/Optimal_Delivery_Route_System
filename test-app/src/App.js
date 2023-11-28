import "./App.css";
import { useState } from "react";
import MapComponent from "./Components/Map";
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

const OptimalDeliveryRouteSystem = () => {
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [address, setAddress] = useState("");

  const handleAddLocation = (e) => {
    e.preventDefault();
    setDeliveryLocations([...deliveryLocations, address]);
    setAddress("");
  };

  const handleSubmit = () => {
    // Optimize route logic here
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="mainapp">
        <div className="locations">
            <Text fontSize="xl" fontWeight="bold">Enter Locations:</Text>
          <form onSubmit={handleAddLocation}>
            <FormControl>
              <FormLabel>Delivery Location:</FormLabel>
              <Input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Add Location
            </Button>
          </form>
      
          <form onSubmit={handleSubmit}>
            <Box>
              <Text fontSize="xl" fontWeight="bold">Delivery Locations:</Text>
              <ul>
                {deliveryLocations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            </Box>
            <Flex>
              <Button colorScheme="blue" type="submit">Optimize Route</Button>
              <Button onClick={handleRefresh} colorScheme="red">Refresh Page</Button>
            </Flex>
          </form>
        </div>
        
        <div className="map">
          <h1>Google Map</h1>
          {/* <MapComponent /> */}
        </div>
      </div>
    </div>
  );
};

export default OptimalDeliveryRouteSystem;

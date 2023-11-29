import React, { useState } from 'react';
import './App.css';
import 'index.html';

function App() {
 const [deliveryLocations, setDeliveryLocations] = useState([]);

 const handleAddLocation = (event) => {
    event.preventDefault();
    setDeliveryLocations([...deliveryLocations, { address: event.target.address.value }]);
    event.target.address.value = '';
 };

 const handleSubmit = async (event) => {
    event.preventDefault();
    // Call the backend to execute the TSP algorithm
    const response = await fetch('/tsp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliveryLocations),
    });

    const data = await response.json();
    console.log('Optimized Route:', data);
 };

 return (
    <div className="App">
      <form onSubmit={handleAddLocation}>
        <label>
          Delivery Location:
          <input type="text" name="address" required />
        </label>
        <button type="submit">Add Location</button>
      </form>

      <form onSubmit={handleSubmit}>
        <h2>Delivery Locations:</h2>
        <ul>
          {deliveryLocations.map((location, index) => (
            <li key={index}>{location.address}</li>
          ))}
        </ul>
        <button type="submit">Optimize Route</button>
      </form>

      <form onSubmit={handleSelectAlgorithm}>
        <label>
          Select an Algroithm:
        </label>
        <select id="algorithm" name="algorithm">
          <option value="TSP">TSP</option>
          <option value="Brute Force">Brute Force</option>
          <option value="Nearest Neighbors">Nearest Neighbors</option>
        </select>
        <button type="submit">Select an Algorithm: </button>
      </form>
    </div>
 );
}

export default App;
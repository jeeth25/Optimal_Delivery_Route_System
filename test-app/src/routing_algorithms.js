export const solveTSPNearest = (distances) => {
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
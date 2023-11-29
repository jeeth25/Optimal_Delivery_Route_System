function calculateDistance(city1, city2) {
    const { lat: lat1, lon: lon1 } = city1;
    const { lat: lat2, lon: lon2 } = city2;
    const radius = 6371;  // Radius of the Earth in kilometers
    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);

    let a = Math.sin(dlat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dlon / 2) ** 2;
    a = Math.min(1, a);  // Ensure a is within the valid range [0, 1]
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function getDistanceMatrix(cities) {
    const numCities = cities.length;
    const distances = new Array(numCities).fill(0).map(() => new Array(numCities).fill(0));

    for (let i = 0; i < numCities; i++) {
        for (let j = i + 1; j < numCities; j++) {
            const dist = calculateDistance(cities[i], cities[j]);
            distances[i][j] = Math.round(dist);
            distances[j][i] = Math.round(dist);  // Ensure symmetry
        }
    }

    return distances;
}

const cities = [
    { "lat": 52.5200, "lon": 13.4050 },
    { "lat": 53.5511, "lon": 9.9937 },
    { "lat": 48.1351, "lon": 11.5820 },
    { "lat": 50.9375, "lon": 6.9603 },
    { "lat": 50.1109, "lon": 8.6821 },
];

const distances = getDistanceMatrix(cities);

distances.forEach(row => {
    console.log(row);
});

function solveTSPNearest(distances) {
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
            if (!visited[city] && distances[currentCity] && distances[currentCity][city] !== undefined) {
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
    totalDistance += distances[currentCity] && distances[currentCity][0] !== undefined
        ? distances[currentCity][0]
        : 0;

    return { tour, totalDistance };
}

const { tour, totalDistance } = solveTSPNearest(distances);

console.log("Tour:", tour);
console.log("Total distance:", totalDistance);

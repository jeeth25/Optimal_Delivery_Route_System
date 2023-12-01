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

function solveTSPBruteForce(distances) {
    const numCities = distances.length;
    const allPermutations = generateAllPermutations(numCities);
    let minDistance = Infinity;
    let optimalTour;

    for (const permutation of allPermutations) {
        const currentDistance = calculateTourDistance(permutation, distances);
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            optimalTour = permutation;
        }
    }

    return { tour: optimalTour, totalDistance: minDistance };
}

function solveTSPMST(distances) {
    const numCities = distances.length;

    // Create a minimum spanning tree using Prim's algorithm
    const mst = primMST(distances);

    // Perform a Depth-First Search (DFS) on the MST to get a tour
    const tour = dfsOnMST(mst);

    // Calculate the total distance of the tour
    const totalDistance = calculateTourDistance(tour, distances);

    return { tour, totalDistance };
}

function primMST(graph) {
    const numVertices = graph.length;
    const parent = new Array(numVertices).fill(-1);
    const key = new Array(numVertices).fill(Infinity);
    const mstSet = new Array(numVertices).fill(false);

    key[0] = 0;

    for (let count = 0; count < numVertices - 1; count++) {
        const u = minKey(key, mstSet);
        mstSet[u] = true;

        for (let v = 0; v < numVertices; v++) {
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    return parent;
}

function minKey(key, mstSet) {
    const numVertices = key.length;
    let min = Infinity;
    let minIndex = -1;

    for (let v = 0; v < numVertices; v++) {
        if (!mstSet[v] && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    }

    return minIndex;
}

function dfsOnMST(mst) {
    const numVertices = mst.length;
    const stack = [];
    const visited = new Array(numVertices).fill(false);

    stack.push(0);
    visited[0] = true;

    const tour = [];

    while (stack.length > 0) {
        const currentVertex = stack.pop();
        tour.push(currentVertex);

        for (let i = 0; i < numVertices; i++) {
            if (mst[currentVertex][i] !== -1 && !visited[i]) {
                stack.push(i);
                visited[i] = true;
            }
        }
    }

    // Complete the tour by returning to the starting city
    tour.push(tour[0]);

    return tour;
}

function calculateTourDistance(tour, distances) {
    let totalDistance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
        const fromCity = tour[i];
        const toCity = tour[i + 1];
        totalDistance += distances[fromCity][toCity];
    }
    // Complete the tour by returning to the starting city
    totalDistance += distances[tour[tour.length - 1]][tour[0]];
    return totalDistance;
}

function generateAllPermutations(n) {
    const permutations = [];
    const indices = Array.from({ length: n }, (_, index) => index);

    function permute(arr, start, end) {
        if (start === end) {
            permutations.push([...arr]);
            return;
        }

        for (let i = start; i <= end; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];
            permute(arr, start + 1, end);
            [arr[start], arr[i]] = [arr[i], arr[start]]; // Backtrack
        }
    }

    permute(indices, 0, n - 1);
    return permutations;
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

const { tour: nearestTour, totalDistance: nearestTotalDistance } = solveTSPNearest(distances);
const { tour: bruteForceTour, totalDistance: bruteForceTotalDistance } = solveTSPBruteForce(distances);
const { tour: mstTour, totalDistance: mstTotalDistance } = solveTSPMST(distances);

console.log("Nearest Neighbor Tour:", nearestTour);
console.log("Nearest Neighbor Total distance:", nearestTotalDistance);

console.log("Brute Force Tour:", bruteForceTour);
console.log("Brute Force Total distance:", bruteForceTotalDistance);

console.log("Minimum Spanning Tree Tour:", mstTour);
console.log("Minimum Spanning Tree Total distance:", mstTotalDistance);

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
   
  export function solveTSPBruteForce(distances) {
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

 export function solveTSPMST(distances) {
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

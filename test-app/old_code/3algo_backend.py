import math
import itertools

def calculate_distance(city1, city2):
    lat1, lon1 = city1["lat"], city1["lon"]
    lat2, lon2 = city2["lat"], city2["lon"]
    radius = 6371  # Radius of the Earth in kilometers
    dlat = to_radians(lat2 - lat1)
    dlon = to_radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(to_radians(lat1)) * math.cos(to_radians(lat2)) * math.sin(dlon / 2) ** 2
    a = min(1, a)  # Ensure a is within the valid range [0, 1]
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = radius * c

    return distance

def to_radians(degrees):
    return degrees * (math.pi / 180)

def get_distance_matrix(cities):
    num_cities = len(cities)
    distances = [[0] * num_cities for _ in range(num_cities)]

    for i in range(num_cities):
        for j in range(i + 1, num_cities):
            dist = calculate_distance(cities[i], cities[j])
            distances[i][j] = round(dist)
            distances[j][i] = round(dist)  # Ensure symmetry

    return distances

def calculate_tour_distance(tour, distances):
    total_distance = 0
    for i in range(len(tour) - 1):
        from_city = tour[i]
        to_city = tour[i + 1]
        total_distance += distances[from_city][to_city]
    # Complete the tour by returning to the starting city
    total_distance += distances[tour[-1]][tour[0]] if distances[tour[-1]][tour[0]] is not None else 0
    return total_distance

def solve_tsp_nearest(distances):
    num_cities = len(distances)
    visited = [False] * num_cities
    tour = []
    total_distance = 0

    # Start at the first city
    current_city = 0
    tour.append(current_city)
    visited[current_city] = True

    # Repeat until all cities have been visited
    while len(tour) < num_cities:
        nearest_city = None
        nearest_distance = float("inf")

        # Find the nearest unvisited city
        for city in range(num_cities):
            if not visited[city] and distances[current_city] and distances[current_city][city] is not None:
                distance = distances[current_city][city]
                if distance < nearest_distance:
                    nearest_city = city
                    nearest_distance = distance

        # Move to the nearest city
        if nearest_city is not None:
            current_city = nearest_city
            tour.append(current_city)
            visited[current_city] = True
            total_distance += nearest_distance
        else:
            # Handle the case where there's no valid nearest city
            break

    # Complete the tour by returning to the starting city
    tour.append(0)
    total_distance += distances[current_city][0] if distances[current_city] and distances[current_city][0] is not None else 0

    return {"tour": tour, "total_distance": total_distance}

def solve_tsp_brute_force(distances):
    num_cities = len(distances)
    all_permutations = list(itertools.permutations(range(num_cities)))
    min_distance = float("inf")
    optimal_tour = None

    for permutation in all_permutations:
        current_distance = calculate_tour_distance(permutation, distances)
        if current_distance < min_distance:
            min_distance = current_distance
            optimal_tour = permutation

    return {"tour": optimal_tour, "total_distance": min_distance}

def prim_mst(graph):
    num_vertices = len(graph)
    parent = [-1] * num_vertices
    key = [float("inf")] * num_vertices
    mst_set = [False] * num_vertices

    key[0] = 0

    for count in range(num_vertices - 1):
        u = min_key(key, mst_set)
        mst_set[u] = True

        for v in range(num_vertices):
            if graph[u][v] and not mst_set[v] and graph[u][v] < key[v]:
                parent[v] = u
                key[v] = graph[u][v]

    return parent

def min_key(key, mst_set):
    num_vertices = len(key)
    min_val = float("inf")
    min_index = -1

    for v in range(num_vertices):
        if not mst_set[v] and key[v] < min_val:
            min_val = key[v]
            min_index = v

    return min_index

def dfs_on_mst(mst):
    num_vertices = len(mst)
    stack = []
    visited = [False] * num_vertices

    stack.append(0)
    visited[0] = True

    tour = []

    while stack:
        current_vertex = stack.pop()
        tour.append(current_vertex)

        for i in range(num_vertices):
            if mst[current_vertex][i] != -1 and not visited[i]:
                stack.append(i)
                visited[i] = True

    # Complete the tour by returning to the starting city
    tour.append(tour[0])

    return tour

# Your list of cities
cities = [
    {"lat": 52.5200, "lon": 13.4050},
    {"lat": 53.5511, "lon": 9.9937},
    {"lat": 48.1351, "lon": 11.5820},
    {"lat": 50.9375, "lon": 6.9603},
    {"lat": 50.1109, "lon": 8.6821},
]

# Generate the distance matrix
distances = get_distance_matrix(cities)

# Display the distance matrix
for row in distances:
    print(row)

# Solve TSP using Nearest Neighbor Algorithm
nearest_result = solve_tsp_nearest(distances)
print("Nearest Neighbor Tour:", nearest_result["tour"])
print("Nearest Neighbor Total distance:", nearest_result["total_distance"])

# Solve TSP using Brute Force Algorithm
brute_force_result = solve_tsp_brute_force(distances)
print("Brute Force Tour:", brute_force_result["tour"])
print("Brute Force Total distance:", brute_force_result["total_distance"])

# Solve TSP using Minimum Spanning Tree (MST) Algorithm
mst_result = solve_tsp_mst(distances)
print("Minimum Spanning Tree Tour:", mst_result["tour"])
print("Minimum Spanning Tree Total distance:", mst_result["total_distance"])

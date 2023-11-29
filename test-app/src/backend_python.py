import math

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

cities = [
    {"lat": 52.5200, "lon": 13.4050},
    {"lat": 53.5511, "lon": 9.9937},
    {"lat": 48.1351, "lon": 11.5820},
    {"lat": 50.9375, "lon": 6.9603},
    {"lat": 50.1109, "lon": 8.6821},
]

distances = get_distance_matrix(cities)

for row in distances:
    print(row)

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

result = solve_tsp_nearest(distances)

print("Tour:", result["tour"])
print("Total distance:", result["total_distance"])

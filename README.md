# Optimal Delivery Route System
This is the final project for CPSC-535 Advanced Algorithms. We have developed an optimal delivery route system for finding the shortest route between multiple locations. This project uses algorithms like Nearest Neighbor, Brute Force algorithm and Minimum Spanning Tree to solve the problem.

We have utilized the Google Maps API to calculate distances between routes and display them on the frontend. The user can add the locations and has the option to select any one of the three algorithms and get the route as the output. 

## Table of Contents

- [Team Members](#team-members)
- [Installation](#installation)
- [Usage](#usage)
- [Algorithms](#algorithms)
- [Getting Your API Key](#getting-your-api-key)

## Team Members

- Jeet Hirakani
- Anusha Anandhan
- Jahanvi Palliwal
- Vivek Deshmukh
- Sohail Khan
- Jenny Zhao
- Vishnu Vardhan Reddy Yeruva
- Abhitej Alpur 


## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/jeeth25/Optimal_Delivery_Route_System.git`
2. Navigate to the project directory: `cd test-app`
3. Install dependencies: `npm install`

## Usage

To run the project, use the following command: `npm start`

## Algorithms

This project uses several routing algorithms, implemented in [routing_algorithms.js](test-app/src/routing_algorithms.js). Here's a brief overview of each:

- Nearest Neighbor
- Brute Force
- Minimum Spanning Tree

## Getting Your API Key

To use the Google Maps API features, you will need to obtain your own API key from the Google Cloud Console. Follow these steps to get your API key:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to the "APIs & Services" dashboard.
4. Click on “Enable APIs and Services” and enable the Google Maps API for your project.
5. Go to the “Credentials” page and click “Create Credentials” to generate a new API key.
6. Once you have your API key, replace the `apiKey` variable in the `test-app/src/App.js` file.

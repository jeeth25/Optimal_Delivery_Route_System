import React from 'react';
// import { useNavigate, BrowserRouter as Router } from 'react-router-dom';

const YourReactComponent = ({setLandingPage}) => {
  const backgroundStyle = {
    backgroundImage: `url(${require('./background.gif')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',  // Adjust as needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the top
    paddingTop: '0vh', // Increased paddingTop for more space at the top
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  const githubLinkStyle = {
    position: 'absolute',
    bottom: '10px', // Adjust the bottom spacing as needed
    left: '10px', // Adjust the left spacing as needed
  };

  
  // const navigate = useNavigate();
  // const handleClick = () => {
  //   // Handle button click logic here
    
  //   console.log('Button clicked!');
  //   // navigate('/OptimalDeliveryRouteSystem'); 
  // };

  return (
    // <Router>
      // <ChakraProvider>
        <div style={backgroundStyle}>
          <h1><b>Optimal Delivery Route System Using TSP Algorithms</b></h1>
          {/* Your other GUI components go here */}
          <button style={buttonStyle} onClick={() => setLandingPage(false)}>
            START
          </button>
          {/* GitHub link with logo */}
          <a
            href="https://github.com/jeeth25/group_project5"
            target="_blank"
            rel="noopener noreferrer"
            style={githubLinkStyle}
          >
            <img
              src={require('./github.png')}
              alt="GitHub Logo"
              height="30"
              width="30"
            />
          </a>
        </div>
      // {/* </ChakraProvider> */}
    // </Router>
  );
};

export default YourReactComponent;

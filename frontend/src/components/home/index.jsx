import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAPIData from '../../hooks/useAPIData';

// COMPONENTS
// import Credits from "./Credits"
import Nav from './Nav';
import SidePanel from './sidePanel/index';
import Map from './Map';
import Login from './registration/Login';
import Register from './registration/Register';

// HOOKS!!!
import useVisualMode from '../../hooks/useVisualMode';

// STYLESHEETS
import '../../styles/scss/home.scss';

// MODES
const SEARCH = 'SEARCH';
const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';

export default function Home(props) {
  const {
    notification,
    setNotification,
    arrival,
    setArrival,
    departure,
    setDeparture,
    flightNumber,
    setFlightNumber,
    setResults,
    results,
    reset,
    defaultView,
    setDefaultView,
  } = useAPIData();

  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    user: {},
  });

  const { mode, transition, back } = useVisualMode(SEARCH);

  const handleLogin = (data) => {
    const userObj = data.data.user;
    console.log('handleLogin', data);

    setCurrentUser({
      isLoggedIn: true,
      user: userObj,
    });
  };
  const handleLogout = () => {
    setCurrentUser({
      isLoggedIn: false,
      user: {},
    });
  };

  //check loginstatus when: page loads, after logout, after login
  const loginStatus = () => {
    axios
      .get('/logged_in', { withCredentials: true })
      .then((response) => {
        if (response.data.logged_in) {
          handleLogin(response);
        } else {
          console.log('loginStatus: logged out.');
          handleLogout();
        }
      })
      .catch((error) => console.log('API errors:', error));
  };
  const logUserOut = () => {
    axios
      .delete('/logout', { withCredentials: true })
      .then((response) => {
        loginStatus();
        console.log(response);
      })
      .catch((error) => console.log('API errors:', error));
  };

  //check loginstatus when page loads
  useEffect(() => {
    loginStatus();
    //submitSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitSearch = function () {
    setResults([]);
    console.log('submit search called.');
    return axios
      .post('/search', {
        flight: {
          flight_number: flightNumber,
          dep_airport: departure,
          arr_airport: arrival,
          lat: 44.32,
          lng: -75,
          distance: 100,
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log('submit search response:', response.data);
          setResults(response.data);
          //setMapResults(response.data);
        }
      });
  };

  useEffect(() => {
    submitSearch();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='home'>
      {mode === LOGIN && (
        <div className='screen'>
          <Login handleLogin={handleLogin} hideForm={back} />
        </div>
      )}
      {mode === REGISTER && (
        <div className='screen'>
          <Register handleLogin={handleLogin} hideForm={back} />
        </div>
      )}

      <Nav
        isloggedin={currentUser.isLoggedIn ? 1 : 0}
        logout={logUserOut}
        username={currentUser.user.name}
        clickLogin={() => transition(LOGIN)}
        clickRegister={() => transition(REGISTER)}
      />
      <div className='map-sidebar'>
        <Map
          results={results}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
        />
        <SidePanel
          isLoggedIn={currentUser.isLoggedIn}
          arrival={arrival}
          setArrival={setArrival}
          departure={departure}
          setDeparture={setDeparture}
          flightNumber={flightNumber}
          setFlightNumber={setFlightNumber}
          notification={notification}
          setNotification={setNotification}
          results={results}
          setResults={setResults}
          submitSearch={submitSearch}
          login={handleLogin}
          reset={reset}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          username={currentUser.user.name}
        />
      </div>
    </div>
  );
}

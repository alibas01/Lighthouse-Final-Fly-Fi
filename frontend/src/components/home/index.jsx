import React, { useState, useEffect } from "react";
import axios from 'axios';

// COMPONENTS
// import Credits from "./Credits"
import Nav from "./Nav"
import SidePanel from "./sidePanel/index"
import Map from "./Map"
import Button from "../Button"
import Login from "./registration/Login";
import Register from "./registration/Register";

// STYLESHEETS
import "../Button"
import "../../styles/scss/home.scss"


export default function Home() {

  const [ currentUser, setCurrentUser ] = useState({
    isLoggedIn: false,
    user: { }
  });


  const [ showLogin, setShowLogin ] = useState({display: "none"});

  const [ showRegister, setShowRegister ] = useState({display: "none"});

  const handleLogin = (data) => {

    const userObj = data.data.user;
    console.log('handleLogin', data);

    setCurrentUser({
      isLoggedIn: true,
      user: userObj
    });
  }
  const handleLogout = () => {
    setCurrentUser({
      isLoggedIn: false,
      user: {}
    });
  }

  //check loginstatus when: page loads, after logout, after login
  const loginStatus = () => {
    axios.get('/logged_in', {withCredentials: true})
    .then(response => {
      if (response.data.logged_in) {
        handleLogin(response);
      } else {
        console.log("loginStatus: logged out.");
        handleLogout();
      }
    })
    .catch(error => console.log('API errors:', error))
  }
  const logUserOut = () =>{
    axios.delete('/logout', {withCredentials: true})
    .then(response => {
      loginStatus();
      console.log(response);
    })
    .catch(error => console.log('API errors:', error))
  };

  //check loginstatus when page loads
  useEffect(() => {
    loginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="home">

      <Login 
        handleLogin={handleLogin} 
        display={showLogin}
        hideForm={() => setShowLogin({display: "none"})}
      />
      <Register 
        handleLogin={handleLogin} 
        display={showRegister}
        hideForm={() => setShowRegister({display: "none"})}
      />


      <Nav 
        isloggedin={currentUser.isLoggedIn ? 1 : 0}
        logout={logUserOut}
        username={currentUser.user.name}
        clickLogin={() => setShowLogin({display: "block"})}
        clickRegister={() => setShowRegister({display: "block"})}
      />
      <div className="map-sidebar">
        <Map />
        <SidePanel 
          login={handleLogin}
        />
      </div>
    </div>
  )
}
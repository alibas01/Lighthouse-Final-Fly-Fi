import React, { useState } from 'react';
import axios from 'axios';

import '../../../styles/css/result-item.css';

export default function ResultItem(props) {
  const {
    flight,
    setFlightList,
    numberOfResults,
    setCurrentUser,
    currentUser,
  } = props;

  const queue_notification = function (ev, flight_info) {
    //set a table with tracked flight numbers to a state client side?

    if (ev.target.checked) {
      //set state of currentuser's flight list
      axios
        .post('/save_flight', {
          flight_info: {
            flight_number: flight_info.flight['iataNumber'],
            eta: 1,
          },
        })
        .then((response) => {
          console.log("user's tracked flights:", response.data.flights);

          const updatedUser = {
            isLoggedIn: currentUser.isLoggedIn,
            user: currentUser.user,
            savedFlights: response.data.flights,
          };

          console.log('updated user flights:', updatedUser.savedFlights);
          setCurrentUser(updatedUser);

          //set state?
          console.log('updated user data on check', currentUser);
        });

      // axios
      //   .post('/queue_text', {
      //     text_info: {
      //       user: props.username,
      //       message: `your flight ${flight_info.flight['iataNumber']} from ${flight_info.departure['iataCode']} to ${flight_info.arrival['iataCode']} is set to arrive soon (...)!`,
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response);
      //     axios
      //       .post('/save_flight', {
      //         flight_info: {
      //           flight_number: flight_info.flight['iataNumber'],
      //           eta: 1,
      //         },
      //       })
      //       .then((response) => {
      //         console.log(response);
      //       });
      //     //add flightinfo to the database or viceversa
      //   });
    } else {
      console.log('do not send notification.');

      //get flight id from match between user's savedFlights and current flight iata number
      const flightId = currentUser.savedFlights.find(
        (f) => f.flight_number === flight_info.flight['iataNumber']
      ).id;

      axios
        .post('/delete_flight', {
          flight_info: {
            flight_id: flightId,
          },
        })
        .then((response) => {
          console.log("user's tracked flights:", response.data.flights);

          const updatedUser = {
            isLoggedIn: currentUser.isLoggedIn,
            user: currentUser.user,
            savedFlights: response.data.flights,
          };

          setCurrentUser(updatedUser);

          //set state?
          console.log('updated user data on uncheck', updatedUser);
        });
    }
  };

  function formatResults(resultArr) {
    let resultObj = resultArr;

    return (
      <div className='single-result-item'>
        <div className='item'>
          <h5>{resultObj.flight && 'Flight#:'}</h5>
          <p>{resultObj.flight && resultObj.flight['iataNumber']}</p>
        </div>

        <div className='item'>
          <h5>{resultObj.departure && 'Departure:'}</h5>
          <p>{resultObj.departure && resultObj.departure['iataCode']}</p>
        </div>

        <div className='item'>
          <h5>{resultObj.arrival && 'Arrival:'}</h5>
          <p>{resultObj.arrival && resultObj.arrival['iataCode']}</p>
        </div>

        <div className='item'>
          <h5>{resultObj.geography && 'Altitude:'}</h5>
          <p>{resultObj.geography && resultObj.geography['altitude']}ft</p>
        </div>

        <div className='item'>
          <h5>{resultObj.speed && 'Speed:'}</h5>
          <p>{resultObj.speed && resultObj.speed['horizontal']}km/h</p>
        </div>

        <div className='item'>
          <h5>{resultObj.status && 'Status:'}</h5>
          <p>{resultObj.status && resultObj.status}</p>
        </div>

        {props.currentUser.isLoggedIn && (
          <section>
            <label htmlFor='arrivalAirport'>SMS notification?</label>
            <input
              name='notification'
              type='checkbox'
              value={''}
              // checked={checked}
              onChange={(e) => {
                queue_notification(e, resultObj);
              }}
            />
          </section>
        )}
      </div>
    );
  }

  function multipleFlights(resultArr) {
    return (
      <div className='multiple-result-item'>
        <p onClick={setFlightList}>{resultArr.flight['iataNumber']}</p>
      </div>
    );
  }

  function checkItem(result) {
    return numberOfResults > 1
      ? multipleFlights(result)
      : formatResults(result);
  }

  return <div className='results'>{checkItem(flight)}</div>;
}

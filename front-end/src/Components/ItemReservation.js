import React from "react";
import { Link } from 'react-router-dom';

import "./ItemReservation.css";

function ItemReservation({ itemKey = "1", bShowStatus = true, reservation = {}, handleCancel = {}}) {
  return (
    <li key={`reservation-${itemKey}`}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title font-weight-bold">Reservation: {reservation.reservation_id}</h5>
          <p className="card-text">Name: {reservation.first_name} {reservation.last_name}</p>
          <p className="card-text">Phone Number: {reservation.mobile_number}</p>
          <p className="card-text">Reservation Time: {reservation.reservation_time}</p>
          <p className="card-text">Reservation Date: {reservation.reservation_date}</p>
          <p className="card-text">Number of People: {reservation.people}</p>
          <p className="card-text" data-reservation-id-status={reservation.reservation_id}>
            {bShowStatus &&
              <>
                Status: {reservation.status}
                {reservation.status === "booked" &&
                  <>
                    <Link to={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">Seat</Link>
                    <Link to={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary">Edit</Link>
                  </>
                }
              </>
            }
          </p>
          {bShowStatus &&
            <>
              {reservation.status === "booked" &&
                <button className="btn btn-secondary"
                  data-reservation-id-cancel={reservation.reservation_id} 
                  value={reservation.reservation_id}
                  onClick={(event) => handleCancel(event)}>
                    Cancel
                </button>
              }
            </>
          }
        </div>
      </div>
    </li>
  );
}

export default ItemReservation;

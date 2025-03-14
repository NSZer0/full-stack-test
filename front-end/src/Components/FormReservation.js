import React from "react";
import ErrorAlert from "./ErrorAlert";

function FormReservation({ reservation = {}, formError = {}, handleChange, handleSubmit, handleCancel }) {
  return (
    <>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            className="form-control"
            type="text"
            name="first_name"
            placeholder="John"
            onChange={handleChange}
            value={reservation.first_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            className="form-control"
            type="text"
            name="last_name"
            placeholder="Doe"
            onChange={handleChange}
            value={reservation.last_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            id="mobile_number"
            className="form-control"
            type="text"
            pattern="(\d{3}-\d{3}-\d{4}|\d{10})"
            name="mobile_number"
            placeholder="123-456-7890"
            onChange={handleChange}
            value={reservation.mobile_number}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            id="reservation_date"
            className="form-control"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            placeholder="YYYY-MM-DD" 
            onChange={handleChange}
            value={reservation.reservation_date}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            id="reservation_time"
            className="form-control"
            type="time"
            pattern="[0-9]{2}:[0-9]{2}"
            name="reservation_time"
            placeholder="HH:MM" 
            onChange={handleChange}
            value={reservation.reservation_time}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Number of People</label>
          <input
            id="people"
            className="form-control"
            type="number"
            name="people"
            min="1"
            onChange={handleChange} 
            value={reservation.people}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="cancel" className= "btn btn-secondary mr-3" onClick={(event) => handleCancel(event)}>Cancel</button>
      </form>
    <ErrorAlert error={formError} />
    </>
  );
}

export default FormReservation;

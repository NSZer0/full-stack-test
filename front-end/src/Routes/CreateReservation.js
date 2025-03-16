import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { createReservation } from "../utils/api";
import FormReservation from "../Components/FormReservation";

// Renders the page /reservation/new
function CreateReservation() {
  const initialFormState = {
    first_name:"",
    last_name:"",
    mobile_number:"",
    reservation_date:"",
    reservation_time:"",
    people:""
  };
  const [reservation, setReservation] = useState({...initialFormState});
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  // Updates the reservation state variable when an input is changed
  const handleChange = ({target}) => {
    setReservation({
      ...reservation,
      [target.name]: target.value
    });
  };

  // Called when 'Submit' button is clicked
  // Resets form and navigates to page of created reservation if no errors
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const abortController = new AbortController();

      // API call to validate and create the reservation
      await createReservation(reservation, abortController.signal);
      // Reset form to initial state
      setReservation(initialFormState);
      // Navigate to /dashboard of date of created reservation
      navigate(`/dashboard?date=${reservation.reservation_date}`);
    }
    catch (error) {
      setFormError(error);
    }
  };

  // Triggers when 'Cancel' button is clicked
  // Resets form and navigates to previous page
  const handleCancel = (event) => {
    event.preventDefault();

    // Reset form to initial state
    setReservation(initialFormState);
    // Navigate to previous page
    navigate(-1);
  }

  // Render the page
  return (
    <>
      <FormReservation formError={formError} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel}/>
    </>
  )
}

export default CreateReservation

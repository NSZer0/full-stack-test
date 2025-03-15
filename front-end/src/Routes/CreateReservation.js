import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { createReservation } from "../utils/api";
import FormReservation from "../Components/FormReservation";

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

  const handleChange = ({target}) => {
    setReservation({
      ...reservation,
      [target.name]: target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const abortController = new AbortController();

      await createReservation(reservation, abortController.signal);
      setReservation(initialFormState);
      navigate(`/dashboard?date=${reservation.reservation_date}`);
    }
    catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();

    setReservation(initialFormState);
    navigate(-1);
  }

  return (
    <>
      <FormReservation formError={formError} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel}/>
    </>
  )
}

export default CreateReservation

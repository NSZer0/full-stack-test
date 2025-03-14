import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservation, editReservation } from "../utils/api";
import FormReservation from "../Components/FormReservation";

function EditReservation() {
  const initialFormState = {
    first_name:"",
    last_name:"",
    mobile_number:"",
    reservation_date:"",
    reservation_time:"",
    people:""
  };
  const [reservation, setReservation] = useState([]);
  const [formError, setFormError] = useState(null);

  const {reservationId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      try {
        const fetchReservation = await getReservation(reservationId, abortController.signal);
        setReservation(fetchReservation);
      }
      catch (error) {
        console.log(error);
      }
    }

    loadReservation();

    return () => abortController.abort();
  }, [reservationId]);

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

      await editReservation(reservation, abortController.signal);
      setReservation(initialFormState);
      navigate(`/dashboard`);
    }
    catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();

    setReservation(initialFormState);
    navigate(`/dashboard`);
  }

  return (
    <>
      <FormReservation formError={formError} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel}/>
    </>
  )
}

export default EditReservation;

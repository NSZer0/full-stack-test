import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { createTable } from "../utils/api";
import FormTable from "../Components/FormTable";

function CreateTable() {
  const initialFormState = {
    table_name:"",
    capacity:""
  };
  const [table, setTable] = useState({...initialFormState});
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  // Updates the reservation state variable when an input is changed
  const handleChange = ({target}) => {
    setTable({
      ...table,
      [target.name]: target.value
    });
  };

  // Called when 'Submit' button is clicked
  // Resets form and navigates to the dashboard
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const abortController = new AbortController();

      // API call to validate and create the table
      await createTable(table, abortController.signal);
      // Reset form to initial state
      setTable(initialFormState);
      // Navigate to previous page
      navigate(`/dashboard`);
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
    setTable(initialFormState);
    // Navigate to previous page
    navigate(-1);
  }

  // Render the page
  return (
    <>
      <FormTable formError={formError} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel}/>
    </>
  )
}

export default CreateTable

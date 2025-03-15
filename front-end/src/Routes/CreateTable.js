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

  const handleChange = ({target}) => {
    setTable({
      ...table,
      [target.name]: target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const abortController = new AbortController();

      await createTable(table, abortController.signal);
      setTable(initialFormState);
      navigate(`/dashboard`);
    }
    catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    
    setTable(initialFormState);
    navigate(-1);
  }

  return (
    <>
      <FormTable formError={formError} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel}/>
    </>
  )
}

export default CreateTable

import React from "react";

function InputSearch({ handleChange, handleSubmit }) {
  return (
    <div className="card">
      <label htmlFor="mobile_number">Mobile Number</label>
        <input 
          id="mobile_number"
          className="input-control"
          type="text"
          pattern="(\d{3}-\d{3}-\d{4}|\d{10})"
          name="mobile_number"
          placeholder="123-456-7890"
          onChange={handleChange} />
      <button type="submit" className="btn btn-primary" onClick={(event) => handleSubmit(event)}>Find</button>
    </div>
  );
}

export default InputSearch;
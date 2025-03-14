import React from "react";
import ErrorAlert from "./ErrorAlert";

function FormTable({ table = {}, formError = {}, handleChange, handleSubmit, handleCancel }) {
  return (
    <>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            id="table_name"
            className="form-control"
            type="text"
            name="table_name"
            onChange={handleChange}
            value={table.table_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            className="form-control"
            type="number"
            name="capacity"
            min="1"
            onChange={handleChange}
            value={table.capacity}
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

export default FormTable;
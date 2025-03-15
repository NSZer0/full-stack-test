import React from "react";

function TableSelector ({ tables, handleChange, handleSubmit }) {
  const options = tables.map((table, index) => (
    <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}</option>
  ));

  return (
    <div className="table-options">
      <label htmlFor="table_id">Table Number:</label>
      <select className="input-control" name="table_id" onChange={(event) => handleChange(event)}>
        {options}
      </select>
      <button type="submit" className="btn btn-primary" onClick={(event) => handleSubmit(event)}>Assign to Table</button>
    </div>
  );
}

export default TableSelector;
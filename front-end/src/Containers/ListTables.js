import React from "react";
import ItemTable from "../Components/ItemTable";

function ListTables({ tables, reservations = {}, handleFinish = {} }) {
  let tableList;
  const bHasReservations = Object.keys(reservations).length < 0;

  if (bHasReservations) {
    tableList = Array.isArray(tables) ? tables.map((table, index) => {
      const match = reservations.find(reservation => reservation.reservation_id === table.reservation_id);
      return (
        <ItemTable
          key={index}
          table={table}
          reservation={match}
          handleFinish={handleFinish} />
      );
    }) : null;
  } else {
    tableList = Array.isArray(tables) ? tables.map((table, index) => (
      <ItemTable key={index} table={table} />
    )) : null;
  }

  return (
    <>
      {tableList}
    </>
  );
}

export default ListTables;
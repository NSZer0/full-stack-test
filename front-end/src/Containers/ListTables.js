import React from "react";
import ItemTable from "../Components/ItemTable";

function ListTables({ bShowReservation = false, tables, reservations = {}, handleFinish = {} }) {
  const tableList = Array.isArray(tables) ? tables.map((table, index) => {
    let reservation = {};
    if(Object.keys(reservations).length > 0)
      reservation = reservations.find(reservation => reservation.reservation_id === table.reservation_id);

    return (
      <ItemTable
        key={index}
        table={table}
        bShowReservation={bShowReservation}
        reservation={reservation}
        handleFinish={handleFinish} />
    );
  }) : null;

  return (
    <>
      {tableList}
    </>
  );
}

export default ListTables;
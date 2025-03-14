import React from "react";
import ItemReservation from "../Components/ItemReservation";

function ListReservations({ reservations, handleCancelReservation }) {
  const reservationList = Array.isArray(reservations) ? reservations.map((reservation, index) => (
    <ItemReservation key={index} reservation={reservation} handleCancel={handleCancelReservation} />
  )) : null;

  return (
    <>
      {reservationList}
    </>
  );
}

export default ListReservations;

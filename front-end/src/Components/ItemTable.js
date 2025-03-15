import React from "react";

function ItemTable ({ key, table, bShowReservation = false, reservation = {}, handleFinish = {} }) {
  return (
    <li key={`table-${key}`}>
      <div className="card">
        <div className="row">
          <div className="card-body">
            <h5 className="card-title">{table.table_name}</h5>
            <p className="card-text">Table Capacity: {table.capacity}</p>
            <div data-table-id-status={table.table_id}>
              Status:
              {table.reservation_id ? (
                <>
                  {bShowReservation ? (
                    <>
                      <div>Reservation: Reservation-{table.reservation_id}</div>
                      <div>{reservation.first_name} {reservation.last_name}</div>
                      <div>{reservation.reservation_time}</div>
                      <div>{reservation.reservation_date}</div>
                    </>
                  ) : (
                    <div>
                      <p className="status-occupied">Occupied: Reservation-{table.reservation_id}</p>
                      <button data-table-id-finish={table.table_id} className="btn btn-info" value={table.table_id} onClick={(event) => handleFinish(event)}>Finish</button>
                    </div>
                  )}
                </> 
              ) : (
                <p className="status-unoccupied">Free</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ItemTable;

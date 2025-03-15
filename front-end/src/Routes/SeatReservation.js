import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateReservationStatus, getReservation, listTables, seatReservation} from "../utils/api";
import TableSelector from "../Components/TableSelector";
import ListTables from "../Containers/ListTables";
import ItemReservation from "../Components/ItemReservation";
import ErrorAlert from "../Components/ErrorAlert";

function SeatReservation({ reservations }) {
  const [reservation, setReservation] = useState([]);
  const [pageError, setPageError] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const navigate = useNavigate();
  const { reservationId } = useParams();

  const bShowStatus = false;

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchReservation() {
      try {
        setPageError(null);
        const response = await getReservation(reservationId, abortController.signal);
        console.log(response);
        setReservation(response);
      }
      catch (error) {
        console.log(error);
        setPageError(error);
      }
    }

    fetchReservation();

  }, [reservationId]);


  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTables() {
      try {
        setPageError(null);
        const tables = await listTables(abortController.signal);
        setTables(tables);
        if (tables.length > 0)
          setSelectedTable(tables[0]);
      }
      catch (error) {
        setPageError(error);
      }
    }

    fetchTables();

  }, [reservationId]);

  const handleChange = (event) => {
    const selectedTableId = Number(event.target.value);
    const selectedTable = tables.find(table => table.table_id === selectedTableId);
    setSelectedTable(selectedTable);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const abortController = new AbortController();

      await seatReservation(Number(selectedTable.table_id), reservation, abortController.signal);
      await updateReservationStatus(reservation.reservation_id, "seated", abortController.signal);
      navigate(`/dashboard`);
    }
    catch (error) {
      setPageError(error);
    }
  }  

  return (
    <main>
      <ErrorAlert error={pageError} />
      <div>
        <h2 className="title">Assign Reservation {reservation.reservation_id} to Table</h2>        
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
      <div>
        <ItemReservation bShowStatus={bShowStatus} />
      </div>
      <div >
        <TableSelector tables={tables} handleChange={handleChange} handleSubmit={handleSubmit}/>
      </div>   
      <h3 className="title">Tables</h3>
      <div className="row">
        <ListTables tables={tables} reservations={reservations} />
      </div>
    </main>
  );
}

export default SeatReservation;

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom"
import { updateReservationStatus, deleteTableReservation, listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ListReservations from "../Containers/ListReservations";
import ListTables from "../Containers/ListTables";
import ErrorAlert from "../Components/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [dashboardError, setDashboardError] = useState(null);
  // const [allReservations, setAllReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const navigate = useNavigate();

  // Get the date query from the URL if there is one and set it.
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || today();

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, [date]);

  async function loadDashboard() {
    const abortController = new AbortController();

    try {
      setDashboardError(null);
      const fetchReservations = await listReservations(date, abortController.signal);

      if (fetchReservations.length === 0) 
        setDashboardError({ message: "No reservations found" });
      else 
        setReservations(fetchReservations);

      // const fetchAllReservations = await listReservations(abortController.signal);
      // if (fetchAllReservations.length === 0)
      //   setReservationsError({ message: "No reservations found" });
      // else
      //   setAllReservations(fetchAllReservations);
    }
    catch (error) {
      setDashboardError(error);
    }
    
    return () => abortController.abort();
  }

  async function loadTables() {
    const abortController = new AbortController();

    try {
      setDashboardError(null);
      const fetchTables = await listTables(abortController.signal);
      setTables(fetchTables);
    }
    catch (error) {
      setDashboardError(error);
    }

    return () => abortController.abort();
  }

  const handleCancelReservation = async (event) => {
    event.preventDefault();

    if (window.confirm("Do you want to cancel this reservation?\r\n\r\nThis cannot be undone.")) {
      const selectedTableId = event.target.value;
      const finishedReservation = reservations.find(reservation => reservation.reservation_id === Number(selectedTableId));

      try {
        const abortController = new AbortController();

        await updateReservationStatus(Number(finishedReservation.reservation_id), "Finished", abortController.signal);
        navigate(0); // Refresh the page to update the change
      }
      catch (error) {
        setDashboardError(error);
      }
    }
  }

  const handleFinish = async (event) => {
    event.preventDefault();

    if (window.confirm("Is this table ready to seat new guests?\r\n\r\nThis cannot be undone.")) {
      try {
        const abortController = new AbortController();

        const selectedTableId = event.target.value;
        const selectedTable = tables.find(table => table.table_id === Number(selectedTableId));
        const finishedReservation = reservations.find(reservation => reservation.reservation_id === Number(selectedTable.reservation_id));
  
        await updateReservationStatus(Number(finishedReservation.reservation_id), "cancelled", abortController.signal);
        await deleteTableReservation(Number(selectedTableId), abortController.signal);
        navigate(0); // Refresh the page to update the change
      }
      catch (error) {
        setDashboardError(error);
      }
    }
  }

  return (
    <main>
      <ErrorAlert error={dashboardError} />
      <h1>Dashboard</h1>
      <div>
        <button className="btn btn-secondary" onClick={() => navigate(`/dashboard?date=${previous(date)}`)}>Previous</button>
        <button className="btn btn-secondary" onClick={() => navigate(`/dashboard?date=${today()}`)}>Today</button>
        <button className="btn btn-secondary" onClick={() => navigate(`/dashboard?date=${next(date)}`)}>Next</button>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <ListReservations reservations={reservations} handleCancelReservation={handleCancelReservation} />
      </div>
      <div>
        <h4 className="mb-0">Tables</h4>
        <ListTables tables={tables} handleFinish={handleFinish} />
      </div>
    </main>
  );
}

export default Dashboard;

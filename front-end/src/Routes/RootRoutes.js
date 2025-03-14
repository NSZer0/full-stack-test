import React, {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { today } from "../utils/date-time";
import { listReservations, listTables } from "../utils/api";
import Dashboard from "./Dashboard";
import CreateReservation from "./CreateReservation";
import EditReservation from "./EditReservation";
import AssignReservation from "./AssignReservation"
import CreateTable from "./CreateTable";
import Search from "./Search";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function RootRoutes() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchReservations() {
      try {
        const fetchReservations = await listReservations(abortController.signal);
        setReservations(fetchReservations);
      }
      catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();

    return () => abortController.abort();
  }, [setReservations]);

  useEffect(() => {
    const abortController = new AbortController();
  
    async function fetchTables() {
      try {
        const fetchTables = await listTables(abortController.signal);
        setTables(fetchTables);
      }
      catch (error) {
        console.error("Error fetching tables:", error);
      }
    }

    fetchTables();

    return () => abortController.abort();
  }, [setTables]);
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard reservations={reservations} tables={tables} />} />
      <Route path="/search" element={<Search reservations={reservations} tables={tables} />} />
      <Route path="/reservations/*">
        <Route path="new" element={<CreateReservation />} />
        <Route path=":reservationId/*">
          <Route path="seat" element={<AssignReservation reservations={reservations} tables={tables} />} />    
          <Route path="edit" element={<EditReservation />} />
        </Route>
      </Route>
      <Route path="/tables/new" element={<CreateTable />} />
      <Route path="/dashboard" element={<Dashboard reservations={reservations} date={today()} tables={tables} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RootRoutes;

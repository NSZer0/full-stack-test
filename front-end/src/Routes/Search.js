import React, {useState} from "react";
import { useNavigate} from "react-router-dom"
import { searchReservations, updateReservationStatus } from "../utils/api";
import InputSearch from "../Components/InputSearch";
import ListReservations from "../Containers/ListReservations";
import ErrorAlert from "../Components/ErrorAlert";

function Search({ reservations }) {
  const initialFormState = {
    mobile_number: ""
  };

  const [searchData, setSearchData] = useState({...initialFormState});
  const [searchError, setSearchError] = useState(null);
  const [foundReservations, setFoundReservations] = useState([]);

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setSearchData({
      ...searchData,
      [target.name]: target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const abortController = new AbortController();

      const fetchReservations = await searchReservations(searchData.mobile_number, abortController.signal);
      if (fetchReservations.length < 0) {
        setFoundReservations(fetchReservations);
        setSearchError(null);
      }
      else
        throw new Error("No reservations found");

      setSearchData(initialFormState);
    }
    catch (error) {
      setSearchError(new Error(error.message));
    }
  };


  const handleCancelReservation = async (event) => {
    event.preventDefault()

    if (window.confirm("Do you want to cancel this reservation?\r\n\r\nThis cannot be undone.")) {
      const selectedTableId = Number(event.target.value);
      const reservation = reservations.find(reservation => reservation.reservation_id === selectedTableId);

      try {
        const abortController = new AbortController();

        await updateReservationStatus(Number(reservation.reservation_id), "Cancelled", abortController.signal);
        navigate(0); // Refresh the page to update the change
      }
      catch (error) {
        setSearchError(error);
      }
    }
  }

  return (
    <>        
      <h3 className="title">Search</h3>
        <div>
          <InputSearch handleChange={handleChange} handleSubmit={handleSubmit} />
          {searchError !== null &&
            <ErrorAlert error={searchError} />
          }
        </div>
        <div>
          {foundReservations.length > 0 &&
            <ListReservations reservations={foundReservations} handleCancelReservation={handleCancelReservation} />
          }
        </div>
    </>
  );
}

export default Search;

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation
 * @returns {Promise<[reservation]>}
 * A promise that resolves to an array of reservations entries, possibly empty
 * @param params
 * Object containing parameters to filter the reservation list by, possibly empty
 * @param signal
 * The abort controller object
 */
export async function listReservations(params, signal) {
  try {
    // Contruct the base URL
    const url = new URL(`${API_BASE_URL}/reservations`);
    // Append parameters to the URL (dates)
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );

    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  }
  catch(error) {
    throw error;
  }
}

/**
 * Fetches a reservation based on the provided reservation ID
 * @returns {Promise<[reservation]>}
 * A promise that resolves to an array of reservation entries, possibly empty
 * @param reservationId
 * The provided reservation ID
 * @param signal
 * The abort controller object
 */
export async function getReservation(reservationId, signal) {
  try {
    // Contruct the base URL
    const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);

    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  }
  catch(error) {
    throw error;
  }
}

/**
 * Creates a reservation entry
 * @param reservation
 * The provided reservation object
 * @param signal
 * The abort controller object
 */
export async function createReservation(reservation, signal) {
  try {
    // Force type for people to number
    reservation.people = Number(reservation.people);

    // Contruct the base URL
    const url = `${API_BASE_URL}/reservations`;
    // Contruct API call options
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify({ data: reservation }),
      signal,
    };

    return await fetchJson(url, options, []);
  }
  catch(error) {
    throw error;
  }
}

/**
 * Updates the data in a reservation entry
 * @param reservation
 * The provided reservation object
 * @param signal
 * The abort controller object
 */
export async function editReservation(reservation, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
    // Contruct API call options
    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: reservation }),
      signal,
    };
    
    return await fetchJson(url, options, []); 
  }
  catch(error) {
    throw error;
  }
}

/**
 * Updates the status in a reservation entry
 * @param reservationId
 * The provided reservation ID
 * @param reservationStatus
 * The status to update the reservation entry with (Seated|Finished|Cancelled)
 * @param signal
 * The abort controller object
 */
export async function updateReservationStatus(reservationId, reservationStatus, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
    // Contruct API call options
    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { status: reservationStatus } }),
      signal,
    };

    return await fetchJson(url, options, []); 
  }
  catch(error) {
    throw error;
  }
}

/**
 * Fetches reservations matching provided mobile number
 * @returns {Promise<[reservation]>}
 * A promise that resolves to an array of reservation entries, possibly empty
 * @param mobile_number
 * The provided mobile number, possibly empty
 * @param signal
 * The abort controller object
 */
export async function searchReservations(mobile_number, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/reservations`;
    // Append the mobile number to the URL if it exists
    if (mobile_number)
      url.searchParams.append('mobile_number', mobile_number);

    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  }
  catch(error) {
    throw error;
  }
}

/**
 * Fetches a list of tables
 * @returns {Promise<[tables]>}
 * A promise that resolves to an array of table entries, possibly empty
 * @param signal
 * The abort controller object
 */
export async function listTables(signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/tables`;

    return await fetchJson(url, { headers, signal }, []);
  }
  catch(error) {
    throw error;
  }
}

/**
 * Creates a table entry
 * @param table
 * The provided table object
 * @param signal
 * The abort controller object
 */
export async function createTable(table, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/tables`;
    // Contruct API call options
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify({ data: table }),
      signal,
    };

    return await fetchJson(url, options, []); 
  }
  catch(error) {
    throw error;
  }
}

/**
 * Updates a table entry with an assigned reservation ID
 * @param table
 * The provided table object
 * @param reservation
 * The provided reservation object
 * @param signal
 * The abort controller object
 */
export async function assignTableReservation(tableId, reservation, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/tables/${tableId}/seat`;
    // Contruct API call options
    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { reservation_id: reservation.reservation_id } }),
      signal,
    };

    return await fetchJson(url, options, []); 
  }
  catch(error) {
    throw error;
  }
}

/**
 * Deletes an assigned reservation from a table entry
 * @param tableId
 * The provided table ID
 * @param signal
 * The abort controller object
 */
export async function deleteTableReservation(tableId, signal) {
  try {
    // Contruct the base URL
    const url = `${API_BASE_URL}/tables/${tableId}/seat`;
    // Contruct API call options
    const options = {
      method: "DELETE",
      headers,
      signal,
    };

    return await fetchJson(url, options, []); 
  }
  catch(error) {
    throw error;
  }
}

const knex = require("../db/connection")

function list () {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_time", "asc");
}

function listForDate(date) {
  return knex("reservations")
    .select("*")
    .where("reservation_date", date)
    .orderBy("reservation_time", "asc");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where("reservation_id", reservationId)
    .first();
}

function create(reservation) {
  reservation.status = "booked";

  return knex("reservations")
    .insert(reservation, "*")
    .then(result => result[0]);
}

function update(reservation) {
  return knex("reservations")
    .select("*")
    .where("reservation_id", reservation.reservation_id)
    .update(updatedReservation, "*")
}

function search(mobile_number) {
  if (!mobile_number.trim())
    return Promise.resolve([]);

  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}
  
module.exports = {
  list, 
  listForDate,
  read,
  create,
  update,
  search
};
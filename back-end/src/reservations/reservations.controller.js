const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/////////////////////////////////////////////////////////////////
// Validation middleware
/////////////////////////////////////////////////////////////////

const properties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${reservationId} does not exist.`,
  });
}

function requestDataHasProperties(req, res, next) {
  const { data = {} } = req.body;
  if (Object.keys(data).length === 0)
    return next({ status: 400, message: "Reservation has no data." });

  for (const propertyName of properties) {
    if (!data[propertyName])
      return next({ status: 400, message: `Reservation requires ${propertyName}.` });
  }

  return next();
}

function validateReservationTimeAndDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`);
  const reservationHour = reservationDateTime.getHours();
  const reservationMinutes = reservationDateTime.getMinutes();

  const dateTest = new Date(reservation_date);
  if (isNaN(dateTest.getTime()))
    return next({ status: 400, message: "reservation_date is not a valid date" });

  const timePattern = /^([01]?\d|2[0-3]):[0-5]\d$/;
  const timePatternWithSeconds = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const bValidTime = (timePattern.test(reservation_time) || timePatternWithSeconds.test(reservation_time));
  if (!bValidTime)
    return next({ status: 400, message: "reservation_time is not a valid time" });

  if (reservationDateTime.getDay() === 2)
    return next({ status: 400, message: "The restaurant is closed on Tuesdays" });

  if (reservationDateTime < Date.now())
    return next({ status: 400, message: "Reservations must be for a future date and time" });

  if ((reservationHour > 10 || (reservationHour === 10 && reservationMinutes >= 30)) &&
      (reservationHour < 21 || (reservationHour === 21 && reservationMinutes <= 30)))
    next();
  else
    return next({ status: 400, message: "Reservations must be between 10:30AM and 9:30PM" });
};

function validatePeople(req, res, next) {
  const { people } = req.body.data;
  if (typeof people !== "number")
    return next({ status: 400, message: "people must be a number" });
  if (people < 1)
    return next({ status: 400, message: "Reservation must be for at least 1 person" });

  next();
}

function validateCreateStatus(req, res, next) {
  const { status } = req.body.data;

  if (status === "seated" || status === "finished")
    return next({ status: 400, message: "New reservation status cannot be set to 'seated' or 'finished'." });

  next();
}

function validateUpdateStatus(req, res, next) {
  const { status } = req.body.data;

  if (!status)
    next({ status: 400, message: "Status property is missing." });

  const statusCheck = ["booked", "seated", "finished", "cancelled"];
  if (!statusCheck.includes(status))
    return next({ status: 400, message: "Reservation status is unknown" });

  const reservationStatus = res.locals.reservation.status;
  if (reservationStatus === "finished" || reservationStatus === "cancelled")
    next({ status: 400, message: `Cannot change status if it is '${reservationStatus}'.` });

  next();
}

/////////////////////////////////////////////////////////////////
// Router middleware
/////////////////////////////////////////////////////////////////

async function list(req, res) {
  const { date, mobile_number } = req.query;

  let reservations;
  if (date)
    reservations = await service.listForDate(date);
  else if (mobile_number)
    reservations = await service.search(mobile_number);
  else
    reservations = await service.list();

  res.status(200).json({ data: reservations });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

async function create(req, res) {
  const { status } = req.body.data;
  if (!status)
    req.body.data.status = "booked";

  const result = await service.create(req.body.data);

  res.status(201).json({ data: result });
}

async function editReservation(req, res) {
  const data = req.body.data;

  const results = await service.update(data);

  res.status(200).json({ data: results[0] });
}

async function updateReservationStatus(req, res) {
  const reservation = res.locals.reservation;
  const updatedReservation = {
    ...reservation,
    reservation_id: reservation.reservation_id,
    status: req.body.data.status
  };

  const results = await service.update(updatedReservation);
  
  res.status(200).json({ data: results[0] });
}

/////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read),
  ],
  create: [
    requestDataHasProperties,
    validateReservationTimeAndDate,
    validatePeople,
    validateCreateStatus,
    asyncErrorBoundary(create),
  ],
  editReservation: [
    asyncErrorBoundary(reservationExists),
    requestDataHasProperties,
    validateReservationTimeAndDate,
    validatePeople,
    asyncErrorBoundary(editReservation),
  ],
  updateReservationStatus: [
    asyncErrorBoundary(reservationExists),
    validateUpdateStatus,
    asyncErrorBoundary(updateReservationStatus),
  ],
};

const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/////////////////////////////////////////////////////////////////
// Validation middleware
/////////////////////////////////////////////////////////////////

const properties = ["table_name", "capacity"];

async function tableExists (req, res, next) {
  const { tableId } = req.params;
  const table = await service.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }

  next({
    status: 404,
    message: `Table ${tableId} does not exist.`,
  });
}

function requestDataHasProperties (req, res, next) {
  const { data = {} } = req.body;
  if (Object.keys(data).length === 0)
    return next({ status: 400, message: "Table has no data." });

  for (const propertyName of properties) {
    if (!data[propertyName])
      return next({ status: 400, message: `Table requires ${property}.` });
  }

  if (data.table_name.length < 1)
    return next({ status: 400, message: "Table name must be more than 1 character." });

  if (data.capacity < 1)
    return next({ status: 400, message: "Table must have a capacity of 1 or more." });

  return next();
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.body;
  const reservation = await reservationService.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist.`,
  });
}

async function validateTableAssignment(req, res, next) {
  const tableId = req.params.tableId;
  const reservation = res.locals.reservation;

  const table = await service.read(tableId);

  if (reservation.status === "seated")
    return next({ status: 400, message: "This reservation is already seated" });

  if (table.capacity < reservation.people)
    return next({ status: 400, message: "Table capacity is not enough for the number of people." });

  if (table.reservation_id != null)
    return next({ status: 400, message: "Table is already assigned." });

  next();
}

function validateFinished(req, res, next) {
  const table = res.locals.table;

  if (!table.reservation_id)
    return next({ status: 400, message: "Table is already free" });

  next();
}

/////////////////////////////////////////////////////////////////
// Router middleware
/////////////////////////////////////////////////////////////////

async function list(req, res) {
  const tables = await service.list();

  res.status(200).json({ data: tables });
}

async function read(req, res) {
  const table = res.locals.table

  res.status(200).json({ table })
}

async function create(req, res) {
  const result = await service.create(req.body.data);

  res.status(201).json({ data: result });
}

async function updateStatus(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  let status = finished;
  if (reservation.status === "booked")
    status = "seated";

  const updatedReservation = {
    ...reservation,
    status: status
  };

  await reservationService.update(updatedReservation)

  const updatedTable = {
    ...table,
    table_id: table_id,
    reservation_id: reservation_id
  };

  const result = await service.update(updatedTable);

  res.status(200).json({ data: result });
}

async function freeTable(req, res) {
  const table = res.locals.table;

  const updatedReservation = {
    ...req.body.data,
    status: "finished",
    reservation_id: table.reservation_id
  };

  await reservationService.update(updatedReservation);

  const result = await service.freeTable(table.table_id);

  res.status(200).json({ data: result });
}

/////////////////////////////////////////////////////////////////
// Exports
/////////////////////////////////////////////////////////////////

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(read),
  ],
  create: [
    requestDataHasProperties,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateTableAssignment),
    asyncErrorBoundary(updateStatus),
  ],
  freeTable: [
    asyncErrorBoundary(tableExists),
    validateFinished,
    asyncErrorBoundary(freeTable),
  ],
};

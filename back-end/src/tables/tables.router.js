const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:tableId/seat")
  .get(controller.read)
  .put(controller.updateStatus)
  .delete(controller.freeTable)
  .all(methodNotAllowed);
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
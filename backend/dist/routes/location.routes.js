"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("../controllers/location.controller");
const router = (0, express_1.Router)();
router.get('/geocode', location_controller_1.geocode);
router.get('/reverse', location_controller_1.reverse);
exports.default = router;

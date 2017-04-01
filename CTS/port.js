// port.js

var landingpad = require('./landingpad');
var cargohold = require('./cargohold');
var random = require('./random');

var NO_JOB_BOARD_ID = -1;

function PortLocation(id, display_name, job_board_id, landing_pad_destinations) {
	this.id = id;
	this.display_name = display_name;
	this.landing_pad_destinations = landing_pad_destinations;
	if (job_board_id === null) {
		this.job_board_id = NO_JOB_BOARD_ID;
	} else {
		this.job_board_id = job_board_id;
	}
	this.cargo = new cargohold.CargoHold(cargohold.HOLD_SIZE_UNLIMITED);
}

PortLocation.prototype.toString = function() {
	return this.display_name;
};

PortLocation.prototype.landingPadDestinations = function() {
	return Object.freeze(this.landing_pad_destinations);
};

PortLocation.prototype.haslandingPadDestinations = function() {
	return this.landing_pad_destinations != null && this.landing_pad_destinations.length > 0;
};

PortLocation.prototype.hasJobBoard = function() {
	return this.job_board_id != NO_JOB_BOARD_ID;
};

PortLocation.prototype.jobBoardId = function() {
	if (this.hasJobBoard()) {
		return this.job_board_id;
	} else {
		return null;
	}
};

PortLocation.prototype.randomLandingPadDestinationForSize = function(size) {
	return random.randomElementFromArray(
		this.landingPadDestinations().filter(function(landingpad_dest) {
			var _landingpad = landingpad.landingPadIdToLocation(landingpad_dest.id);
			return _landingpad.canAcceptSize(size);
		}));
}

PortLocation.prototype.hasLandingPadDestinationForSize = function(size) {
	return (this.landingPadDestinations().filter(function(landingpad_dest) {
			var _landingpad = landingpad.landingPadIdToLocation(landingpad_dest.id);
			return _landingpad.canAcceptSize(size);
		}).length > 0);
};

function PortDestination(id) {
	this.id = id;
	this.type = "port";
}

PortDestination.prototype.toString = function() {
	var port = _portIdToLocation(this.id);
	return port.display_name;
};

var _port_locations = {
	port_olisar_strut_a: new PortLocation("port_olisar_strut_a", "Port Olisar (Strut A)", "port_olisar_jobboard",
		[
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_00"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_01"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_02"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_03"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_04"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_05"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_06"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_07"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_08"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_09"),
			new landingpad.LandingPadDestination("port_olisar_strut_a_pad_10"),
		]),
	port_olisar_strut_b: new PortLocation("port_olisar_strut_b", "Port Olisar (Strut B)", "port_olisar_jobboard",
		[
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_00"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_01"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_02"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_03"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_04"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_05"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_06"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_07"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_08"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_09"),
			new landingpad.LandingPadDestination("port_olisar_strut_b_pad_10"),
		]),
	port_olisar_strut_c: new PortLocation("port_olisar_strut_c", "Port Olisar (Strut C)", "port_olisar_jobboard",
		[
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_00"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_01"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_02"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_03"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_04"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_05"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_06"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_07"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_08"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_09"),
			new landingpad.LandingPadDestination("port_olisar_strut_c_pad_10"),
		]),
	port_olisar_strut_d: new PortLocation("port_olisar_strut_d", "Port Olisar (Strut D)", "port_olisar_jobboard",
		[
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_00"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_01"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_02"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_03"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_04"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_05"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_06"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_07"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_08"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_09"),
			new landingpad.LandingPadDestination("port_olisar_strut_d_pad_10"),
		]),
	kareah_pads: new PortLocation("kareah_pads", "Security Post Kareah (Pads)", "kareah_jobboard",
		[
			new landingpad.LandingPadDestination("kareah_pads_pad_01"),
			new landingpad.LandingPadDestination("kareah_pads_pad_02"),
			new landingpad.LandingPadDestination("kareah_pads_pad_03"),
			new landingpad.LandingPadDestination("kareah_pads_pad_04"),
			new landingpad.LandingPadDestination("kareah_pads_pad_05"),
			new landingpad.LandingPadDestination("kareah_pads_pad_06"),
			new landingpad.LandingPadDestination("kareah_pads_pad_07"),
			new landingpad.LandingPadDestination("kareah_pads_pad_08"),
		]),
	grim_hex_pads: new PortLocation("grim_hex_pads", "Grim Hex (Pads)", "grimhex_jobboard",
		[
			new landingpad.LandingPadDestination("grim_hex_pads_pad_01"),
			new landingpad.LandingPadDestination("grim_hex_pads_pad_02"),
			new landingpad.LandingPadDestination("grim_hex_pads_pad_03"),
			new landingpad.LandingPadDestination("grim_hex_pads_pad_04"),
			new landingpad.LandingPadDestination("grim_hex_pads_pad_05"),
			new landingpad.LandingPadDestination("grim_hex_pads_pad_06"),
		]),
	cryastro42_pads: new PortLocation("cryastro42_pads", "Cry-Astro Service 042 (Pads)", "cryastro_jobboard",
		[
			new landingpad.LandingPadDestination("cryastro42_pad_small"),
			new landingpad.LandingPadDestination("cryastro42_pad_large")
		]),
	cryastro151_pads: new PortLocation("cryastro151_pads", "Cry-Astro Service 151 (Pads)", "cryastro_jobboard",
		[
			new landingpad.LandingPadDestination("cryastro151_pad_small"),
			new landingpad.LandingPadDestination("cryastro151_pad_large")
		]),
	cryastro262_pads: new PortLocation("cryastro262_pads", "Cry-Astro Service 262 (Pads)", "cryastro_jobboard",
		[
			new landingpad.LandingPadDestination("cryastro262_pad_small"),
			new landingpad.LandingPadDestination("cryastro262_pad_large")
		]),
}

var _port_location_ids = [];

for (var port_location in _port_locations) {
	if (_port_locations.hasOwnProperty(port_location)) {
		_port_location_ids.push(port_location.id)
	}
}

var _portIdToLocation = function(locationId) {
	return Object.freeze(_port_locations[locationId]);
}

var _portIdsToLocations = function(locationIds) {
	var array = [];
	for (var i = locationIds.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_port_locations[locationIds[i]]);
	};
	return array;
}

module.exports = {
	PortLocation: PortLocation,
	PortDestination: PortDestination,
	port_location_ids: Object.freeze(_port_location_ids),
	portIdToLocation: _portIdToLocation,
	portIdsToLocations: _portIdsToLocations
}
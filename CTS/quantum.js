// quantum.js

var port = require('./port');
var shipcontact = require('./shipcontact');
var random = require('./random');

function QuantumLocation(id, display_name, port_destinations, quantum_destinations, rendezvous_destination_ids) {
	this.id = id;
	this.display_name = display_name;
	this.port_destinations = port_destinations;
	this.quantum_destinations = quantum_destinations;
	this.rendezvous_destination_ids = rendezvous_destination_ids;
}

QuantumLocation.prototype.portDestinations = function() {
	return Object.freeze(this.port_destinations);
};

QuantumLocation.prototype.quantumDestinations = function() {
	var _dests = Array.from(Object.freeze(this.quantum_destinations));
	_dests.sort(function(dest_a, dest_b) {
			if (dest_a.is_blocked && !dest_b.is_blocked) {
				return 1;
			} else if (!dest_a.is_blocked && dest_b.is_blocked) {
				return 0;
			} else {
				return dest_a.distance_km - dest_b.distance_km;
			}
		});
	return _dests;
};

QuantumLocation.prototype.quantumDestinationById = function(quantum_location_id) {
	for (var i = 0; i < this.quantum_destinations.length; i++) {
		_destination = this.quantum_destinations[i];
		if (_destination.id === quantum_location_id) {
			return Object.freeze(_destination);
		}
	}
	return null;
}

QuantumLocation.prototype.rendezvousDestinationForShipContact = function(shipcontact_id) {
	var rendezvous_dest_id = random.randomElementFromArray(this.rendezvous_destination_ids);
	var rendezvous_distance_km = random.randomIntInRange(25, 100);
	return new RendezvousDestination(shipcontact_id, this.id, rendezvous_dest_id, rendezvous_distance_km);
}

QuantumLocation.prototype.toString = function() {
	return this.display_name;
};

function QuantumDestination(id, distance_km, is_blocked) {
	this.id = id;
	this.distance_km = distance_km;
	this.is_blocked = is_blocked;
	this.type = "quantum";
}

QuantumDestination.prototype.toString = function() {
	var location = _quantum_locations[this.id];
	return location.display_name + (this.is_blocked ? " - BLOCKED" : "") + " (" + this.distance_km + "km)";
};

function RendezvousDestination(shipcontact_id, quantum_location_id, quantum_destination_id, distance_km) {
	this.shipcontact_id = shipcontact_id;
	this.quantum_location_id = quantum_location_id;
	this.quantum_destination_id = quantum_destination_id;
	this.distance_km = distance_km;
	this.type = "rendezvous";
	var _location = _quantumIdToLocation(this.quantum_location_id);
	var _destination = _location.quantumDestinationById(this.quantum_destination_id);
	this.distance_from_dest = _destination.distance_km - this.distance_km;
}

RendezvousDestination.prototype.toString = function() {
	var _loc = _quantumIdToLocation(this.quantum_location_id);
	var _dest = _loc.quantumDestinationById(this.quantum_destination_id);
	var _dest_loc = _quantumIdToLocation(this.quantum_destination_id);
	var _shipcontact = shipcontact.shipContactIdToShipContact(this.shipcontact_id);
	return _shipcontact.name + ", " + this.distance_km + "km (" + this.distance_from_dest + "km from " + _dest_loc.display_name + ")";
};

var _quantum_locations = {
	grim_hex: new QuantumLocation("grim_hex", "Grim Hex",
		[
			new port.PortDestination("grim_hex_pads"),
		],
		[
			new QuantumDestination("port_olisar", 153706, true),
			new QuantumDestination("covalex", 295238, true),
			new QuantumDestination("kareah", 325932, false),
			new QuantumDestination("cryastro42", 185931, false),
			new QuantumDestination("cryastro151", 338715, true),
			new QuantumDestination("cryastro262", 175443, false),
			new QuantumDestination("comm275", 210798, false),
			new QuantumDestination("comm306", 97942, false),
			new QuantumDestination("comm730", 86598, false),
			new QuantumDestination("comm625", 171271, true),
			new QuantumDestination("comm556", 286322, true),
			new QuantumDestination("comm472", 253331, true),
			new QuantumDestination("comm126", 167575, false),
		],
		[
			"comm275", "comm306", "comm730", "comm126"
		]
	),
	port_olisar: new QuantumLocation("port_olisar", "Port Olisar", 
		[
			new port.PortDestination("port_olisar_strut_a"),
			new port.PortDestination("port_olisar_strut_b"),
			new port.PortDestination("port_olisar_strut_c"),
			new port.PortDestination("port_olisar_strut_d"),
		],
		[
			new QuantumDestination("grim_hex", 153706, true),
			new QuantumDestination("covalex", 210860, true),
			new QuantumDestination("kareah", 176408, true),
			new QuantumDestination("cryastro42", 114362, false),
			new QuantumDestination("cryastro151", 197909, true),
			new QuantumDestination("cryastro262", 173985, false),
			new QuantumDestination("comm275", 83260, false),
			new QuantumDestination("comm306", 60480, false),
			new QuantumDestination("comm730", 144225, false),
			new QuantumDestination("comm625", 85503, false),
			new QuantumDestination("comm556", 173938, true),
			new QuantumDestination("comm472", 102884, true),
			new QuantumDestination("comm126", 142411, false),
		],
		[
			"comm275", "comm306", "comm730", "comm625", "comm126"
		]
	),
	covalex: new QuantumLocation("covalex", "Covalex Shipping Hub",
		[],
		[
			new QuantumDestination("grim_hex", 295238, true),
			new QuantumDestination("port_olisar", 210856, true),
			new QuantumDestination("kareah", 277698, false),
			new QuantumDestination("cryastro42", 323120, true),
			new QuantumDestination("cryastro151", 145300, false),
			new QuantumDestination("cryastro262", 144331, false),
			new QuantumDestination("comm275", 270203, false),
			new QuantumDestination("comm306", 247880, false),
			new QuantumDestination("comm730", 219729, false),
			new QuantumDestination("comm625", 137164, false),
			new QuantumDestination("comm556", 76554, false),
			new QuantumDestination("comm472", 174296, false),
			new QuantumDestination("comm126", 349650, false),
		],
		[
			"comm275", "comm306", "comm730", "comm625", "comm556", "comm472", "comm126"
		]
	),
	kareah: new QuantumLocation("kareah", "Security Post Kareah", 
		[
			new port.PortDestination("kareah_pads"),
		],
		[
			new QuantumDestination("grim_hex", 326446, false),
			new QuantumDestination("port_olisar", 176407, true),
			new QuantumDestination("covalex", 277698, false),
			new QuantumDestination("cryastro42", 184055, false),
			new QuantumDestination("cryastro151", 158484, false),
			new QuantumDestination("cryastro262", 322431, false),
			new QuantumDestination("comm275", 124286, false),
			new QuantumDestination("comm306", 228811, false),
			new QuantumDestination("comm730", 317687, true),
			new QuantumDestination("comm625", 222292, false),
			new QuantumDestination("comm556", 215782, false),
			new QuantumDestination("comm472", 111830, false),
			new QuantumDestination("comm126", 233648, false),
		],
		[
			"comm275", "comm306", "comm625", "comm556", "comm472", "comm126"
		]
	),
	cryastro42: new QuantumLocation("cryastro42", "Cry-Astro Service 042",
		[
			new port.PortDestination("cryastro42_pads"),
		],
		[
			new QuantumDestination("grim_hex", 185931, false),
			new QuantumDestination("port_olisar", 114361, false),
			new QuantumDestination("covalex", 323120, true),
			new QuantumDestination("kareah", 184055, false),
			new QuantumDestination("cryastro151", 279509, false),
			new QuantumDestination("cryastro262", 279509, false),
			new QuantumDestination("comm275", 72262, false),
			new QuantumDestination("comm306", 111525, false),
			new QuantumDestination("comm730", 224221, false),
			new QuantumDestination("comm625", 198364, false),
			new QuantumDestination("comm556", 277793, false),
			new QuantumDestination("comm472", 179255, false),
			new QuantumDestination("comm126", 60776, false),
		],
		[
			"comm275", "comm306", "comm730", "comm625", "comm556", "comm472", "comm126"
		]
	),
	cryastro151: new QuantumLocation("cryastro151", "Cry-Astro Service 151",
		[
			new port.PortDestination("cryastro151_pads"),
		],
		[
			new QuantumDestination("grim_hex", 338715, true),
			new QuantumDestination("port_olisar", 197908, true),
			new QuantumDestination("covalex", 145300, false),
			new QuantumDestination("kareah", 158484, false),
			new QuantumDestination("cryastro42", 279509, false),
			new QuantumDestination("cryastro262", 250000, false),
			new QuantumDestination("comm275", 211579, false),
			new QuantumDestination("comm306", 255793, true),
			new QuantumDestination("comm730", 290251, false),
			new QuantumDestination("comm625", 176223, false),
			new QuantumDestination("comm556", 95540, false),
			new QuantumDestination("comm472", 101932, false),
			new QuantumDestination("comm126", 320912, false),
		],
		[
			"comm275", "comm730", "comm625", "comm556", "comm472", "comm126"
		]
	),	
	cryastro262: new QuantumLocation("cryastro262", "Cry-Astro Service 262",
		[
			new port.PortDestination("cryastro262_pads"),
		],
		[
			new QuantumDestination("grim_hex", 175443, false),
			new QuantumDestination("port_olisar", 173986, false),
			new QuantumDestination("covalex", 144331, false),
			new QuantumDestination("kareah", 322431, false),
			new QuantumDestination("cryastro42", 279509, false),
			new QuantumDestination("cryastro151", 250000, false),
			new QuantumDestination("comm275", 255306, true),
			new QuantumDestination("comm306", 173450, false),
			new QuantumDestination("comm730", 90439, false),
			new QuantumDestination("comm625", 103147, false),
			new QuantumDestination("comm556", 171785, false),
			new QuantumDestination("comm472", 213859, false),
			new QuantumDestination("comm126", 287407, false),
		],
		[
			"comm306", "comm730", "comm625", "comm556", "comm472", "comm126"
		]
	),
	comm275: new QuantumLocation("comm275", "Comm Array 275",
		[],
		[
			new QuantumDestination("grim_hex", 210798, false),
			new QuantumDestination("port_olisar", 83259, false),
			new QuantumDestination("covalex", 270203, false),
			new QuantumDestination("kareah", 124286, false),
			new QuantumDestination("cryastro42", 72262, false),
			new QuantumDestination("cryastro151", 211579, false),
			new QuantumDestination("cryastro262", 255306, true),
			new QuantumDestination("comm306", 222824, false),
			new QuantumDestination("comm730", 115455, false),
			new QuantumDestination("comm625", 163218, true),
			new QuantumDestination("comm556", 222794, false),
			new QuantumDestination("comm472", 115371, false),
			new QuantumDestination("comm126", 115306, false),
		],
		[
			"comm306", "comm730", "comm556", "comm472", "comm126"
		]
	),
	comm306: new QuantumLocation("comm306", "Comm Array 306",
		[],
		[
			new QuantumDestination("grim_hex", 97942, false),
			new QuantumDestination("port_olisar", 60481, false),
			new QuantumDestination("covalex", 247880, false),
			new QuantumDestination("kareah", 228811, false),
			new QuantumDestination("cryastro42", 111525, false),
			new QuantumDestination("cryastro151", 255793, true),
			new QuantumDestination("cryastro262", 173450, false),
			new QuantumDestination("comm275", 115455, false),
			new QuantumDestination("comm730", 115249, false),
			new QuantumDestination("comm625", 115371, false),
			new QuantumDestination("comm556", 222794, false),
			new QuantumDestination("comm472", 163219, true),
			new QuantumDestination("comm126", 115305, false),
		],
		[
			"comm275", "comm730", "comm625", "comm556", "comm126"
		]
	),
	comm730: new QuantumLocation("comm730", "Comm Array 730",
		[],
		[
			new QuantumDestination("grim_hex", 86598, false),
			new QuantumDestination("port_olisar", 144226, false),
			new QuantumDestination("covalex", 219729, false),
			new QuantumDestination("kareah", 317687, true),
			new QuantumDestination("cryastro42", 224221, false),
			new QuantumDestination("cryastro151", 290251, false),
			new QuantumDestination("cryastro262", 90439, false),
			new QuantumDestination("comm275", 222824, false),
			new QuantumDestination("comm306", 115248, false),
			new QuantumDestination("comm625", 115248, false),
			new QuantumDestination("comm556", 222739, false),
			new QuantumDestination("comm472", 222824, false),
			new QuantumDestination("comm126", 222739, false),
		],
		[
			"comm275", "comm306", "comm625", "comm556", "comm472", "comm126"
		]
	),
	comm625: new QuantumLocation("comm625", "Comm Array 625",
		[],
		[
			new QuantumDestination("grim_hex", 171271, true),
			new QuantumDestination("port_olisar", 85503, false),
			new QuantumDestination("covalex", 137164, false),
			new QuantumDestination("kareah", 222292, false),
			new QuantumDestination("cryastro42", 198364, false),
			new QuantumDestination("cryastro151", 176223, false),
			new QuantumDestination("cryastro262", 103147, false),
			new QuantumDestination("comm275", 163218, true),
			new QuantumDestination("comm306", 115370, false),
			new QuantumDestination("comm730", 115248, false),
			new QuantumDestination("comm556", 115306, false),
			new QuantumDestination("comm472", 115455, false),
			new QuantumDestination("comm126", 222794, false),
		],
		[
			"comm306", "comm730", "comm556", "comm472", "comm126"
		]
	),
	comm556: new QuantumLocation("comm556", "Comm Array 556",
		[],
		[
			new QuantumDestination("grim_hex", 286322, true),
			new QuantumDestination("port_olisar", 173938, true),
			new QuantumDestination("covalex", 76554, false),
			new QuantumDestination("kareah", 215781, false),
			new QuantumDestination("cryastro42", 277792, false),
			new QuantumDestination("cryastro151", 95540, false),
			new QuantumDestination("cryastro262", 171784, false),
			new QuantumDestination("comm275", 222794, false),
			new QuantumDestination("comm306", 222794, false),
			new QuantumDestination("comm730", 222739, false),
			new QuantumDestination("comm625", 115306, false),
			new QuantumDestination("comm472", 115306, false),
			new QuantumDestination("comm126", 315000, true),
		],
		[
			"comm275", "comm306", "comm730", "comm625", "comm472"
		]
	),
	comm472: new QuantumLocation("comm472", "Comm Array 472",
		[],
		[
			new QuantumDestination("grim_hex", 253331, true),
			new QuantumDestination("port_olisar", 102883, true),
			new QuantumDestination("covalex", 174296, false),
			new QuantumDestination("kareah", 111830, false),
			new QuantumDestination("cryastro42", 179255, false),
			new QuantumDestination("cryastro151", 101932, false),
			new QuantumDestination("cryastro262", 213858, false),
			new QuantumDestination("comm275", 115371, false),
			new QuantumDestination("comm306", 163219, true),
			new QuantumDestination("comm730", 222824, false),
			new QuantumDestination("comm625", 115455, false),
			new QuantumDestination("comm556", 115305, false),
			new QuantumDestination("comm126", 222795, false),
		],
		[
			"comm275", "comm730", "comm625", "comm556", "comm126"
		]
	),
	comm126: new QuantumLocation("comm126", "Comm Array 126",
		[],
		[
			new QuantumDestination("grim_hex", 167575, false),
			new QuantumDestination("port_olisar", 142411, false),
			new QuantumDestination("covalex", 349650, false),
			new QuantumDestination("kareah", 233648, false),
			new QuantumDestination("cryastro42", 60776, false),
			new QuantumDestination("cryastro151", 320912, false),
			new QuantumDestination("cryastro262", 287407, false),
			new QuantumDestination("comm275", 115305, false),
			new QuantumDestination("comm306", 115305, false),
			new QuantumDestination("comm730", 222738, false),
			new QuantumDestination("comm625", 222794, false),
			new QuantumDestination("comm556", 315000, true),
			new QuantumDestination("comm472", 222794, false),
		],
		[
			"comm275", "comm306", "comm730", "comm625", "comm472"
		]
	),
}

var _quantumIdToLocation = function(locationId) {
	return Object.freeze(_quantum_locations[locationId]);
}

var _quantumIdsToLocations = function(locationIds) {
	array = [];
	for (var i = locationIds.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_quantum_locations[locationIds[i]]);
	};
	return array;
}

module.exports = {
	spawn_location_ids: ["port_olisar", "grim_hex"],
	quantumIdToLocation: _quantumIdToLocation,
	quantumIdsToLocations: _quantumIdsToLocations
}
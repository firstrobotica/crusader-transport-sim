// metacontract.js

// Contract generation
// ContractEmployer
//   name
//   ship_contacts_id
//   array of CommoditySchedules

// ContractCommoditySchedule
//   array of ContractOrigins
//   array of ContractDemandSchedules
//   array of container sizes in SCU
//   commodity id
//   max priority bonus per SCU (UEC)
//   price per SCU per kkm min (UEC)
//   price per SCU per kkm max (UEC)
//   minJumpsToBeAvailable
//   maxJumpsToBeAvailable

// ContractDemandSchedule
//   contract destination
//   priority min (0-1)
//   priority max (0-1)
//   demand min (0-1)
//   demand max (0-1)
//   volume min (SCU)
//   volume max (SCU)

// ContractOrigin
//   name
//   id
//   array of ContractLocations

// ContractDestination
//   name
//   id
//   array of ContractLocations



// Does it change depending on whether the employer is the seller or buyer of the goods?
// Effectively the price is passed on to the consumer anyway

// how to factor demand in?
// A destination has a demand level range for a good, the higher the demand the more willing they are to pay for shipping
// A destination also has a quantity demanded where they are willing to pay the normal freight rate.
// As the demand level varies, the freight rate will increase and decrease within its range.
// As when the demand increases, the cheap and local versions become unavailable
// A manufacturer might have a relatively constant demand level for item inputs it uses in manufacturing.

// The quantity demanded at demand levels seems like it would change. Eg, it's more likely that someone needs a rush shipment 
// of a single fusion engine than they need 100 SCU of iron. 
// This could influence the priority of the job, eg, "LOW", "MEDIUM", "HIGH", "CRITICAL"

// What variables are we talking about here?
// Job priority - a reflection of how much a client is willing to pay to get the good delivered 
//   (possibly influencing the base rate?)
// Commodity demand - a reflection of the relative value of that good and how much more folks are willing to pay for it 
//   (influencing the price per kkm?)
// Commodity amount - The higher the total volume of commodity, I'm going to pay less per SCU than in a lower volume, because
//   the people shipping it can do it for much cheaper as they're shipping in bulk.
// Container sizes - smaller containers are less efficient, but if you're already paying for a rush, you don't care as much about
//   container inefficiency. Also, if you're only demanding a small shipment, you can't afford to pay for a large ship to come out.
//   Therefore, you probably want containers that can be hauled efficiently by the smaller ships.
//   For example, a Cutlass can only carry two 12 SCU containers (70% efficient), but can carry 32 1 SCU containers (42% efficient)
//   The 12 SCU containers have 16.84 SCU, while the 32 1 SCU containers have 13.44 SCU. Four 8 SCU containers can haul 21.4 SCU.
//   Two 16 SCU containers can haul 22.96 SCU, making that the most internal cargo a Cutlass can carry.

// The efficiency level of the containers suggests, inversely, the relative importance of getting the goods shipped.
// Eg, if I'm getting 1 SCU containers, I'm okay with a 30% loss of efficiency vs. the 16 SCU container which means I'm
// effectively paying a 30% premium already.

// ContractCommoditySchedule
//   Container size array - range of possible container sizes
//   Max priority bonus - anywhere from 0 to max based on the priority level of the shipment (fixed per SCU)
//   Price per kkm min-max - min-max of price per kkm

// ContractDestination
//   Contract priority min-max - the min and max priority ranges for wanting the good, which influence the max priority bonus
//   Contract demand min-max - the min and max demand levels (between 0 and 1) the destination wants, influencing price per kkm
//   Contract volume min-max - the min and max values that destination wants in SCU of the good per shipment, 
//     final value derived from intersection of priority and demand.

// Interim contract values: 
//   total scu (contract volume in range of (priority + demand / 2)) - or inverse priority?
//   container size (find volume value within volume range and pick that container size)
//   num containers (total scu / container size, ceiling)
//   price per kkm (pick from min-max in commodity schedule based on random destination demand value)
//   priority bonus (with 1.0 as max bonus, picked from destination range, from commodity schedule)
//   priority level (floating value determined from destination random priority value)
//   num jumps available (expires) is inverse with the priority rating

// Final contract values: num containers, scu per container, price per kkm, base price per scu, expires

// Notes on pricing: min distance is 60kkm, max is 680kkm, avg is 225kkm.
// A ship is anywhere from 20000 to 340000.
// Ships should generally be 'purchased' at 20% down, so anywhere from 2000 to 34000 credits.
// Players should be able to afford 22500 for a constellation down payment after how many 12 SCU trips in an aurora? 100?
// That gives 225 UEC for an average 12 SCU trip, of 225kkm (22.5 x kkm). 225 / 22.5 = 10 UEC. 10 UEC / 12 SCU = 0.83 UEC/SCU/kkm
// Perhaps the rates should move from per kkm to per kkm?
// Is this the payout before fees are deducted? Ideally, profit minus fees is something reasonable, but the gross profit is exciting.

// 1 SCU (1x1x1), 0.42 SCU internal (42%)
// 2 SCU (2x1x1), 0.98 SCU internal (49%)
// 4 SCU (2x2x1), 2.29 SCU internal (57%)
// 8 SCU (2x2x2), 5.35 SCU internal (67%)
// 12 SCU (2x2x3), 8.42 SCU internal (70%)
// 16 SCU (2x2x4), 11.48 SCU internal (72%)
// 20 SCU (2x2x5), 14.54 SCU internal (73%)
// 27 SCU (3x3x3), 20.79 SCU internal (77%)
// 64 SCU (4x4x4), 52.73 SCU internal (82%)

var contract = require('./contract');
var port = require('./port');
var shiptype = require('./shiptype');
var shipcontact = require('./shipcontact');
var random = require('./random');

function MetaContractEmployer(id, name, commodity_schedule_ids, demand_schedule_ids) {
	this.id = id;
	this.name = name;
	this.commodity_schedule_ids = commodity_schedule_ids;
	this.demand_schedule_ids = demand_schedule_ids;
}

function MetaContractLocation(id, name, sub_locations) {
	this.id = id;
	this.name = name;
	this.sub_locations = sub_locations;
}

function MetaContractSubLocation(quantum_id, type, port_id) {
	this.quantum_id = quantum_id;
	this.type = type;
	this.port_id = port_id;
}

var _meta_contract_employers = {
	drake: new MetaContractEmployer("drake", "Drake Interplanetary",
		[
			"caterpillar_parts_from_borea"
		],
		[
			"ship_guns_qcl_to_borea",
			"ship_guns_elec_to_borea"
		]
	),
	hurston: new MetaContractEmployer("hurston", "Drake Interplanetary",
		[
			"ship_guns_qcl_from_hurston",
			"ship_guns_elec_from_hurston"
		],
		[]
	),
	cryastro: new MetaContractEmployer("cryastro", "Cry-Astro Service",
		[
			"ship_scrap_from_cryastro",
		],
		[
			"hydrogen_fuel_to_cryastro",
			"caterpillar_parts_to_cryastro",
			"ship_guns_qcl_to_cryastro",
			"ship_guns_elec_to_cryastro"
		]
	),
	dumpers_depot: new MetaContractEmployer("dumpers_depot", "Dumper\'s Depot",
		[],
		[
			"ship_guns_qcl_to_port_olisar",
			"ship_guns_elec_to_port_olisar",
			"ship_scrap_to_port_olisar"
		]

	),
}

// Producers of commodities
var _meta_contract_commodity_schedules = {
	caterpillar_parts_from_borea: {
		commodity_id: "caterpillar_parts_from_borea",
		origin_ids: ["loc_borea", "loc_olisar"],
		origin_ships: "ships_drake",
		demand_schedule_ids: ["caterpillar_parts_to_cryastro"],
		container_sizes: [4, 8, 16],
		max_base_rate_per_scu: 15,
		min_rate_per_scu_per_100kkm: 9,
		max_rate_per_scu_per_100kkm: 15,
		min_ticks_available: 4,
		max_ticks_available: 6,
	},
	ship_guns_qcl_from_hurston: {
		commodity_id: "ship_guns_qcl_from_hurston",
		origin_ids: ["loc_hurston", "loc_olisar"],
		origin_ships: "ships_hurston",
		demand_schedule_ids: ["ship_guns_qcl_to_cryastro", "ship_guns_qcl_to_port_olisar", "ship_guns_qcl_to_borea"],
		container_sizes: [2, 4, 12],
		max_base_rate_per_scu: 25,
		min_rate_per_scu_per_100kkm: 6,
		max_rate_per_scu_per_100kkm: 12,
		min_ticks_available: 2,
		max_ticks_available: 7,
	},
	ship_guns_elec_from_hurston: {
		commodity_id: "ship_guns_elec_from_hurston",
		origin_ids: ["loc_hurston", "loc_olisar"],
		origin_ships: "ships_hurston",
		demand_schedule_ids: ["ship_guns_elec_to_cryastro", "ship_guns_elec_to_port_olisar", "ship_guns_elec_to_borea"],
		container_sizes: [8],
		max_base_rate_per_scu: 30,
		min_rate_per_scu_per_100kkm: 8,
		max_rate_per_scu_per_100kkm: 16,
		min_ticks_available: 1,
		max_ticks_available: 5,
	},
	hydrogen_fuel_from_crusader: {
		commodity_id: "hydrogen_fuel_from_crusader",
		origin_ids: ["loc_olisar"],
		origin_ships: "ships_crusader", // TODO: Implement
		demand_schedule_ids: ["hydrogen_fuel_to_cryastro"],
		container_sizes: [8, 16],
		max_base_rate_per_scu: 20,
		min_rate_per_scu_per_100kkm: 3,
		max_rate_per_scu_per_100kkm: 8,
		min_ticks_available: 5,
		max_ticks_available: 10,
	},
	ship_scrap_from_cryastro: {
		commodity_id: "ship_scrap_from_cryastro",
		origin_ids: ["loc_cryastro"],
		origin_ships: "ships_cryastro",
		demand_schedule_ids: ["ship_scrap_to_port_olisar"],
		container_sizes: [1,2,4,20],
		max_base_rate_per_scu: 10,
		min_rate_per_scu_per_100kkm: 5,
		max_rate_per_scu_per_100kkm: 10,
		min_ticks_available: 3,
		max_ticks_available: 8,
	},
}

// Consumers of commodities
var _meta_contract_demand_schedules = {
	caterpillar_parts_to_cryastro: {
		commodity_schedule_ids: ["caterpillar_parts_from_borea"],
		destination_ids: ["loc_cryastro"],
		destination_ships: "ships_cryastro",
		priority_min: 0,
		priority_max: 1.0,
		demand_min: 0,
		demand_max: 0.5,
		scu_min: 24,
		scu_max: 64
	},
	ship_guns_qcl_to_cryastro: {
		commodity_schedule_ids: ["ship_guns_qcl_from_hurston"],
		destination_ids: ["loc_cryastro"],
		destination_ships: "ships_cryastro",
		priority_min: 0,
		priority_max: 1.0,
		demand_min: 0,
		demand_max: 0.5,
		scu_min: 12,
		scu_max: 36
	},
	ship_guns_qcl_to_port_olisar: {
		commodity_schedule_ids: ["ship_guns_qcl_from_hurston"],
		destination_ids: ["loc_olisar"],
		destination_ships: "ships_crusader",
		priority_min: 0,
		priority_max: 0.5,
		demand_min: 0.75,
		demand_max: 1.0,
		scu_min: 2,
		scu_max: 16
	},
	ship_guns_qcl_to_borea: {
		commodity_schedule_ids: ["ship_guns_qcl_from_hurston"],
		destination_ids: ["loc_borea", "loc_olisar"],
		destination_ships: "ships_drake",
		priority_min: 0,
		priority_max: 0.75,
		demand_min: 0,
		demand_max: 1.0,
		scu_min: 40,
		scu_max: 120
	},
	ship_guns_elec_to_cryastro: {
		commodity_schedule_ids: ["ship_guns_elec_from_hurston"],
		destination_ids: ["loc_cryastro"],
		destination_ships: "ships_cryastro",
		priority_min: 0,
		priority_max: 1.0,
		demand_min: 0,
		demand_max: 0.5,
		scu_min: 20,
		scu_max: 40
	},
	ship_guns_elec_to_port_olisar: {
		commodity_schedule_ids: ["ship_guns_elec_from_hurston"],
		destination_ids: ["loc_olisar"],
		destination_ships: "ships_crusader",
		priority_min: 0,
		priority_max: 0.5,
		demand_min: 0.75,
		demand_max: 1.0,
		scu_min: 6,
		scu_max: 32
	},
	ship_guns_elec_to_borea: {
		commodity_schedule_ids: ["ship_guns_elec_from_hurston"],
		destination_ids: ["loc_borea", "loc_olisar"],
		destination_ships: "ships_drake",
		priority_min: 0,
		priority_max: 0.75,
		demand_min: 0,
		demand_max: 1.0,
		scu_min: 50,
		scu_max: 100
	},
	hydrogen_fuel_to_cryastro: {
		commodity_schedule_ids: ["hydrogen_fuel_from_crusader"],
		destination_ids: ["loc_cryastro"],
		destination_ships: "ships_cryastro",
		priority_min: 0.25,
		priority_max: 0.75,
		demand_min: 0,
		demand_max: 0.5,
		scu_min: 40,
		scu_max: 300
	},
	ship_scrap_to_port_olisar: {
		commodity_schedule_ids: ["ship_scrap_from_cryastro"],
		destination_ids: ["loc_olisar"],
		destination_ships: "ships_crusader",
		priority_min: 0,
		priority_max: 0.5,
		demand_min: 0,
		demand_max: 1.0,
		scu_min: 40,
		scu_max: 120
	},
}

var _meta_contract_locations = {
	loc_olisar: new MetaContractLocation("loc_olisar", "Port Olisar", 
			[
				new MetaContractSubLocation("port_olisar", "port", "port_olisar_strut_a"),
				new MetaContractSubLocation("port_olisar", "port", "port_olisar_strut_b"),
				new MetaContractSubLocation("port_olisar", "port", "port_olisar_strut_c"),
				new MetaContractSubLocation("port_olisar", "port", "port_olisar_strut_d")
			]
		),
	loc_kareah: new MetaContractLocation("loc_kareah", "Security Post Kareah",
			[
				new MetaContractSubLocation("kareah", "port", "kareah_pads")
			]
		),
	loc_covalex: new MetaContractLocation("loc_covalex", "Covalex Shipping Hub",
			[
				new MetaContractSubLocation("covalex", "shipcontact")
			]
		),
	loc_cryastro: new MetaContractLocation("loc_cryastro", "Cry-Astro Service",
			[
				new MetaContractSubLocation("cryastro42", "port", "cryastro42_pads"),
				new MetaContractSubLocation("cryastro151", "port", "cryastro151_pads"),
				new MetaContractSubLocation("cryastro262", "port", "cryastro262_pads")
			]
		),
	loc_hurston: new MetaContractLocation("loc_hurston", "Hurston (Stanton I)",
			[
				new MetaContractSubLocation("comm126", "shipcontact"),
				new MetaContractSubLocation("comm275", "shipcontact"),
				new MetaContractSubLocation("comm472", "shipcontact"),
			]
		),
	loc_borea: new MetaContractLocation("loc_borea", "Borea (Magnus II)",
			[
				new MetaContractSubLocation("comm306", "shipcontact"),
				new MetaContractSubLocation("comm126", "shipcontact"),
				new MetaContractSubLocation("comm730", "shipcontact"),
			]
		),
}

var _meta_contract_employer_shipcontacts = {
	ships_drake: {
		types: ["drak_cutlass_black", "drak_caterpillar"],
		name_prefixes: ["Adventure Galley", "Queen Anne\'s Revenge", "Whydah", "Royal Fortune", "Fancy", "Happy Delivery", "Golden Hind", "Rising Sun", "Speaker", "Revenge"],
		name_suffixes: ["II", "III", "IV", "V"]
	},
	ships_hurston: {
		types: ["rsi_aurora_cl", "rsi_constellation_andromeda"],
		name_prefixes: ["Marathon", "Syracuse", "Gaugamela", "Metaurus", "Teutoburg", "Chalons", "Tours", "Hastings", "Orleans", "Saratoga", "Valmy", "Waterloo"],
		name_suffixes: ["490", "413", "331", "207", "9", "451", "732", "1066", "1429", "1777", "1792", "1815"]
	},
	ships_cryastro: {
		types: ["misc_freelancer", "misc_starfarer"],
		name_prefixes: ["CA-1", "CA-42", "CA-103", "CA-445"],
		name_suffixes: ["Alpha", "Gamma", "Omega"]	
	},
}

var _generateContractForEmployerId = function(employer_id, tick) {
	_employer = Object.freeze(_meta_contract_employers[employer_id]);

	index = random.randomIntInRange(0, _employer.commodity_schedule_ids.length + _employer.demand_schedule_ids.length);

	if (index < _employer.commodity_schedule_ids.length) {
		var schedule_id = _employer.commodity_schedule_ids[index];
		return _generateContractFromEmployerAndCommoditySchedule(employer_id, tick, schedule_id);
	} else {
		var schedule_id = _employer.demand_schedule_ids[index - _employer.commodity_schedule_ids.length];
		return _generateContractFromEmployerAndDemandSchedule(employer_id, tick, schedule_id);
	}	
}

var _generateContractFromEmployerAndCommoditySchedule = function(employer_id, tick, commodity_schedule_id) {
	// console.log("\nGenerating " + employer_id + " contract " + commodity_schedule_id);
	_employer = Object.freeze(_meta_contract_employers[employer_id]);
	_commodity_schedule = Object.freeze(_meta_contract_commodity_schedules[commodity_schedule_id]);
	_demand_schedule_id = Object.freeze(random.randomElementFromArray(_commodity_schedule.demand_schedule_ids))
	return _generateContractFromEmployerAndScheduleIds(employer_id, tick, commodity_schedule_id, _demand_schedule_id)
}

var _generateContractFromEmployerAndDemandSchedule = function(employer_id, tick, demand_schedule_id) {
	// console.log("\nGenerating " + employer_id + " " + demand_schedule_id);
	_employer = Object.freeze(_meta_contract_employers[employer_id]);
	_demand_schedule = Object.freeze(_meta_contract_demand_schedules[demand_schedule_id]);
	_commodity_schedule_id = Object.freeze(random.randomElementFromArray(_demand_schedule.commodity_schedule_ids))
	return _generateContractFromEmployerAndScheduleIds(employer_id, tick, _commodity_schedule_id, demand_schedule_id)
}

var _generateContractFromEmployerAndScheduleIds = function(employer_id, tick, commodity_schedule_id, demand_schedule_id) {
	_employer = Object.freeze(_meta_contract_employers[employer_id]);
	_commodity_schedule = Object.freeze(_meta_contract_commodity_schedules[commodity_schedule_id]);
	_demand_schedule = Object.freeze(_meta_contract_demand_schedules[demand_schedule_id]);

	var _origin_id = null;
	var _destination_id = null;

	while ((_origin_id == null || _destination_id == null) || _origin_id == _destination_id) {
		_origin_id = random.randomElementFromArray(_commodity_schedule.origin_ids);
		_destination_id = random.randomElementFromArray(_demand_schedule.destination_ids);
		// console.log("Testing " + _origin_id + " to " + _destination_id);
	}

	_origin = Object.freeze(_meta_contract_locations[_origin_id]);
	_destination = Object.freeze(_meta_contract_locations[_destination_id]);

	// console.log("Creating contract from " + _origin.name + " to " + _destination.name);

	_demand = random.randomNumberInRange(_demand_schedule.demand_min, _demand_schedule.demand_max);
	_priority = random.randomNumberInRange(_demand_schedule.priority_min, _demand_schedule.priority_max);
	// TODO: vary with demand and priority
	_target_scu = random.randomNumberInRange(_demand_schedule.scu_min, _demand_schedule.scu_max);
	// TODO: vary with volume
	_container_size = random.randomElementFromArray(_commodity_schedule.container_sizes);
	_num_containers = Math.ceil(_target_scu / _container_size);
	_total_scu = _num_containers * _container_size;

	// derived
	_expires_delta = _commodity_schedule.max_ticks_available - _commodity_schedule.min_ticks_available;
	_expires = Math.floor(tick + _commodity_schedule.min_ticks_available + ((1.0 - _priority) * _expires_delta));
	
	_rate_delta = _commodity_schedule.max_rate_per_scu_per_100kkm - _commodity_schedule.min_rate_per_scu_per_100kkm;
	_rate_per_scu_per_100kkm = _commodity_schedule.min_rate_per_scu_per_100kkm + (_demand * _rate_delta);
	_base_rate_per_scu = random.randomIntInRange(0, _priority * _commodity_schedule.max_base_rate_per_scu);
	
	_pickup_sublocation = null;
	_dropoff_sublocation = null;

	while ((_pickup_sublocation == null || _dropoff_sublocation == null) || _pickup_sublocation.quantum_id == _dropoff_sublocation.quantum_id) {
		_pickup_sublocation = random.randomElementFromArray(_origin.sub_locations);
		_dropoff_sublocation = random.randomElementFromArray(_destination.sub_locations);
		// console.log("Testing " + _pickup_sublocation.quantum_id + " to " + _dropoff_sublocation.quantum_id);
	}
	// console.log("> Valid contract, " + _pickup_sublocation.quantum_id + " to " + _dropoff_sublocation.quantum_id);

	_pickup_quantum_id = _pickup_sublocation.quantum_id;
	_pickup_type = null;
	_pickup_id = null;
	var _pickup_ship_contact = null;
	if (_pickup_sublocation.type === "port") {
		_pickup_type ="port";
		_pickup_id = _pickup_sublocation.port_id;
	} else if (_pickup_sublocation.type === "shipcontact") {
		_pickup_type = "shipcontact";
		_pickup_ship_contact = _generateShipFromEmployerContactsId(_commodity_schedule.origin_ships, _pickup_quantum_id, 
			_total_scu, _origin.name, null);
		_pickup_id = _pickup_ship_contact.id;
	}

	_dropoff_quantum_id = _dropoff_sublocation.quantum_id;
	_dropoff_type = null;
	_dropoff_id = null;
	var _dropoff_ship_contact = null;
	if (_dropoff_sublocation.type === "port") {
		_dropoff_type ="port";
		_dropoff_id = _dropoff_sublocation.port_id;
	} else if (_dropoff_sublocation.type === "shipcontact") {
		_dropoff_type = "shipcontact";
		_dropoff_ship_contact = _generateShipFromEmployerContactsId(_demand_schedule.destination_ships, _dropoff_quantum_id, 
			_total_scu, null, _destination.name);
		_dropoff_id = _dropoff_ship_contact.id;
	}

	// console.log("Pickup " + _pickup_id + ", dropoff " + _dropoff_id);

	_contractdetails = new contract.ContractDetails(_employer.name, _origin.name, _destination.name,
		_rate_per_scu_per_100kkm, _base_rate_per_scu, _expires, _priority);
	_contractcargo = new contract.ContractCargo(_num_containers, _container_size, _commodity_schedule.commodity_id);
	_contractpickup = new contract.ContractPickup(_pickup_quantum_id, _pickup_type, _pickup_id);
	_contractdropoff = new contract.ContractDropoff(_dropoff_quantum_id, _dropoff_type, _dropoff_id);

	_contract = new contract.Contract(_contractdetails, _contractcargo, _contractpickup, _contractdropoff);

	// generate cargo

	_containers = _contract.generateCargo();

	if (_pickup_type == "port") {
		_port = port.portIdToLocation(_pickup_id);
		_containers.forEach(function(container) {
			_port.cargo.loadContainer(container);
		});
	} else if (_pickup_type == "shipcontact") {
		_containers.forEach(function(container) {
			_pickup_ship_contact.cargo.loadContainer(container);
		});
		shipcontact.setContractIdForShipContactId(_pickup_ship_contact.id, _contract.id);
	}

	if (_dropoff_type == "shipcontact") {
		shipcontact.setContractIdForShipContactId(_dropoff_ship_contact.id, _contract.id);
	}

	return _contract;
}

var _generateShipFromEmployerContactsId = function(employer_shipcontacts_id, quantum_id, min_scu, origin_string, destination_string) {
	_template = Object.freeze(_meta_contract_employer_shipcontacts[employer_shipcontacts_id]);

	// console.log("ship type ids: " + _template.types);

	var _ship_types = [];

	for (var i = _template.types.length - 1; i >= 0; i--) {
		_ship_types.push(shiptype.shipIdToShip(_template.types[i]));
	}

	_ship_types.sort(function(ship_a, ship_b) {
		return ship_a.cargo_hold_size - ship_b.cargo_hold_size;
	});

	// console.log("sorted ship types: " + _ship_types);

	var _ship_type_id = null;

	// Find the smallest possible ship that still holds the required cargo
	for (var i = _ship_types.length - 1; i >= 0 ; i--) {
		_ship_type = _ship_types[i];
		// console.log("Testing ship type " + _ship_type + " for " + min_scu + " SCU")
		if (_ship_type.cargo_hold_size > min_scu) {
			_ship_type_id = _ship_type.id;
		}
	}

	if (_ship_type_id == null) {
		console.log("Error, couldn't generate ship contact from " + employer_shipcontacts_id + " for " + min_scu + " SCU")
		return null;
	} else {
		// console.log("Found ship type " + _ship_type_id + " for " + min_scu + " SCU")
	}

	_name = random.randomElementFromArray(_template.name_prefixes) + " " + random.randomElementFromArray(_template.name_suffixes);

	_ship = new shipcontact.ShipContact(quantum_id, _ship_type_id, _name, origin_string, destination_string);

	// console.log("Generating ship " + _ship);
	shipcontact.addShipContact(_ship);
	return _ship;
}

module.exports = {
	generateContractForEmployerId: _generateContractForEmployerId
}
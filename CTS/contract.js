// contract.js

var quantum = require('./quantum')
var commodities = require('./commodities');
var container = require('./container');
var shipcontact = require('./shipcontact');
var port = require('./port');

var unique_contract_id = 0;
var _contract_ids = [];
var _contracts = {};

var PENALTY_MODIFIER = 2;

var _contractIdToContract = function(id) {
	return Object.freeze(_contracts[id]);
}

var _contractIdsToContracts = function(ids) {
	array = [];
	for (var i = ids.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_contracts[ids[i]]);
	};
	return array;
}

var generateContractId = function(pickupQuantumId, dropoffQuantumId) {
	var id_to_return = unique_contract_id;
	unique_contract_id = unique_contract_id + 1;
	return pickupQuantumId + "_" + dropoffQuantumId + "_" + id_to_return;
}

function Contract(details, cargo, pickup, dropoff) {
	this.id = generateContractId(pickup.quantum_location.id, dropoff.quantum_location.id);
	this.details = details;
	this.cargo = cargo;
	this.pickup = pickup;
	this.dropoff = dropoff;
	_contract_ids.push(this.id);
	_contracts[this.id] = this;
} 

Contract.prototype.toString = function() {
	return this.cargo.totalSCU() + " SCU, " + this.pickup.quantum_location.display_name + 
		" to " + this.dropoff.quantum_location.display_name + " (" + this.totalPayout() + " UEC, " + 
		this.details.priorityString() +")";
}

Contract.prototype.toDetailsString = function(isAccepted) {
	return "" +
	"Employer: " + this.details.employer + "\n" +
	"Cargo origin: " + this.details.origin + "\n" +
	"Cargo destination: " + this.details.destination + "\n" +
	"Priority: " + this.details.priorityString() + "\n" +
	"Payout: " + this.totalPayout() + " UEC\n\n" +

	"Cargo: " + this.cargo + "\n" + 
	"Cargo Volume: " + this.cargo.toVolumeString() + "\n" + 
	"Pickup: " + this.pickup.pickupContactOrLocation + " at " + this.pickup.quantum_location + "\n" +
	(isAccepted ? "Remaining: " + this.scuRemaining() + "/" + this.cargo.totalSCU() + " SCU\n" : "") +
	"Dropoff: " + this.dropoff.dropoffContactOrLocation + " at " + this.dropoff.quantum_location +
	(isAccepted ? "\nDelivered: " + this.scuDelivered() + "/" + this.cargo.totalSCU() + " SCU" : "");
}


Contract.prototype.distanceInKm = function() {
	if (this.pickup.quantum_location.id === this.dropoff.quantum_location.id) {
		return 0;
	} else {
		return this.pickup.quantum_location.quantumDestinationById(this.dropoff.quantum_location.id).distance_km;
	}
}

Contract.prototype.totalPayout = function() {
	return Math.ceil(this.payoutPerSCU() * this.cargo.totalSCU());
}

Contract.prototype.payoutPerSCU = function() {
	var distance100kkm = this.distanceInKm() / 100000;

	return this.details.base_rate_per_scu + (distance100kkm * this.details.rate_per_scu_per_100kkm);
}

Contract.prototype.payoutPerSCUBase = function() {
	return this.details.base_rate_per_scu;
}

Contract.prototype.payoutPerSCUDistanceOnly = function() {
	var distance100kkm = this.distanceInKm() / 100000;

	return distance100kkm * this.details.rate_per_scu_per_100kkm;
}

Contract.prototype.penaltyPerSCU = function() {
	return PENALTY_MODIFIER * this.payoutPerSCU();
}

Contract.prototype.completionPayout = function() {
	return Math.ceil(this.payoutPerSCU() * this.scuDelivered());
}

Contract.prototype.abandonedPayout = function() {
	return Math.ceil(this.payoutPerSCUDistanceOnly() * this.scuDelivered());
}

Contract.prototype.lostSCUPenalty = function() {
	return Math.ceil(this.penaltyPerSCU() * this.scuLost());
}

Contract.prototype.generateCargo = function() {
	containers = [];

	for (var i = 0; i < this.cargo.num_containers; i++) {
		containers.push(new container.Container(this.cargo.commodity_id, this.cargo.container_size, this.id));
	}

	return Object.freeze(containers);
}

Contract.prototype.scuRemaining = function() {
	var cargo;

	if (this.pickup.pickup_type == "shipcontact") {
		cargo = this.pickup.pickupContactOrLocation.cargo;
	} else if (this.pickup.pickup_type == "port") {
		cargo = this.pickup.pickupContactOrLocation.cargo;
	}

	var cargoGroup = cargo.containerGroupForContractId(this.id);

	return cargoGroup.groupedCargoSize();
}

Contract.prototype.scuDelivered = function() {
	var cargo;

	if (this.dropoff.dropoff_type == "shipcontact") {
		cargo = this.dropoff.dropoffContactOrLocation.cargo;
	} else if (this.dropoff.dropoff_type == "port") {
		cargo = this.dropoff.dropoffContactOrLocation.cargo;
	}

	var cargoGroup = cargo.containerGroupForContractId(this.id);

	return cargoGroup.groupedCargoSize();
}

Contract.prototype.scuLost = function() {
	return this.cargo.totalSCU() - (this.scuDelivered() + this.scuRemaining());
}

Contract.prototype.canBeCompleted = function() {
	return this.scuRemaining() == 0 && this.scuDelivered() > 0;
}

function ContractDetails(employer, origin, destination, rate_per_scu_per_100kkm, base_rate_per_scu, expireTick, priority) {
	this.employer = employer;
	this.origin = origin;
	this.destination = destination;
	this.rate_per_scu_per_100kkm = rate_per_scu_per_100kkm;
	this.base_rate_per_scu = base_rate_per_scu;
	this.expireTick = expireTick;
	this.priority = priority;
}

ContractDetails.prototype.toString = function() {
	return this.employer;
}

ContractDetails.prototype.priorityString = function() {
	if (this.priority < 0.25) {
		return "LOW";
	} else if (this.priority < 0.5) {
		return "MEDIUM";
	} else if (this.priority < 0.75) {
		return "HIGH";
	} else {
		return "CRITICAL";
	}
}

function ContractCargo(num_containers, container_size, commodity_id) {
	this.num_containers = num_containers;
	this.container_size = container_size;
	this.commodity_id = commodity_id;
}

ContractCargo.prototype.toString = function() {
	_commodity = commodities.commodityIdToCommodity(this.commodity_id);
	return _commodity.display_name + " (" + _commodity.manufacturer_name + ")";
}

ContractCargo.prototype.toVolumeString = function() {
	return this.totalSCU() + " SCU (" + this.num_containers + " x " + this.container_size + " SCU containers)";
}

ContractCargo.prototype.totalSCU = function() {
	return this.num_containers * this.container_size;
}

function ContractPickup(quantum_location_id, pickup_type, pickup_id) {
	this.quantum_location = quantum.quantumIdToLocation(quantum_location_id);
	this.pickup_type = pickup_type;
	if (pickup_type == "shipcontact") {
		this.pickupContactOrLocation = shipcontact.shipContactIdToShipContact(pickup_id);
	} else if (pickup_type == "port") {
		this.pickupContactOrLocation = port.portIdToLocation(pickup_id);
	}
}

ContractPickup.prototype.toString = function() {
	return this.pickupContactOrLocation + " - " + this.quantum_location;
}

function ContractDropoff(quantum_location_id, dropoff_type, dropoff_id) {
	this.quantum_location = quantum.quantumIdToLocation(quantum_location_id);
	this.dropoff_type = dropoff_type;
	if (dropoff_type == "shipcontact") {
		this.dropoffContactOrLocation = shipcontact.shipContactIdToShipContact(dropoff_id);
	} else if (dropoff_type == "port") {
		this.dropoffContactOrLocation = port.portIdToLocation(dropoff_id);
	}
}

ContractDropoff.prototype.toString = function() {
	return this.dropoffContactOrLocation + " - " + this.quantum_location;
}

module.exports = {
	Contract: Contract,
	ContractPickup: ContractPickup,
	ContractDropoff: ContractDropoff,
	ContractCargo: ContractCargo,
	ContractDetails: ContractDetails,
	contractIdToContract: _contractIdToContract,
	contractIdsToContracts: _contractIdsToContracts,
}

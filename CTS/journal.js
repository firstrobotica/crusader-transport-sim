// journal.js

var contract = require('./contract');

function Journal() {
	this.credits = 0;
	this.tick = 0;
	this.accepted_contract_ids = [];
	this.abandoned_contract_ids = [];
	this.completed_contract_ids = [];
	this.rendezvous = {};
}

Journal.prototype.incrementTick = function() {
	this.tick = this.tick + 1;
}

Journal.prototype.getTick = function() {
	return this.tick;
}

Journal.prototype.clearRendezvous = function() {
	this.rendezvous = {};
}

Journal.prototype.addRendezvous = function(rendezvous) {
	if (!this.hasRendezvous(rendezvous.shipcontact_id)) {
		this.rendezvous[rendezvous.shipcontact_id] = rendezvous;
	}
}

Journal.prototype.hasRendezvous = function(shipcontact_id) {
	return this.rendezvous.hasOwnProperty(shipcontact_id);
}

Journal.prototype.getRendezvous = function(shipcontact_id) {
	return this.rendezvous[shipcontact_id];
}

Journal.prototype.addCredits = function(creditsToAdd) {
	this.credits = this.credits + creditsToAdd;
}

Journal.prototype.removeCredits = function(creditsToRemove) {
	if (this.credits >= creditsToRemove) {
		this.credits = this.credits - creditsToRemove;
		return true;
	} else {
		this.credits = 0;
		return false;
	}
}

Journal.prototype.getCredits = function() {
	return this.credits;
}

Journal.prototype.acceptContractId = function(contractId) {
	if (!this.contractIdIsAccepted(contractId) && 
		!this.contractIdIsAbandoned(contractId) &&
		!this.contractIdIsCompleted(contractId)) {
		this.accepted_contract_ids.push(contractId);
		return true;
	} else {
		return false;
	}
}

Journal.prototype.abandonContractId = function(contractId) {
	if (this.contractIdIsAccepted(contractId)) {
		this.accepted_contract_ids.splice(this.accepted_contract_ids.indexOf(contractId), 1);
		this.abandoned_contract_ids.push(contractId);
		return true;
	} else {
		return false;
	}
}

Journal.prototype.completeContractId = function(contractId) {
	if (this.contractIdIsAccepted(contractId)) {
		this.accepted_contract_ids.splice(this.accepted_contract_ids.indexOf(contractId), 1);
		this.completed_contract_ids.push(contractId);
		return true;
	} else {
		return false;
	}
}

Journal.prototype.acceptedContractIds = function() {
	return Array.from(this.accepted_contract_ids);
}

Journal.prototype.acceptedContracts = function() {
	return contract.contractIdsToContracts(this.accepted_contract_ids);
}

Journal.prototype.abandonedContracts = function() {
	return contract.contractIdsToContracts(this.abandoned_contract_ids);
}

Journal.prototype.completedContracts = function() {
	return contract.contractIdsToContracts(this.completed_contract_ids);
}

Journal.prototype.contractIdIsAccepted = function(contract_id) {
	return this.acceptedContracts().some(function(_contract) {
		if (_contract.id === contract_id) {
			return true;
		}
	});
}

Journal.prototype.contractIdIsAbandoned = function(contract_id) {
	return this.abandonedContracts().some(function(_contract) {
		if (_contract.id === contract_id) {
			return true;
		}
	});
}

Journal.prototype.contractIdIsCompleted = function(contract_id) {
	return this.completedContracts().some(function(_contract) {
		if (_contract.id === contract_id) {
			return true;
		}
	});
}

module.exports = {
	Journal: Journal,
}
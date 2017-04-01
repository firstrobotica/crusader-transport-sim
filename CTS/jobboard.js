// jobboard.js

var contract = require('./contract');

function JobBoard(id, max_contracts, employer_ids) {
	this.id = id;
	this.max_contracts = max_contracts;
	this.employer_ids = employer_ids;
	this.available_contract_ids = [];
}

JobBoard.prototype.numContracts = function() {
	return this.available_contract_ids.length;
}

JobBoard.prototype.needsContracts = function() {
	if (this.numContracts() < this.max_contracts / 2) {
		return this.max_contracts - this.numContracts();
	} else {
		return 0;
	}
}

JobBoard.prototype.expireContracts = function(tick) {
	var contractIdsToRemove = [];

	// console.log("Contracts: " + this.available_contract_ids);

	for (var i = 0; i < this.available_contract_ids.length; i++) {
		var _contract = contract.contractIdToContract(this.available_contract_ids[i]);
		// console.log('Testing contract' + _contract + " at tick " + _contract.details.expireTick + " against " + tick);
		if (_contract.details.expireTick < tick) {
			contractIdsToRemove.push(_contract.id);
			// console.log("Expiring contract " + contract);
		}
	}

	for (var i = 0; i < contractIdsToRemove.length; i++) {
		this.removeContractId(contractIdsToRemove[i]);
	}

	// console.log("Expired " + contractIdsToRemove.length + " contracts from " + this.id);
	// console.log("Updated contracts: " + this.available_contract_ids);
}

JobBoard.prototype.addContractId = function(contractId) {
	if (!this.isContractIdInJobBoard(contractId) && this.canAddContractId()) {
		this.available_contract_ids.push(contractId);
		return true;
	} else {
		return false;
	}
}

JobBoard.prototype.removeContractId = function(contractId) {
	if (this.isContractIdInJobBoard(contractId)) {
		this.available_contract_ids.splice(this.available_contract_ids.indexOf(contractId), 1);
		return true;
	} else {
		return false;
	}
}

JobBoard.prototype.isContractIdInJobBoard = function(contractId) {
	return this.allContracts().some(function(_contract) {
		if (_contract.id === contractId) {
			return true;
		}
	});
}

JobBoard.prototype.allContracts = function() {
	return contract.contractIdsToContracts(this.available_contract_ids);
}

JobBoard.prototype.canAddContractId = function() {
	return this.available_contract_ids.length < (this.max_contracts);
}

var _job_boards = {
	port_olisar_jobboard: new JobBoard("port_olisar_jobboard", 5, ["drake", "hurston", "cryastro", "dumpers_depot"]),
	kareah_jobboard: new JobBoard("kareah_jobboard", 0, []),
	grimhex_jobboard: new JobBoard("grimhex_jobboard", 0, []),
	cryastro_jobboard: new JobBoard("cryastro_jobboard", 3, ["cryastro"]),
}

var _job_board_ids = [];

for (var jobBoard in _job_boards) {
	if (_job_boards.hasOwnProperty(jobBoard)) {
		_job_board_ids.push(jobBoard.id)
	}
}

var _jobBoardIdToJobBoard = function(jobBoardId) {
	return Object.freeze(_job_boards[jobBoardId]);
}

var _jobBoardIdsToJobBoards = function(jobBoardIds) {
	array = [];
	for (var i = jobBoardIds.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_job_boards[jobBoardIds[i]]);
	};
	return array;
}

module.exports = {
	JobBoard: JobBoard,
	jobBoardIdToJobBoard: _jobBoardIdToJobBoard,
	jobBoardIdsToJobBoards: _jobBoardIdsToJobBoards,
}
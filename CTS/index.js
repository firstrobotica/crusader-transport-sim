// index.js

var data = require('./data');
var map = require('./map');
var quantum = require('./quantum');
var shiptype = require('./shiptype');
var shipcontact = require('./shipcontact');
var port = require('./port');
var jobboard = require('./jobboard');
var landingPad = require('./landingpad');
var menu = require('./menu');
var container = require('./container');
var commodities = require('./commodities');
var contract = require('./contract');
var metacontract = require('./metacontract');
var cargohold = require('./cargohold');
var sleep = require('sleep');
var readlineSync = require('readline-sync');

var clearScreen = function() {
	for (var i = 0; i < 22; i++) {
		console.log('');
	};
	console.log('------------------');
}

var displayTimeout = function(times) {
	for (var i = 0; i < times; i++) {
		console.log('.');
		sleep.msleep(750);
	}
}

var travelToDestination = function(destination) {
	if (destination.type == "quantum") {
		quantumTravelWithMap(data.player.destination.id);
		incrementTick();
		data.player.destination = null;
	} else if (destination.type == "landingpad") {
		if (data.ship.landing_pad_location_id != null) {
			takeOff(destination.id);
			data.player.destination = null;
		} else {
			landAt(destination.id);
		}
	} else if (data.player.destination.type == "shipcontact") {
		if (data.ship.docked_shipcontact_id != null) {
			undockFrom(destination.id);
			data.player.destination = null;
		} else {
			dockTo(destination.id);
		}
	} else if (data.player.destination.type == "rendezvous") {
		rendezvousWith(destination);
	}
}

var quantumTravel = function(locationId) {
	console.log('------------------');
	console.log('Traveling to ' + quantum.quantumIdToLocation(locationId))
	displayTimeout(3);
	data.player.quantum_location_id = locationId;
	data.ship.quantum_location_id = locationId;
}

var landAt = function(locationId) {
	console.log('------------------');
	console.log('Landing at ' + landingPad.landingPadIdToLocation(locationId))
	displayTimeout(3);
	data.ship.landing_pad_location_id = locationId;
}

var takeOff = function(locationId) {
	console.log('------------------');
	console.log('Taking off from ' + landingPad.landingPadIdToLocation(locationId))
	displayTimeout(3);
	data.ship.landing_pad_location_id = null;
}

var dockTo = function(shipContactId) {
	console.log('------------------');
	console.log('Docking with ' + shipcontact.shipContactIdToShipContact(shipContactId))
	displayTimeout(3);
	data.ship.docked_shipcontact_id = shipContactId;
}

var undockFrom = function(shipContactId) {
	console.log('------------------');
	console.log('Undocking from ' + shipcontact.shipContactIdToShipContact(shipContactId))
	displayTimeout(3);
	data.ship.docked_shipcontact_id = null;
}

var rendezvousWith = function(rendezvous) {
	var rendezvousQuantumLocation = quantum.quantumIdToLocation(rendezvous.quantum_destination_id);

	console.log('------------------');
	var distance_current = readlineSync.questionInt("Enter the distance (in km) to " + rendezvousQuantumLocation + ": ", {limit: '$<0-9>'});

	var distance_from_rendezvous = Math.abs(distance_current - rendezvous.distance_from_dest);

	if (distance_from_rendezvous > 5) {
		console.log('------------------');
		console.log('Cannot rendezvous with ' + shipcontact.shipContactIdToShipContact(rendezvous.shipcontact_id) + ".\nYou must be 5km or less from the rendezvous point.")
		displayTimeout(3);
	} else {
		setDestination(shipcontact.shipContactIdToShipContact(rendezvous.shipcontact_id).shipContactDestination);
		console.log('------------------');
		console.log('Ready to dock with ' + shipcontact.shipContactIdToShipContact(rendezvous.shipcontact_id))
		displayTimeout(3);
	}
}

var quantumTravelWithMap = function(locationId) {
	console.log('------------------');
	console.log('Traveling to ' + quantum.quantumIdToLocation(locationId))
	displayTimeout(3);
	clearScreen();
	map.showMap(data.player.quantum_location_id);
	sleep.msleep(500);
	clearScreen();
	map.showMap("");
	sleep.msleep(500);
	clearScreen();
	map.showMap(data.player.quantum_location_id);
	sleep.msleep(500);
	clearScreen();
	map.showMap("");
	sleep.msleep(500);
	clearScreen();
	map.showMap(data.player.quantum_location_id);
	sleep.msleep(250);
	clearScreen();
	map.showMap("");
	sleep.msleep(250);
	clearScreen();
	map.showMap(data.player.quantum_location_id);
	sleep.msleep(250);
	clearScreen();
	map.showMap("");
	sleep.msleep(250);
	clearScreen();
	map.showMap(data.player.quantum_location_id);
	sleep.msleep(250);
	clearScreen();
	map.showMap("");
	sleep.msleep(750);
	clearScreen();
	map.showMap(locationId);
	sleep.msleep(500);
	clearScreen();
	map.showMap("");
	sleep.msleep(500);
	clearScreen();
	map.showMap(locationId);
	data.player.quantum_location_id = locationId;
	data.ship.quantum_location_id = locationId;
	sleep.msleep(500);
	readlineSync.keyInPause();
}

var setDestination = function(quantumDestination) {
	data.player.destination = quantumDestination;
}

var incrementTick = function() {
	data.player.journal.incrementTick();

	var jobboardIds = ["port_olisar_jobboard", "cryastro_jobboard"];

	var employerIds = ["drake", "hurston", "cryastro", "dumpers_depot"];

	jobboardIds.forEach(function(jobboardId) {
		var board = jobboard.jobBoardIdToJobBoard(jobboardId);

		board.expireContracts(data.player.journal.getTick());

		var numContractsToAdd = board.needsContracts();

		if (numContractsToAdd > 0) {
			for (var i = 0; i < numContractsToAdd; i++) {
				var _contract = metacontract.generateContractForEmployerId(board.employer_ids[Math.floor(Math.random()*board.employer_ids.length)], data.player.journal.getTick());
				board.addContractId(_contract.id);
			}
			// console.log("Added " + numContractsToAdd + " contracts to " + jobboardId);
		}
	});
}

// 'In Space' option
var menuSpace = function() {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('Your ship: ' + data.ship.name + ', ' + shiptype.shipIdToShip(data.ship.id).manufacturer_name + ' ' + shiptype.shipIdToShip(data.ship.id).display_name)
	console.log('Your credits: ' + data.player.journal.getCredits() + " UEC");

	var choices = [];

	choices.push(menu.ship_comms);
	choices.push(menu.ship_navigation);
	choices.push(menu.ship_contracts);
	choices.push(menu.ship_cargo);

	var travelActive = false;

	if (data.player.destination != null) {
		travelActive = true;
		if (data.player.destination.type == "quantum") {
			destinationId = data.player.destination.id;
			quantumLocation = quantum.quantumIdToLocation(destinationId);
			choices.push(new menu.Menu("menu_destination", "Quantum Travel to " + quantumLocation.display_name));

			console.log('Your destination: ' + data.player.destination)
		} else if (data.player.destination.type == "landingpad") {
			if (data.ship.landing_pad_location_id != null) {
				destinationId = data.player.destination.id;
				landingPadLocation = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
				choices.push(new menu.Menu("menu_destination", "Take off from " + landingPadLocation.display_name));
				console.log('Landed at: ' + landingPadLocation.display_name)
			} else {
				destinationId = data.player.destination.id;
				landingPadLocation = landingPad.landingPadIdToLocation(destinationId);
				choices.push(new menu.Menu("menu_destination", "Land at " + landingPadLocation.display_name));
				console.log('Your destination: ' + data.player.destination)
			}
		} else if (data.player.destination.type == "shipcontact") {
			if (data.ship.docked_shipcontact_id != null) {
				destinationId = data.player.destination.id;
				selectedShipContact = shipcontact.shipContactIdToShipContact(data.ship.docked_shipcontact_id);
				choices.push(new menu.Menu("menu_destination", "Undock from " + selectedShipContact));
				console.log('Docked to: ' + selectedShipContact)
			} else {
				destinationId = data.player.destination.id;
				selectedShipContact = shipcontact.shipContactIdToShipContact(destinationId);
				choices.push(new menu.Menu("menu_destination", "Dock with " + selectedShipContact));
				console.log('Your target: ' + data.player.destination)
			}
		} else if (data.player.destination.type == "rendezvous") {
				rendezvous = data.player.destination;
				selectedShipContact = shipcontact.shipContactIdToShipContact(rendezvous.shipcontact_id);
				choices.push(new menu.Menu("menu_destination", "Rendezvous with " + selectedShipContact));
				console.log('Rendezvous: ' + rendezvous)
		}
	} else {
		console.log('Your destination: None')
	}
	
	var index = readlineSync.keyInSelect(choices, 'Select a menu option ', {cancel:'Exit', guide:false});
	if (index == -1) {
		confirmExit = readlineSync.keyInYNStrict("Exit?", {guide:true})
		if (confirmExit) {
			looping = false;
		}
	} else if (choices[index].id == "menu_destination") {
		if (travelActive) {
			travelToDestination(data.player.destination);
		}
	} else {
		pushMenu(choices[index])
	}
}

// Comms option
var menuComms = function() {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Comms:');

	shipcontacts = shipcontact.shipContactsForQuantumLocationId(data.player.quantum_location_id);

	var choices = null;

	if (shipcontacts.length == 0) {
		choices = ["[No contacts]"];
	} else {
		choices = shipcontacts;
	}

	var index = readlineSync.keyInSelect(choices, 'Select a contact ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (shipcontacts.length == 0) {
			popMenu();
		} else {
			console.log('------------------');
			console.log('No response from ' + choices[index].name);
			displayTimeout(3);
			popMenu();
		}
	}
}

// Navigation option
var menuNavigation = function() {
	location = quantum.quantumIdToLocation(data.player.quantum_location_id);
	console.log('Your location: ' + location);
	console.log('');
	console.log('Navigation:');
	var choices = [];

	shipcontacts = shipcontact.shipContactsForQuantumLocationId(data.player.quantum_location_id);

	shipcontacts_filtered = shipcontacts.filter(function(_shipcontact) {
		if (shipcontact.hasContractIdForShipContactId(_shipcontact.id)) {
			return data.player.journal.contractIdIsAccepted(shipcontact.getContractIdForShipContactId(_shipcontact.id));
		} else {
			return false;
		}
	});

	if (shipcontacts_filtered.length > 0) {
		for (var i = shipcontacts_filtered.length - 1; i >= 0; i--) {
			var rendezvous;
			if (data.player.journal.hasRendezvous(shipcontacts_filtered[i].id)) {
				rendezvous = data.player.journal.getRendezvous(shipcontacts_filtered[i].id);
			} else {
				rendezvous = location.rendezvousDestinationForShipContact(shipcontacts_filtered[i].id);
				data.player.journal.addRendezvous(rendezvous);
			}
			choices = choices.concat(rendezvous);
		}
	}

	if (location.portDestinations().length > 0) {
		if (location.portDestinations().length == 1) {
			portDestination = location.portDestinations()[0];
			portLocation = port.portIdToLocation(portDestination.id)
			choices = choices.concat(new menu.Menu("ship_navigation_landing_pad_destinations", portLocation.display_name));
		} else {
			choices = choices.concat(new menu.Menu("ship_navigation_port_destinations", location.display_name + ' [...]'));
		}
	}

	choices = choices.concat([menu.ship_navigation_map, menu.ship_navigation_quantum]);

	if (data.player.destination != null && !data.ship.isDocked() && !data.ship.isLanded()) {
		choices.push(menu.ship_navigation_clear);
	}

	var index = readlineSync.keyInSelect(choices, 'Select a navigation option ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else if (choices[index].id == menu.ship_navigation_map.id || choices[index].id == menu.ship_navigation_quantum.id) {
		pushMenu(choices[index])
	} else if (choices[index].id == menu.ship_navigation_port_destinations.id) {
		pushMenu(menu.ship_navigation_port_destinations, location)
	} else if (choices[index].id == menu.ship_navigation_landing_pad_destinations.id) {
		pushMenu(menu.ship_navigation_landing_pad_destinations, location.portDestinations()[0])
	} else if (choices[index].id == menu.ship_navigation_clear.id) {	
		if (!data.ship.isDocked() && !data.ship.isLanded()) {
			data.player.destination = null;
		}
		popMenuTo(menu.ship);
	} else {
		if (data.ship.isLanded()) {
			console.log('------------------');
			console.log('Cannot rendezvous with ' + shipcontact.shipContactIdToShipContact(choices[index].shipcontact_id).name + ", ship is landed.");
			displayTimeout(3);
			clearScreen();
			popMenuTo(menu.ship);
		} else if (data.ship.isDocked()) {
			console.log('------------------');
			if (choices[index].shipcontact_id == data.ship.docked_shipcontact_id) {
				console.log('Already docked with ' + shipcontact.shipContactIdToShipContact(choices[index].shipcontact_id).name);
			} else {
				console.log('Cannot rendezvous with ' + shipcontact.shipContactIdToShipContact(choices[index].shipcontact_id).name + ", ship is docked.");
			}
			displayTimeout(3);
			clearScreen();
			popMenuTo(menu.ship);
		} else {
			console.log('------------------');
			confirmDistance = readlineSync.keyInYNStrict("Are you within 5km of " + location + "?", {guide:true});

			if (!confirmDistance) {
				console.log('------------------');
				console.log('You must be within 5km of ' + location + ' to rendezvous with ' + shipcontact.shipContactIdToShipContact(choices[index].shipcontact_id).name);
				displayTimeout(3);
				clearScreen();
			} else {
				var rendezvousQuantumLocation = quantum.quantumIdToLocation(choices[index].quantum_destination_id);
				console.log('------------------');
				console.log("To rendezvous with " + shipcontact.shipContactIdToShipContact(choices[index].shipcontact_id).name + ':\n\n1) Align to quantum location ' + rendezvousQuantumLocation + '.\n2) Move towards it until you are ' + choices[index].distance_from_dest + 'km away.\n');
				readlineSync.keyInPause();
				clearScreen();
				setDestination(choices[index]);
				popMenuTo(menu.ship);
			}
		}
	}
}

// Navigation option
var menuNavigationPortDestinations = function(location) {
	location = quantum.quantumIdToLocation(data.player.quantum_location_id);
	console.log('Your location: ' + location);

	var choices = [];
	if (location.portDestinations().length > 0) {
		choices = choices.concat(location.portDestinations());
	}

	var index = readlineSync.keyInSelect(choices, 'Select a port destination ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		portDestination = location.portDestinations()[index];
		portLocation = port.portIdToLocation(portDestination.id);
		if (portLocation.haslandingPadDestinations()) {
			pushMenu(menu.ship_navigation_landing_pad_destinations, portDestination)
		} else {
			popMenuTo(menu.ship);
		}
	}
}

// Navigation option
var menuNavigationLandingPadDestinations = function(destination) {
	location = quantum.quantumIdToLocation(data.player.quantum_location_id);

	var portLocation = port.portIdToLocation(destination.id);	

	var choices = [];
	if (portLocation.haslandingPadDestinations()) {
		choices = choices.concat(portLocation.landingPadDestinations());
	} else {
		choices.push("[No landing pads]");
	}

	confirmAssign = readlineSync.keyInYNStrict("Request landing pad assignment? (If no, choose a pad manually.) ", {guide:true});	

	if (confirmAssign) {
		if (!portLocation.hasLandingPadDestinationForSize(shiptype.shipIdToShip(data.ship.id).size)) {
			console.log("No landing pads of size " + shiptype.shipIdToShip(data.ship.id).size + " available.");
			displayTimeout(3);
			clearScreen();
			popMenu();
		} else {
			var assignedLandingPadDest = portLocation.randomLandingPadDestinationForSize(shiptype.shipIdToShip(data.ship.id).size);

			if (data.ship.isLanded()) {
				console.log('------------------');
				if (assignedLandingPadDest.id == data.ship.landing_pad_location_id) {
					console.log('Already landed at ' + landingPad.landingPadIdToLocation(assignedLandingPadDest.id));
				} else {
					console.log('Cannot land at ' + landingPad.landingPadIdToLocation(assignedLandingPadDest.id) + ", ship is already landed.");
				}
				displayTimeout(3);
				clearScreen();
				popMenuTo(menu.ship);
			} else if (data.ship.isDocked()) {
				console.log('------------------');
				console.log('Cannot land at ' + landingPad.landingPadIdToLocation(assignedLandingPadDest.id) + ", ship is docked.");
				displayTimeout(3);
				clearScreen();
				popMenuTo(menu.ship);
			} else {
				console.log('------------------');
				console.log("Assigned " + assignedLandingPadDest);
				displayTimeout(3);
				clearScreen();
				popMenu();
				setDestination(assignedLandingPadDest);
				popMenuTo(menu.ship);
			}
		}
	} else {
		clearScreen();
		console.log('Your location: ' + location);
		console.log('Your ship: ' + shiptype.shipIdToShip(data.ship.id).manufacturer_name + ' ' + shiptype.shipIdToShip(data.ship.id).display_name + ' (Size ' + shiptype.shipIdToShip(data.ship.id).size + ')')
		console.log('');
		console.log(portLocation.display_name + ':');

		var index = readlineSync.keyInSelect(choices, 'Select a landing pad ', {cancel:'Cancel', guide:false});
		if (index == -1) {
			popMenu();
		} else {
			if (data.ship.isLanded()) {
				console.log('------------------');
				if (choices[index].id == data.ship.landing_pad_location_id) {
					console.log('Already landed at ' + landingPad.landingPadIdToLocation(choices[index].id));
				} else {
					console.log('Cannot land at ' + landingPad.landingPadIdToLocation(choices[index].id) + ", ship is already landed.");
				}
				displayTimeout(3);
				clearScreen();
				popMenuTo(menu.ship);
			} else if (data.ship.isDocked()) {
				console.log('------------------');
				console.log('Cannot land at ' + landingPad.landingPadIdToLocation(choices[index].id) + ", ship is docked.");
				displayTimeout(3);
				clearScreen();
				popMenuTo(menu.ship);
			} else {
				setDestination(choices[index]);
				popMenuTo(menu.ship);
			}
		}
	}
}

// Map option
var menuMap = function() {
	map.showMap(data.player.quantum_location_id);
	readlineSync.keyInPause();
	popMenu();
}

// Quantum Travel option
var menuQuantum = function() {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Quantum destinations:');
	
	var choices = quantum.quantumIdToLocation(data.player.quantum_location_id).quantumDestinations();
	
	var index = readlineSync.keyInSelect(choices, 'Where would you like to travel to? ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (data.ship.isLanded()) {
			console.log('------------------');
			console.log('Cannot travel to ' + quantum.quantumIdToLocation(choices[index].id) + ", ship is landed.");
			displayTimeout(3);
			clearScreen();
			popMenuTo(menu.ship);
		} else if (data.ship.isDocked()) {
			console.log('------------------');
			console.log('Cannot travel to ' + quantum.quantumIdToLocation(choices[index].id) + ", ship is docked.");
			displayTimeout(3);
			clearScreen();
			popMenuTo(menu.ship);
		} else if (choices[index].is_blocked) {
			console.log('------------------');
			console.log('Cannot travel to ' + quantum.quantumIdToLocation(choices[index].id) + ", route is obstructed.");
			displayTimeout(3);
			clearScreen();
			menuQuantum();
		} else {
			setDestination(choices[index]);
			popMenuTo(menu.ship);
		}
	}
}

// Contracts option
var menuContracts = function(menuId) {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('Your credits: ' + data.player.journal.getCredits() + " UEC");
	console.log('');

	var _acceptedContracts = data.player.journal.acceptedContracts();
	var _abandonedContracts = data.player.journal.abandonedContracts();
	var _completedContracts = data.player.journal.completedContracts();
	var _availableContracts = [];

	if (data.ship.isLanded()) {
		var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
		var _portLocation = port.portIdToLocation(_landingPad.port_id);
		if (_portLocation.hasJobBoard()) {
			_jobBoard = jobboard.jobBoardIdToJobBoard(_portLocation.jobBoardId());
			_availableContracts = _jobBoard.allContracts();
		}
	}

	var choices = [];

	if (menuId === menu.ship_contracts.id) {
		console.log('Accepted contracts:');

		if (_acceptedContracts.length == 0) {
			choices = ["[No contracts]"];
		} else {
			choices = choices.concat(_acceptedContracts);
		}

		if (_abandonedContracts.length > 0) {
			choices.push(new menu.Menu("ship_contracts_abandoned", "Abandoned contracts (" + _abandonedContracts.length + ")"));
		}

		if (_completedContracts.length > 0) {
			choices.push(new menu.Menu("ship_contracts_completed", "Completed contracts (" + _completedContracts.length + ")"));
		}

		if (_availableContracts.length > 0) {
			// TODO: add the port into the string
			choices.push(new menu.Menu("ship_contracts_available", "Available contracts (" + _availableContracts.length + ")"));
		}
	} else if (menuId === menu.ship_contracts_completed.id) {
		console.log('Completed contracts:');
		choices = choices.concat(_completedContracts);
	} else if (menuId === menu.ship_contracts_abandoned.id) {
		console.log('Abandoned contracts:');
		choices = choices.concat(_abandonedContracts);
	} else if (menuId === menu.ship_contracts_available.id) {
		console.log('Available contracts:'); // TODO: add the port into the string
		choices = choices.concat(_availableContracts);
	}

	var index = readlineSync.keyInSelect(choices, 'Select a contract ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (choices[index].id === menu.ship_contracts_abandoned.id) {
			pushMenu(menu.ship_contracts_abandoned)
		} else if (choices[index].id === menu.ship_contracts_completed.id) {
			pushMenu(menu.ship_contracts_completed)
		} else if (choices[index].id === menu.ship_contracts_available.id) {
			pushMenu(menu.ship_contracts_available)
		} else if (menuId === menu.ship_contracts.id && _acceptedContracts.length == 0) {
			popMenu();
		} else {
			// Load details for specific contract
			if (menuId === menu.ship_contracts_available.id) {
				// If available, show the available contracts menu which loads the correct job board
				pushMenu(menu.ship_contracts_details_available, choices[index].id);	
			} else {
				// If abandoned, completed, or accepted, the details will show the right status
				pushMenu(menu.ship_contracts_details, choices[index].id)
			}
		}
	}
}

// Contracts option
var menuContractsDetails = function(contractId) {
	_contract = contract.contractIdToContract(contractId);
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Contract details:');
	console.log('');
	console.log(_contract.toDetailsString(true));

	if (!data.player.journal.contractIdIsAccepted(contractId)) {
		// Nothing to do unless the contract has been accepted.
		console.log('');
		readlineSync.keyInPause();
		popMenu();
	} else {
		choices = [];
		if (_contract.canBeCompleted()) {
			choices.push(menu.ship_contracts_details_complete);
		} else {
			choices.push(menu.ship_contracts_details_abandon);
		}

		var index = readlineSync.keyInSelect(choices, 'Select a contract option ', {cancel:'Cancel', guide:false});
		if (index == -1) {
			popMenu();
		} else {
			if (choices[index].id === menu.ship_contracts_details_complete.id) {
				var confirmComplete;

				if (_contract.scuLost() > 0) {
					confirmComplete = readlineSync.keyInYNStrict("Complete contract? You will pay a " + _contract.lostSCUPenalty() + " penalty for " + _contract.scuLost() + " lost SCU.", {guide:true});
				} else {
					confirmComplete = readlineSync.keyInYNStrict("Complete contract?", {guide:true});
				}

				if (confirmComplete) {
					console.log('------------------');
					console.log('Payout: ' + _contract.completionPayout() + ' UEC (~' + Math.round(_contract.payoutPerSCUDistanceOnly()) + ' UEC per SCU plus ' + _contract.payoutPerSCUBase() + ' UEC per SCU bonus)');
					data.player.journal.addCredits(_contract.completionPayout());
					
					if (_contract.scuLost() > 0) {
						console.log('Lost cargo penalty: ' + _contract.lostSCUPenalty() + ' UEC (~' + Math.round(Math.abs(_contract.penaltyPerSCU())) + ' UEC per SCU)');
						data.player.journal.removeCredits(_contract.lostSCUPenalty());
					}

					data.player.journal.completeContractId(contractId);
					displayTimeout(3);
				}

				popMenuTo(menu.ship_contracts);
			} else if (choices[index].id === menu.ship_contracts_details_abandon.id) {
				var confirmAbandon;

				if (_contract.scuLost() > 0) {
					confirmAbandon = readlineSync.keyInYNStrict("Abandon contract? You will pay a " + _contract.lostSCUPenalty() + " UEC penalty for " + _contract.scuLost() + " lost SCU.", {guide:true});
				} else {
					confirmAbandon = readlineSync.keyInYNStrict("Abandon contract?", {guide:true});
				}

				if (confirmAbandon) {
					console.log('Payout: ' + _contract.abandonedPayout() + ' UEC (~' + Math.round(_contract.payoutPerSCUDistanceOnly()) + ' UEC per SCU, without ' + _contract.payoutPerSCUBase() + ' UEC per SCU bonus)');
					data.player.journal.addCredits(_contract.abandonedPayout());

					if (_contract.scuLost() > 0) {
						console.log('Lost cargo penalty: ' + _contract.lostSCUPenalty() + ' UEC (~' + Math.round(Math.abs(_contract.penaltyPerSCU())) + ' UEC per SCU)');
						data.player.journal.removeCredits(_contract.lostSCUPenalty());
					}

					data.player.journal.abandonContractId(contractId);
					displayTimeout(3);
				}

				popMenuTo(menu.ship_contracts);
			} else {
				popMenu();
			}
		}
	}
}

// Contracts option
var menuContractsDetailsAvailable = function(contractId) {
	_contract = contract.contractIdToContract(contractId);

	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Contract details:');
	console.log('');
	console.log(_contract.toDetailsString(false));

	choices = [];
	choices.push(menu.ship_contracts_details_available_accept);

	var index = readlineSync.keyInSelect(choices, 'Select a contract option ', {cancel:'Cancel', guide:false});

	if (index == -1) {
		popMenu();
	} else if (choices[index].id === menu.ship_contracts_details_available_accept.id) {
		var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
		var _portLocation = port.portIdToLocation(_landingPad.port_id);
		_jobBoard = jobboard.jobBoardIdToJobBoard(_portLocation.jobBoardId());
		_jobBoard.removeContractId(contractId);
		data.player.journal.acceptContractId(contractId);
		popMenuTo(menu.ship_contracts);
	} else {
		popMenu();
	}
}

// Cargo option
var menuCargo = function() {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Your cargo: ' + data.ship.cargo.loadedCargoSize() + ' / ' + data.ship.cargo.size + ' SCU');

	choices = [];

	if (data.ship.cargo.loadedCargoSize() == 0) {
		choices.push(["[No cargo]"]);
	} else {
		// TODO: show cargo for cargo details; this should be grouped by contract id; show for current loaded contracts
		_containerGroupByContractId = data.ship.cargo.containerGroupByContractId();

		for (_contractId in _containerGroupByContractId) {
			_containerGroup = _containerGroupByContractId[_contractId];
			choices.push(_containerGroup);
		}
	}

	if (data.ship.isLanded()) {
		var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
		var _portLocation = port.portIdToLocation(_landingPad.port_id);

		_cargo = _portLocation.cargo.containersForContractIds(data.player.journal.acceptedContractIds());

		choices.push(new menu.Menu("ship_cargo_available", _portLocation.display_name + " (" + _cargo.length + " containers)"));
	} else if (data.ship.isDocked()) {
		var _shipcontact = shipcontact.shipContactIdToShipContact(data.ship.docked_shipcontact_id);

		_cargo = _shipcontact.cargo.containersForContractIds(data.player.journal.acceptedContractIds());

		choices.push(new menu.Menu("ship_cargo_available", _shipcontact.name + " (" + _cargo.length + " containers)"));
	}

	var index = readlineSync.keyInSelect(choices, 'Select cargo ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (choices[index].id == menu.ship_cargo_available.id) {
			pushMenu(menu.ship_cargo_available);
		} else {
			if (data.ship.cargo.loadedCargoSize() == 0) {
				popMenu();
			} else {
				pushMenu(menu.ship_cargo_details_from, choices[index]);
			}
		}
	}
}

// Cargo option
var menuCargoAvailable = function(destinationId) {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Your cargo: ' + data.ship.cargo.loadedCargoSize() + ' / ' + data.ship.cargo.size + ' SCU');
	console.log('');

	choices = [];
	_containers = [];
	_containerGroups = [];

	if (data.ship.isLanded()) {
		var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
		var _portLocation = port.portIdToLocation(_landingPad.port_id);
		_containerGroupsForContractIds = _portLocation.cargo.containerGroupsForContractIds(data.player.journal.acceptedContractIds());

		for (_contractId in _containerGroupsForContractIds) {
			_containerGroup = _containerGroupsForContractIds[_contractId];
			_containerGroups.push(_containerGroup);
		}

		console.log(_portLocation.display_name +  '\'s cargo: ');
	} else if (data.ship.isDocked()) {
		var _shipcontact = shipcontact.shipContactIdToShipContact(data.ship.docked_shipcontact_id);
		_containerGroupsForContractIds = _shipcontact.cargo.containerGroupsForContractIds(data.player.journal.acceptedContractIds());

		for (_contractId in _containerGroupsForContractIds) {
			_containerGroup = _containerGroupsForContractIds[_contractId];
			_containerGroups.push(_containerGroup);
		}

		console.log(_shipcontact.name +  '\'s cargo: ');
	}	

	if (_containerGroups.length == 0) {
		choices.push(["[No cargo]"]);
	} else {
		choices = choices.concat(_containerGroups);
	}

	var index = readlineSync.keyInSelect(choices, 'Select cargo ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (_containerGroups.length == 0) {
			popMenu();
		} else {
			pushMenu(menu.ship_cargo_details_to, choices[index]);
		}
	}
}

// Cargo details menu (transfer to port/ship contact)
// Show details about the cargo: the SCU, containers, manufacturer, commodity, etc.
// For cargo on your ship, you can transfer it to the port/ship contact
// For cargo in the port/shipcontact, you can transfer it to your ship

var menuCargoDetails = function(containerGroup, isFromShip) {
	console.log('Your location: ' + quantum.quantumIdToLocation(data.player.quantum_location_id));
	console.log('');
	console.log('Selected cargo: ' + containerGroup);

	commodity = commodities.commodityIdToCommodity(containerGroup.groupedCargo()[0].commodity_id);

	console.log('Origin: ' + commodity.manufacturer_name);
	if (containerGroup.contractId() != null) {
		console.log('Destination: ' + contract.contractIdToContract(containerGroup.contractId()).dropoff);
	}
	console.log('');
	console.log(commodity.description);

	var choices = [];

	if (data.ship.isLanded()) {
		var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
		var _portLocation = port.portIdToLocation(_landingPad.port_id);
		if (isFromShip) {
			choices.push(new menu.Menu("ship_cargo_details_transfer_to_port", "Transfer to " + portLocation.display_name));
		} else {
			choices.push(new menu.Menu("ship_cargo_details_transfer_from_port", "Transfer from " + portLocation.display_name));
		}
	} else if (data.ship.isDocked()) {
		var _shipcontact = shipcontact.shipContactIdToShipContact(data.ship.docked_shipcontact_id);
		if (isFromShip) {
			choices.push(new menu.Menu("ship_cargo_details_transfer_to_shipcontact", "Transfer to " + _shipcontact));
		} else {
			choices.push(new menu.Menu("ship_cargo_details_transfer_from_shipcontact", "Transfer from " + _shipcontact));
		}
	} else {
		choices.push(menu.ship_cargo_details_jettison);
	}

	var index = readlineSync.keyInSelect(choices, 'Select cargo option ', {cancel:'Cancel', guide:false});
	if (index == -1) {
		popMenu();
	} else {
		if (choices[index].id == menu.ship_cargo_details_jettison.id) {
			console.log('------------------');
			console.log('Number of containers to jettison?');
			var numContainersToJettison = cargoChoiceDialog(containerGroup, cargohold.HOLD_SIZE_UNLIMITED, cargohold.HOLD_SIZE_UNLIMITED);
			clearScreen();
			if (numContainersToJettison > 0) {
				var _shiptype = shiptype.shipIdToShip(data.ship.id);
				var _secondsPerContainer = _shiptype.cargoTransferDelay(containerGroup.groupedCargo()[0].size);
				confirmJettison = readlineSync.keyInYNStrict("Jettison " + numContainersToJettison + 
					" containers of " + containerGroup.groupedCargo()[0] + 
					"?\nYou will not be able to retrieve them.\n" + 
					"This will take " + (_secondsPerContainer * numContainersToJettison) + " seconds.", {guide:true});
				if (confirmJettison) {
					console.log('------------------');
					for (var i = 0; i < numContainersToJettison; i++) {
						_container = containerGroup.groupedCargo()[i];
						console.log("Jettisoning " + _container + ", " + (i + 1) + "/" + numContainersToJettison);
						_shiptype = shiptype.shipIdToShip(data.ship.id);
						displayTimeout(_secondsPerContainer);
						data.ship.cargo.unloadContainer(_container);
					}
				}
			}
			popMenuTo(menu.ship_cargo);
		} else if (choices[index].id == menu.ship_cargo_details_transfer_to_port.id ||
				choices[index].id == menu.ship_cargo_details_transfer_from_port.id) {
			console.log('------------------');
			console.log('Number of containers to transfer? ');

			var numContainersToTransfer= 0;
			if (isFromShip) {
				numContainersToTransfer = cargoChoiceDialog(containerGroup, _portLocation.cargo.freeSpace(), _portLocation.cargo.size);
			} else {
				numContainersToTransfer = cargoChoiceDialog(containerGroup, data.ship.cargo.freeSpace(), data.ship.cargo.size);
			}

			clearScreen();
			if (numContainersToTransfer > 0) {
				var _landingPad = landingPad.landingPadIdToLocation(data.ship.landing_pad_location_id);
				var _portLocation = port.portIdToLocation(_landingPad.port_id);
				var _shiptype = shiptype.shipIdToShip(data.ship.id);
				var _secondsPerContainer = _shiptype.cargoTransferDelay(containerGroup.groupedCargo()[0].size);
				confirmTransfer = readlineSync.keyInYNStrict("Transfer " + numContainersToTransfer + 
					" containers of " + containerGroup.groupedCargo()[0] + 
					"?\nThis will take " + _secondsPerContainer * numContainersToTransfer + " seconds.", {guide:true});
				if (confirmTransfer) {
					console.log('------------------');
					for (var i = 0; i < numContainersToTransfer; i++) {
						_container = containerGroup.groupedCargo()[i];
						if (isFromShip) {
							data.ship.cargo.unloadContainer(_container);
							_portLocation.cargo.loadContainer(_container);
							console.log("Transferring " + _container + ", " + (i + 1) + "/" + numContainersToTransfer);
							displayTimeout(_secondsPerContainer);
						} else {
							if (data.ship.cargo.canLoadContainer(_container)) {
								_portLocation.cargo.unloadContainer(_container)
								data.ship.cargo.loadContainer(_container);
								console.log("Transferring " + _container + ", " + (i + 1) + "/" + numContainersToTransfer);
								displayTimeout(_secondsPerContainer);
							} else {
								console.log("Cannot transfer " + _container + ", not enough room on ship.");
								displayTimeout(3);
								break;
							}
						}
					}
				}
			}
			popMenuTo(menu.ship_cargo);
		} else if (choices[index].id == menu.ship_cargo_details_transfer_to_shipcontact.id ||
				choices[index].id == menu.ship_cargo_details_transfer_from_shipcontact.id) {
			console.log('------------------');
			console.log('Number of containers to transfer? ');

			var numContainersToTransfer= 0;
			if (isFromShip) {
				numContainersToTransfer = cargoChoiceDialog(containerGroup, _shipcontact.cargo.freeSpace(), _shipcontact.cargo.size);
			} else {
				numContainersToTransfer = cargoChoiceDialog(containerGroup, data.ship.cargo.freeSpace(), data.ship.cargo.size);
			}

			clearScreen();
			if (numContainersToTransfer > 0) {
				var _shipcontact = shipcontact.shipContactIdToShipContact(data.ship.docked_shipcontact_id);
				var _shiptype = shiptype.shipIdToShip(data.ship.id);
				var _secondsPerContainer = _shiptype.cargoTransferDelay(containerGroup.groupedCargo()[0].size);
				confirmTransfer = readlineSync.keyInYNStrict("Transfer " + numContainersToTransfer + 
					" containers of " + containerGroup.groupedCargo()[0] + 
					"?\nThis will take " + _secondsPerContainer * numContainersToTransfer + " seconds.", {guide:true});
				if (confirmTransfer) {
					console.log('------------------');
					for (var i = 0; i < numContainersToTransfer; i++) {
						_container = containerGroup.groupedCargo()[i];
						if (isFromShip) {
							if (_shipcontact.cargo.canLoadContainer(_container)) {
								data.ship.cargo.unloadContainer(_container);
								_shipcontact.cargo.loadContainer(_container);
								console.log("Transferring " + _container + ", " + (i + 1) + "/" + numContainersToTransfer);
								displayTimeout(_secondsPerContainer);
							} else {
								console.log("Cannot transfer " + _container + ", not enough room on ship.");
								displayTimeout(3);
								break;
							}
						} else {
							if (data.ship.cargo.canLoadContainer(_container)) {
								_shipcontact.cargo.unloadContainer(_container)
								data.ship.cargo.loadContainer(_container);
								console.log("Transferring " + _container + ", " + (i + 1) + "/" + numContainersToTransfer);
								displayTimeout(_secondsPerContainer);
							} else {
								console.log("Cannot transfer " + _container + ", not enough room on ship.");
								displayTimeout(3);
								break;
							}
						}
					}
				}
			}
			popMenuTo(menu.ship_cargo);
		} else {
			popMenu();
		}
	}
}

var cargoChoiceDialog = function(containerGroup, targetFreeSpace, targetSize) {
	var _maxIncoming = containerGroup.groupedCargo().length, _min = 0, value = 0, key, _calculatedSCU, _holdSizeString, _targetMaxSize, _targetMaxContainers, step, maxIncomingWithStep;
	
	var MAX_STEPS = 30;

	if (targetFreeSpace != cargohold.HOLD_SIZE_UNLIMITED) {
		_targetMaxSize = Math.min(containerGroup.containerSize() * _maxIncoming, targetFreeSpace);
		_targetMaxContainers = Math.min(_maxIncoming, Math.floor(targetFreeSpace / containerGroup.containerSize()));
	} else {
		_targetMaxSize = containerGroup.containerSize() * _maxIncoming;
		_targetMaxContainers = _maxIncoming;
	}

	if (_targetMaxContainers > MAX_STEPS) {
		step = Math.ceil(_targetMaxContainers / MAX_STEPS);
		maxIncomingWithStep = _targetMaxContainers % step == 0 ? Math.floor(_targetMaxContainers / step) : Math.floor(_targetMaxContainers / step) + 1;
	} else {
		step = 1;
		maxIncomingWithStep = _targetMaxContainers;
	}

	console.log('\n' + (new Array(20)).join(' ') + '[A] <- -> [D]  Confirm: [SPACE]\n\n');
	while (true) {
		var numContainers;

		if (value == maxIncomingWithStep && _targetMaxContainers % step > 0) {
			numContainers = _targetMaxContainers;
		} else {
			numContainers = value * step;
		}

		if (targetFreeSpace != cargohold.HOLD_SIZE_UNLIMITED) {
			_calculatedSCU = (targetSize - targetFreeSpace) + (numContainers * containerGroup.containerSize());
			_holdSizeString = " (" + _calculatedSCU + "/" + targetSize + " SCU in hold)";
		} else {
			_holdSizeString = " (" + (numContainers * containerGroup.containerSize()) + " SCU)";
		}
		
		console.log('\x1B[1A\x1B[K|' +
			(new Array(value + 1)).join('-') + 'X' +
			(new Array(maxIncomingWithStep - value + 1)).join('-') + '| ' + numContainers + "/" + _maxIncoming + " containers" + _holdSizeString);
		key = readlineSync.keyIn('', {
			hideEchoBack: true, 
			mask: '', 
			limit: 'ad '
		});
		if (key === 'a') {
			if (value > _min) {
			 value--;
			}
		} else if (key === 'd') {
			if (value < maxIncomingWithStep) {
				value++;
			}
		} else { 
			break;
		}
	}
	return numContainers;
}

// Available cargo menu (transfer to ship)
// Shows cargo available at the current port or shipcontact that matches a contract you have accepted
// Can open cargo details for this cargo and transfer it to your ship

var pushMenu = function(_item, _data) {
	menuStack.unshift(
		{
			item: _item,
			data: _data
		}
	)
}

var popMenuTo = function(targetMenu) {
	while (peekMenu().item.id != targetMenu.id) {
		menuStack.shift();
	}
	return peekMenu();
}

var popMenu = function() {
	return menuStack.shift();
}

var peekMenu = function() {
	return menuStack[0];
}

var menuStack = [];

////////////////////////////////

clearScreen();

data.player.name = readlineSync.question('What is your name? ');

clearScreen();

var index = readlineSync.keyInSelect(quantum.quantumIdsToLocations(quantum.spawn_location_ids), 'Where did you spawn? ', {cancel:false, guide:false});

data.player.spawn_location_id = quantum.quantumIdsToLocations(quantum.spawn_location_ids)[index].id;
data.player.quantum_location_id = data.player.spawn_location_id;
console.log('------------------');
console.log('Ok, you spawned at ' + quantum.quantumIdsToLocations(quantum.spawn_location_ids)[index]);
displayTimeout(3);

clearScreen();

var index = readlineSync.keyInSelect(shiptype.shipIdsToShips(shiptype.ship_ids), 'Which ship are you flying? ', {cancel:false, guide:false});

data.ship.setType(shiptype.shipIdsToShips(shiptype.ship_ids)[index].id);
console.log('------------------');
console.log('Ok, your ship is a ' + shiptype.shipIdToShip(data.ship.id));
console.log('------------------');
data.ship.name = readlineSync.question('What is your ship\'s name? ');

incrementTick();

// for (var i = 0; i < 2; i++) {
// 	var _contract = metacontract.generateContractForEmployerId("hurston");
// 	data.player.journal.acceptContractId(_contract.id);
// }

displayTimeout(3);

clearScreen();

pushMenu(menu.ship);

var looping = true;
while (looping) {
	clearScreen();
	var menuItem = peekMenu().item;
	var menuData = peekMenu().data;
	switch (menuItem.id) {
		case menu.ship.id:
			menuSpace();
			break;
		case menu.ship_comms.id:
			menuComms();
			break;
		case menu.ship_navigation.id:
			menuNavigation();
			break;
		case menu.ship_navigation_port_destinations.id:
			menuNavigationPortDestinations(menuData);
			break;
		case menu.ship_navigation_landing_pad_destinations.id:
			menuNavigationLandingPadDestinations(menuData);
			break;
		case menu.ship_navigation_map.id:
			menuMap();
			break;
		case menu.ship_navigation_quantum.id:
			menuQuantum();
			break;
		case menu.ship_contracts.id:
			menuContracts(menu.ship_contracts.id);
			break;
		case menu.ship_contracts_completed.id:
			menuContracts(menu.ship_contracts_completed.id);
			break;
		case menu.ship_contracts_abandoned.id:
			menuContracts(menu.ship_contracts_abandoned.id);
			break;
		case menu.ship_contracts_available.id:
			menuContracts(menu.ship_contracts_available.id);
			break;
		case menu.ship_contracts_details.id:
			menuContractsDetails(menuData);
			break;
		case menu.ship_contracts_details_available.id:
			menuContractsDetailsAvailable(menuData);
			break;
		case menu.ship_cargo.id:
			menuCargo();
			break;
		case menu.ship_cargo_details_from.id:
			menuCargoDetails(menuData, true);
			break;
		case menu.ship_cargo_available.id:
			menuCargoAvailable();
			break;
		case menu.ship_cargo_details_to.id:
			menuCargoDetails(menuData, false);
			break;
	}
}

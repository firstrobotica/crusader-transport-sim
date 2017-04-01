// menu.js

function Menu(id, display_name, data) {
	this.id = id;
	this.display_name = display_name;
	this.data = data;
}

Menu.prototype.toString = function() {
	return this.display_name;
};

var _menus = {
	ship: new Menu("ship", "Ship"),
	ship_comms: new Menu("ship_comms", "Comms"),
	ship_docking: new Menu("ship_docking", "Docking"),
	ship_navigation: new Menu("ship_navigation", "Navigation"),
	ship_navigation_port_destinations: new Menu("ship_navigation_port_destinations", "Navigation"),
	ship_navigation_landing_pad_destinations: new Menu("ship_navigation_landing_pad_destinations", "Navigation"),
	ship_navigation_map: new Menu("ship_navigation_map", "Sector Map"),
	ship_navigation_quantum: new Menu("ship_navigation_quantum", "Quantum Travel"),
	ship_navigation_clear: new Menu("ship_navigation_clear", "Clear destination"),
	ship_contracts: new Menu("ship_contracts", "Contracts"),
	ship_contracts_available: new Menu("ship_contracts_available", "Available Contracts"),
	ship_contracts_completed: new Menu("ship_contracts_completed", "Completed Contracts"),
	ship_contracts_abandoned: new Menu("ship_contracts_abandoned", "Abandoned Contracts"),
	ship_contracts_details: new Menu("ship_contracts_details", "Contract Details"),
	ship_contracts_details_complete: new Menu("ship_contracts_details_complete", "Complete"),
	ship_contracts_details_abandon: new Menu("ship_contracts_details_abandon", "Abandon"),
	ship_contracts_details_available: new Menu("ship_contracts_details_available", "Contract Details"),
	ship_contracts_details_available_accept: new Menu("ship_contracts_details_available_accept", "Accept"),
	ship_cargo: new Menu("ship_cargo", "Cargo"),
	ship_cargo_available: new Menu("ship_cargo_available", "Available Cargo"),
	ship_cargo_details_from: new Menu("ship_cargo_details_from", "Cargo Details"),
	ship_cargo_details_transfer_from_shipcontact: 
		new Menu("ship_cargo_details_transfer_from_shipcontact", "Transfer from "),
	ship_cargo_details_transfer_from_port: 
		new Menu("ship_cargo_details_transfer_from_port", "Transfer from "),
	ship_cargo_details_to: new Menu("ship_cargo_details_to", "Cargo Details"),
	ship_cargo_details_transfer_to_port: new Menu("ship_cargo_details_transfer_to_port", "Transfer to "),
	ship_cargo_details_transfer_to_shipcontact: new Menu("ship_cargo_details_transfer_to_shipcontact", "Transfer to "),
	ship_cargo_details_jettison: new Menu("ship_cargo_details_jettison", "Jettison"),
}

var _menuIdToMenu = function(menuId) {
	return Object.freeze(_menus[menuId]);
}

var _menuIdsToMenus = function(menuIds) {
	array = [];
	for (var i = menuIds.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_menus[menuIds[i]]);
	};
	return array;
}

var _menu_ids = [];

for (var menu in _menus) {
	if (_menus.hasOwnProperty(menu)) {
		_menu_ids.push(menu.id)
	}
}

module.exports = {
	Menu: Menu,
	menu_ids: _menu_ids,
	menuIdToMenu: _menuIdToMenu,
	menuIdsToMenus: _menuIdsToMenus,
	ship:_menus.ship,
	ship_comms: _menus.ship_comms,
	ship_docking: _menus.ship_docking,
	ship_navigation: _menus.ship_navigation,
	ship_navigation_port_destinations: _menus.ship_navigation_port_destinations,
	ship_navigation_landing_pad_destinations: _menus.ship_navigation_landing_pad_destinations,
	ship_navigation_map: _menus.ship_navigation_map,
	ship_navigation_quantum: _menus.ship_navigation_quantum,
	ship_navigation_clear: _menus.ship_navigation_clear,
	ship_contracts: _menus.ship_contracts,
	ship_contracts_available: _menus.ship_contracts_available,
	ship_contracts_completed: _menus.ship_contracts_completed,
	ship_contracts_abandoned: _menus.ship_contracts_abandoned,
	ship_contracts_details: _menus.ship_contracts_details,
	ship_contracts_details_complete: _menus.ship_contracts_details_complete,
	ship_contracts_details_abandon: _menus.ship_contracts_details_abandon,
	ship_contracts_details_available: _menus.ship_contracts_details_available,
	ship_contracts_details_available_accept: _menus.ship_contracts_details_available_accept,
	ship_cargo: _menus.ship_cargo,
	ship_cargo_available: _menus.ship_cargo_available,
	ship_cargo_details_from: _menus.ship_cargo_details_from,
	ship_cargo_details_transfer_from_shipcontact: _menus.ship_cargo_details_transfer_from_shipcontact,
	ship_cargo_details_transfer_from_port: _menus.ship_cargo_details_transfer_from_port,
	ship_cargo_details_to: _menus.ship_cargo_details_to,
	ship_cargo_details_transfer_to_port: _menus.ship_cargo_details_transfer_to_port,
	ship_cargo_details_transfer_to_shipcontact: _menus.ship_cargo_details_transfer_to_shipcontact,
	ship_cargo_details_jettison: _menus.ship_cargo_details_jettison,
}
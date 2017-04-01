// commodities.js

function Commodity(id, display_name, manufacturer_name, description) {
	this.id = id;
	this.display_name = display_name;
	this.manufacturer_name = manufacturer_name;
	this.description = description;
}

Commodity.prototype.toString = function() {
	return this.display_name;
};

var _commodities = {
	// solar imports
	ship_guns_qcl_from_hurston: new Commodity("ship_guns_qcl_hurston", "Quantum Cascade Lasers", "Hurston Dynamics", "Poor grade versions of Hurston's popular \'Spectrum\' quantum cascade lasers designed for export."), // kareah, arccorp, pyro, grimhex, cryastro
	ship_guns_elec_from_hurston: new Commodity("ship_guns_elec_hurston", "Electron Guns", "Hurston Dynamics", "Poor grade versions of Hurston's popular \'Magnitude\' electron guns designed for export."), // kareah, arccorp, pyro, grimhex, cryastro
	/* TODO */ fusion_engines_from_arccorp: new Commodity("fusion_engines_arccorp", "Fusion Engines", "ArcCorp", "High quality, affordable ship fusion engines produced by ArcCorp."), // olisar (crusader?), cryastro
	/* TODO */ personal_weapons_from_arccorp: new Commodity("personal_weapons_arccorp", "Personal Weapons", "ArcCorp", "An assortment of ballistic and energy personal weapons distributed by ArcCorp."), // kareah, pyro, grimhex
	/* TODO */ ship_electronics_from_microtech: new Commodity("ship_electronics_microtech", "Ship Electronics", "microTech", "A wide variety of microTech\'s electronics, used in ship systems and components."), // olisar (crusader industries), magnus (drake), terra (origin, anvil), cryastro
	/* TODO */ mobiglass_from_microtech: new Commodity("mobiglass_microtech", "Mobiglass", "microTech", "MicroTech\'s signature personal digital assistive technology used by nearly everyone in the Empire."),

	// extrasolar imports
	/* TODO */ platinum_from_terra_ii: new Commodity("platinum_terra_ii", "Platinum", "UEE", "Platinum extracted by automated cities on Terra II."), // magnus, hurston
	/* TODO */ mercury_from_terra_ii: new Commodity("mercury_terra_ii", "Mercury", "UEE", "Mercury extracted by automated cities on Terra II."), // magnus, hurston
	/* TODO */ iron_from_terra_ii: new Commodity("iron_terra_ii", "Iron", "UEE", "Iron extracted by automated cities on Terra II."), // magnus, hurston
	/* TODO */ gold_from_terra_ii: new Commodity("gold_terra_ii", "Gold", "UEE", "Gold extracted by automated cities on Terra II."), // magnus, hurston
	/* TODO */ diamonds_from_magnus_i: new Commodity("diamonds_magnus_i", "Diamonds", "UEE", "High grade diamonds used in gemstones and factory operations."), // arccorp
	caterpillar_parts_from_borea: new Commodity("caterpillar_parts_borea", "Caterpillar Parts", "Drake Interplanetary", "Replacement and service parts for the Drake Interplanetary Caterpillar produced in the old UEE shipyards."), // ArcCorp, Terra, Olisar
	/* TODO */ unlicensed_medicine_from_pyro_vi: new Commodity("unlicensed_medicine_pyro_vi", "Unlicensed Medicine", "Corner Four Research Lab", "Unlicensed medicine produced by a defunct, repurposed research lab."), // hurston, grim hex
	/* TODO */ illegal_narcotics_from_pyro_vi: new Commodity("illegal_narcotics_pyro_vi", "Illegal Narcotics", "Corner Four Research Lab", "Illegal narcotics produced by a defunct, repurposed research lab."), // arccorp, grim hex

	// exports
	hydrogen_fuel_from_crusader: new Commodity("hydrogen_fuel_crusader", "Hydrogen Fuel", "Crusader Industries", "Hydrogen fuel, collected on Crusader, purchased and refined by CryAstro."), // Cryastro
	/* TODO */ genesis_parts_from_crusader: new Commodity("genesis_parts_crusader", "Starliner Parts", "Crusader Industries", "Spare and replacement parts for the Genesis-class Starliner."), // arccorp, terra (platinum bay on terra III)
	/* TODO */ salvage_from_covalex: new Commodity("salvage_covalex", "Salvage", "Covalex Shipping Hub", "After a catastrophic accident, Covalex is collecting salvage from the abandoned station."), // crusader (olisar?)
	/* TODO */ prisoners_from_kareah: new Commodity("prisoners_kareah", "Prisoners", "Security Post Kareah", "These prisoners are being transported in stasis pods."),
	/* TODO */ stolen_goods_from_grim_hex: new Commodity("stolen_goods_grim_hex", "Stolen goods", "Grim Hex", "These goods have been stripped of identifying information and are offered for sale."),
	ship_scrap_from_cryastro: new Commodity("ship_scrap_cryastro", "Ship scrap", "CryAstro", "Scrap metal and other salvage stripped from ships during the repair process.")
}

var _commodityIdToCommodity = function(id) {
	return Object.freeze(_commodities[id]);
}

var _commodityIdsToCommodities = function(ids) {
	array = [];
	for (var i = ids.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_commodities[ids[i]]);
	};
	return array;
}

var _commodity_ids = [];

for (var commodityId in _commodities) {
	if (_commodities.hasOwnProperty(commodityId)) {
		_commodity_ids.push(commodityId)
	}
}

module.exports = {
	commodity_ids: _commodity_ids,
	commodityIdToCommodity: _commodityIdToCommodity,
	commodityIdsToCommodities: _commodityIdsToCommodities
}
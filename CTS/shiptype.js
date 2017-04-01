// shiptype.js

function ShipType(id, display_name, manufacturer_name, cargo_hold_size, size, base_price_uec, description) {
	this.id = id;
	this.display_name = display_name;
	this.manufacturer_name = manufacturer_name;
	this.cargo_hold_size = cargo_hold_size;
	this.size = size;
	this.base_price_uec = base_price_uec;
	this.description = description;
	// TODO: make this a parameter or dynamic.
	this.cargoTransferDelayPerSCU = 0.5;
}

ShipType.prototype.toString = function() {
	return this.display_name;
};

ShipType.prototype.cargoTransferDelay = function(container_size) {
	return Math.ceil(this.cargoTransferDelayPerSCU * container_size);
}

var _ships = {
	aegs_avenger_titan: new ShipType("aegs_avenger_titan", "Avenger Titan", "Aegis", 12, 2, 50000, "Lacking the Prisoner Cells of the Stalker or the EMP Generator of the Warlock, the Titan\'s hold is free to carry cargo. Couple that available space with the Avenger\'s tried and true combat abilities and you\'ve got a light cargo hauler that\'s more than capable of handling itself in a fight."),
	aegs_starfarer_gemini: new ShipType("aegs_starfarer_gemini", "Starfarer Gemini", "Aegis", 816, 5, 340000, "The United Empire of Earth military uses an adapted ‘rough and tumble’ variant of the Starfarer for their front line operations. The G2M Gemini, more commonly the Starfarer Gemini or ‘Star G,’ trades some cargo capacity and maneuverability in exchange for reinforced armor, increased shielding, more powerful engines and stronger versions of the three manned turrets. The Gemini also includes an optional missile pod, which can be swapped for the fuel intake unit on the ship’s nose. Missile pods can be mounted to either Starfarer variant."),

	anvl_hornet_f7c: new ShipType("anvl_hornet_f7c", "Hornet F7C", "Anvil", 12, 2, 110000, "To the enemy, it is a weapon never to be underestimated. To allies, it\'s a savior. The F7C Hornet is the same dependable and resilient multi-purpose fighter that has become the face of the UEE Navy. The F7C is the foundation to build on and meet whatever requirements you have in mind."),

	cnou_mustang: new ShipType("cnou_mustang", "Mustang Alpha", "C.O.", 9, 2, 30000, "Inspired by Consolidated Outland CEO Silas Koerner’s cutting edge vision, the Mustang Alpha is a sleek, stylish spacecraft that uses ultralight alloys to push power ratios to the limits, albeit sometimes unsafely. And now, with the optional Cargo Carrier, you can have the Alpha’s advantages without sacrificing carrying capacity."),

	drak_cutlass_black: new ShipType("drak_cutlass_black", "Cutlass Black", "Drake", 32, 2, 100000, "Drake Interplanetary claims that the Cutlass Black is a low-cost, easy-to-maintain solution for local in-system militia units. The larger-than-average cargo hold, RIO seat and dedicated tractor mount are, the company literature insists, for facilitating search and rescue operations."),
	drak_caterpillar: new ShipType("drak_caterpillar", "Caterpillar", "Drake", 512, 5, 295000, "Drake maintains that the Caterpillar, a sprawling, modular spacecraft which appears at least somewhat like its namesake, is for legitimate commerce and extended search and rescue missions."),

	misc_reliant_kore: new ShipType("misc_reliant_kore", "Reliant Kore", "MISC", 30, 3, 65000, "With the Reliant Kore, MISC adds to its already impressive lineup of ships, a smaller introductory-class spacecraft. Utilizing advanced Xi’An designs, the Reliant features broad, sleek wings, omni-directional thrusters and a fully-articulated two-seat cockpit that supports horizontal and vertical flight modes. All of this combines with a larger carrying capacity than many ships in its class to make the Kore a natural choice for short-range hauling, or with the simple addition of a few optional components, this can-do ship can do anything you dream of."),
	misc_freelancer: new ShipType("misc_freelancer", "Freelancer", "MISC", 51, 3, 110000, "Freelancers are used as long haul merchant ships by major corporations, but they are just as frequently repurposed as dedicated exploration vessels by independent captains who want to operate on the fringes of the galaxy."),
	misc_starfarer: new ShipType("misc_starfarer", "Starfarer", "MISC", 816, 5, 300000, "The Starfarer differs from traditional bulk freighters in one key way: it is a dedicated fuel platform. The Starfarer is designed not only to load, store and protect fuel stasis units, it is designed to take in spaceborne hydrogen and then refine it for use without landing. The Starfarer can be used to ferry traditional bulk cargo pods but in such cases the fuel refining equipment would be useless. This equipment is modular and can be swapped out for another mission package for dry operations!"),

	orig_300i: new ShipType("orig_300i", "300i", "Origin", 4, 2, 55000, "If you\'re going to travel the stars... why not do it in style? The 300i is Origin Jumpworks\' premiere luxury spacecraft. It is a sleek, silver killer that sends as much of a message with its silhouette as it does with its particle cannons."),
	orig_315p: new ShipType("orig_315p", "315p", "Origin", 6, 2, 65000, "Exploration is man\'s highest calling. Prepare to chart distant horizons with man\'s most sophisticated piece of technology, the Origin 315p. Featuring a more robust power plant and a custom scanning package, exclusively designed by Chimera Communications."),
	orig_325a: new ShipType("orig_325a", "325a", "Origin", 4, 2, 70000, "Just because it\'s a rough galaxy doesn\'t mean you need to sacrifice your comfort: the 325a can come out on top in any dogfight. The 325a features an advanced weapon payload as well as a custom targeting system designed especially for the 325a by WillsOp."),

	rsi_aurora_es: new ShipType("rsi_aurora_es", "Aurora ES", "RSI", 12, 2, 20000, "The Aurora is the modern day descendant of the Roberts Space Industries X-7 spacecraft which tested the very first jump engines. Utilitarian to a T, the Aurora is the perfect beginner\'s ship: what it lacks in style it makes up for in ample room for upgrade modules."),
	rsi_aurora_mr: new ShipType("rsi_aurora_mr", "Aurora MR", "RSI", 12, 2, 25000, "Perhaps you\'re looking for something that offers carrying capacity but has combat capabilities too? The Aurora Marque comes with a pair of Behring-quality lasers and a high quality gun cooler system."),
	rsi_aurora_lx: new ShipType("rsi_aurora_lx", "Aurora LX", "RSI", 12, 2, 30000, "Be proud of your roots with the brand-new Aurora Deluxe, built for the discerning pilot who never forgets where he or she came from. The LX features patent leather interior to guarantee comfort for those long stretches in the deep black."),
	rsi_aurora_ln: new ShipType("rsi_aurora_ln", "Aurora LN", "RSI", 12, 2, 35000, "With a more robust shield generator and a pair of additional weapon hard points, the Legionnaire is a dedicated combat fighter, built to handle any obstacle the universe can throw at you."),
	rsi_aurora_cl: new ShipType("rsi_aurora_cl", "Aurora CL", "RSI", 23, 2, 45000, "Customized for mercantile and trading excursions, the Aurora Clipper is the perfect vessel for aspiring entrepreneurs and seasoned traders alike. Swapping a smaller power plant and armor capabilities for an expanded cargo capacity, the Clipper ups the ante for personal merchant craft."),
	rsi_constellation_andromeda: new ShipType("rsi_constellation_andromeda", "Constellation Andromeda", "RSI", 134, 4, 225000, "The Constellation Andromeda, a multi-person freighter, is the most popular ship in RSI\'s current production array. Constellations are beloved by smugglers and merchants alike because they are modular, high powered... and just downright iconic-looking."),
}

var _ship_ids = [];

for (var typeId in _ships) {
	if (_ships.hasOwnProperty(typeId)) {
		_ship_ids.push(typeId)
	}
}

var _shipIdToShip = function(shipId) {
	return Object.freeze(_ships[shipId]);
}

var _shipIdsToShips = function(shipIds) {
	array = [];
	for (var i = shipIds.length - 1; i >= 0; i--) {
		array[i] = Object.freeze(_ships[shipIds[i]]);
	};
	return array;
}

module.exports = {
	ship_ids: _ship_ids,
	shipIdToShip: _shipIdToShip,
	shipIdsToShips: _shipIdsToShips
}
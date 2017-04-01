var journal = require('./journal');
var shiptype = require('./shiptype');
var cargohold = require('./cargohold');

module.exports = {
	player: {
		name:null,
		spawn_location_id:null,
		quantum_location_id:null,
		destination:null,
		journal: new journal.Journal()
	},
	ship: {
		id:null,
		name:null,
		quantum_location_id:null,
		landing_pad_location_id:null,
		docked_shipcontact_id:null,
		cargo:null,
		isLanded: function() {
			return this.landing_pad_location_id != null;
		},
		isDocked: function() {
			return this.docked_shipcontact_id != null;
		},
		setType: function(id) {
			this.id = id;
			_shiptype = shiptype.shipIdToShip(id);
			this.cargo = new cargohold.CargoHold(_shiptype.cargo_hold_size);
		}
	}
}
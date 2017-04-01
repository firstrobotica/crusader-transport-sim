// map.js

var _showMap = function(locationId) {
		console.log("  ___________________________________________  ");
		console.log(" | 849                                       | ");
		console.log(" |                                           | ");
	if (locationId == "kareah") {
		console.log(" |                                 >SPK<_    | ");
	} else {
		console.log(" |                                  SPK__    | ");
	}
	if (locationId == "comm126") {
		console.log(" |      >126<                         |CL|   | ");
	} else {
		console.log(" |       126                          |CL|   | ");
	}
		console.log(" |                                     ```   | ");
	if (locationId == "comm275") {
		console.log(" |                   >275<                   | ");
	} else {	
		console.log(" |                    275                    | ");
	}
	if (locationId == "cryastro42") {
		console.log(" |            >42<                           | ");
	} else {
		console.log(" |             42                            | ");
	}
		console.log(" |                                           | ");
		console.log(" |                    ___                    | ");
	if (locationId == "comm306") {
		console.log(" |          >306<  PO|CRU|     472       151 | ");
	} else if (locationId == "port_olisar") {
		console.log(" |           306  >PO<CRU|     472       151 | ");
	} else if (locationId == "comm472") {
		console.log(" |           306   PO|CRU|    >472<      151 | ");
	} else if (locationId == "cryastro151") {
		console.log(" |           306   PO|CRU|     472      >151<| ");
	} else {
		console.log(" |           306   PO|CRU|     472       151 | ");
	}
		console.log(" |   __              |   |                   | ");
		console.log(" |  |YL|              ````                   | ");
	if (locationId == "grim_hex") {
		console.log(" |>GH<``                                     | ");
	} else {
		console.log(" | GH```                                     | ");
	}
	if (locationId == "comm625") {
		console.log(" |                   >625<            556    | ");
	} else if (locationId == "comm556") {
		console.log(" |                    625            >556<   | ");
	} else {
		console.log(" |                    625             556    | ");
	}
		console.log(" |                                           | ");
	if (locationId == "comm730") {
		console.log(" |     >730<                                 | ");
	} else {
		console.log(" |      730                                  | ");
	}
	if (locationId == "covalex") {
		console.log(" |                                 >CSH<_    | ");
	} else {
		console.log(" |                                  CSH__    | ");
	}
	if (locationId == "cryastro262") {
		console.log(" |             >262<                  |DM|   | ");
	} else {
		console.log(" |              262                   |DM|   | ");
	}
		console.log(" |                                     ```   | ");
		console.log(" |___________________________________________| ");
}

module.exports = {
	showMap: _showMap
}
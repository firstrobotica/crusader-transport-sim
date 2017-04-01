// random.js

function _randomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function _randomIntInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var _randomElementFromArray = function(items) {
	return items[Math.floor(Math.random()*items.length)];
}

module.exports = {
	randomNumberInRange: _randomNumberInRange,
	randomIntInRange: _randomIntInRange,
	randomElementFromArray: _randomElementFromArray,
}
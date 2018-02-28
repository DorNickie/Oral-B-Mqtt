var noble = require('noble'); 

var brushId = '341513e9b858';
console.log("start");

noble.startScanning(null,true);

noble.on('discover', function(peripheral) {
	if (peripheral.id == brushId) {
			console.log(peripheral.advertisement.manufacturerData.toString('hex'));
	}
});

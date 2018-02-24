var noble = require('noble'); 


var serviceUUID = 'a0f0ff0050474d5382084f72616c2d42'; //unknown Servce
var characteristicUUID = 'a0f0ff0850474d5382084f72616c2d42'; // (Brushing Time)


console.log("start");
scan();

function scan() {
	console.log("startScanning");
	noble.startScanning();
	noble.on('discover', function(peripheral) {
		if (peripheral.id == '341513e9b858') {
			console.log("device found, scan for data");
			noble.stopScanning();
			explore(peripheral);
		}
	});
}

function explore(peripheral) {
	peripheral.connect(function(error) {
		console.log('connected to peripheral: ' + peripheral.uuid);
		
		peripheral.discoverServices(serviceUUID, function(error, services) {	
			var deviceInformationService = services[0];
			
			deviceInformationService.discoverCharacteristics(characteristicUUID, function(error, characteristics) {
				var Characteristic = characteristics[0];
				
				Characteristic.on('data', function(data, isNotification) {
					
					//detectDisconnect(peripheral);
					
					console.log(data.toString('hex'));
						
				});
			});
		});
    });
}

/*  function detectDisconnect(peripheral){
	peripheral.on('disconnect', function() {
		console.log("disconnect");
		scan();
	});
} */

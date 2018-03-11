var noble = require('noble');
var mqtt = require('mqtt');

//Enter your peripheral Id
var sPeripheralId = '341513e9b858';
var sMqttServerIp = '192.168.1.108';
var sMqttTopic = 'WOHNUNG/ORALB';


var myBrush,sRawData;
console.log("start toothbrush Mqtt service");
var client  = mqtt.connect('mqtt://' + sMqttServerIp);
scan();

function scan() {
	noble.startScanning([],true);
	noble.on('discover', function(peripheral) {
		var device = peripheral;
		if (device.id == sSeripheralId) {
			explore(device);
		}
	});
}

function explore(peripheral){
	
	if (peripheral.advertisement.manufacturerData.toString('hex') != sRawData){
		sRawData = peripheral.advertisement.manufacturerData.toString('hex');
		
		sSector = sRawData.slice(21, 22); //1,2,3,4,5,6,f    f = finished
		iMinutes = sRawData.slice(15, 16);
		iSeconds = parseInt(sRawData.slice(16, 18), 16);
		
		if(sRawData.slice(11, 12) == 3){
			sState = 'brushing';
		} else if(sRawData.slice(11, 12) == 2) {
			sState = 'idle';
		} else if(sRawData.slice(11, 12) == 4) {
			sState = 'charging';
		} else {
			sState = 'unknow';
		}

		if(sRawData.slice(19, 20) == 0){
			sMode = 'off';
		} else if(sRawData.slice(19, 20) == 1){
			sMode = 'daily_clean';
		} else if(sRawData.slice(19, 20) == 2){
			sMode = 'sensitive';
		} else if(sRawData.slice(19, 20) == 3){
			sMode = 'massage';
		} else if(sRawData.slice(19, 20) == 4){
			sMode = 'whitening';
		} else if(sRawData.slice(19, 20) == 5){
			sMode = 'deep_clean';
		} else if(sRawData.slice(19, 20) == 6){
			sMode = 'tongue_cleaning';
		} else if(sRawData.slice(19, 20) == 7){ 
			sMode = 'turbo';
		} else {
			sMode = 'unknow';
		}
		
		if(sRawData.slice(12, 13) == 'c' || sRawData.slice(12, 13) == 8){
			bPressure = true;
		} else {
			bPressure = false;
		}
		
		myBrush = {
			'sector' : iSector,
			'minutes' : iMinutes,
			'seconds' : iSeconds,
			'state': sState,
			'mode' : sMode,
			'pressure' : bPressure
		}
		
		client.publish(sMqttTopic, JSON.stringify(myBrush));
		
	}
	
}

// Fetches "parts.json" and returns it's contents resolved in a promise
function fetchPartsList() {
	return fetch("./parts.json")
			.then(function(data) {
				return data.json();
			});
}

var promisedParts = fetchPartsList();
var settingOptionsOnLoad = true;

function wrapCpuOptions(parts) {
	var cpus = Object.keys(parts.cpus).sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	var options = '';
	for (var i = 0; i < cpus.length; i++) {
		options += '<option value="' + cpus[i] + '" />';
	}
	return options;
}

function wrapGpuOptions(parts) {
	var gpus = Object.keys(parts.gpus).sort(function (a, b) {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	var options = '';
	for (var i = 0; i < gpus.length; i++) {
		options += '<option value="' + gpus[i] + '" />';
	}
	return options;
}

function wrapRamSpeeds(parts, selectedValue) {
	var ramSpeeds = parts.ramSpeeds;
	var options = '';
	for (var i = 0; i < ramSpeeds.length; i++) {
		options += '<option' + (ramSpeeds[i] == selectedValue ? ' selected' : '') + '>' + ramSpeeds[i] + ' MHz</option>';
	}
	return options;
}

function setListOptions() {
	promisedParts.then(parts => {
		document.getElementById('cpuList').innerHTML = wrapCpuOptions(parts);
		document.getElementById('gpuList').innerHTML = wrapGpuOptions(parts);
	});
}

function setSelectOptions() {
	promisedParts.then(parts => {
		document.getElementById('form').ramSpeed.innerHTML = wrapRamSpeeds(parts, (settingOptionsOnLoad ? 2133 : 0));
	});
}

function calcCpuScore(parts, cpu, ramChannels, ramSpeed) {
	return Math.floor(
		(
			(parts.cpus[cpu].coreClockMultiplier * parts.cpus[cpu].frequency) +
			(parts.cpus[cpu].memChannelsMultiplier * ramChannels) +
			(parts.cpus[cpu].memClockMultiplier * ramSpeed) +
			(parts.cpus[cpu].finalAdjustment)
		) * 298
	)
}

function calcGpuScore(parts, gpu, gpuCount) {
	if (gpuCount == "1") {
		return parts.gpus[gpu].singleGPUGraphicsScore
	} else if (gpuCount == "2") {
		return parts.gpus[gpu].doubleGPUGraphicsScore
	}
}

function calcSystemScore(cpuScore, gpuScore) {
	return Math.floor(1 /((0.85 / gpuScore) + (0.15 / cpuScore)));
}

function calcSystemWattage(parts, cpu, gpu, gpuCount) {
	var systemWattage = 30;
	var gpu1 = gpu;
	var gpu2 = gpuCount == 2 ? gpu : "";

	if (cpu != "" && parts.cpus[cpu] != null) {
		systemWattage += parts.cpus[cpu].wattage;
	}
	if (gpu1 != "" && parts.gpus[gpu1] != null) {
		systemWattage += parts.gpus[gpu1].wattage;
	}
	if (gpu2 != "" && parts.gpus[gpu2] != null) {
		systemWattage += parts.gpus[gpu2].wattage;
	}
	return systemWattage;
}

// idk how this works but it works so yeah
function cpuSupportsGpu(cpu, gpu, parts) {
	if (cpu == "" || gpu == "" || parts.cpus[cpu] == null || parts.gpus[gpu] == null) {
		return false
	} else {
		var performXWayCheck = false
		var xWaySockets
		if (parts.gpus[gpu].isHEMPart) {
			// 2-way
			if (parts.gpus[gpu].partName.toUpperCase().includes("(2-WAY)")) {
				performXWayCheck = true
				xWaySockets = [
					"LGA 2011-V3",
					"LGA 2066",
					"LGA 2566",
					"LGA 3647-V1",
					"LGA 3647-V3",
					"LGA 3647-V3 (2P)",
					"LGA 3647-V3 (4P)",
					"LGA 3647-V3 (8P)",
					"LGA 4189",
					"LGA 4189 (2P)",
					"LGA 4926",
					"LGA 4926 (2P)",
					"LGA 5903",
					"LGA 5903 (2P)",
					"SP3r1",
					"SP3r1 (2P)",
					"SP3r2",
					"SP3r2 (2P)",
					"SP6",
					"SP6 (2P)",
					"TR4",
					"sTRX4"
				]
			}

			// 4-way
			else if (parts.gpus[gpu].partName.toUpperCase().includes("(4-WAY)")) {
				performXWayCheck = true
				xWaySockets = [
					"LGA 3647-V3 (2P)",
					"LGA 3647-V3 (4P)",
					"LGA 3647-V3 (8P)",
					"LGA 4189 (2P)",
					"LGA 4926 (2P)",
					"LGA 5903 (2P)",
					"SP3r1 (2P)",
					"SP3r2 (2P)",
					"SP6 (2P)"
				]
			}

			// 6-way
			else if (parts.gpus[gpu].partName.toUpperCase().includes("(6-WAY)")) {
				performXWayCheck = true
				xWaySockets = [
					"LGA 3647-V3 (2P)",
					"LGA 3647-V3 (4P)",
					"LGA 3647-V3 (8P)",
					"LGA 4189 (2P)",
					"LGA 4926 (2P)",
					"LGA 5903 (2P)",
					"SP3r1 (2P)",
					"SP3r2 (2P)",
					"SP6 (2P)"
				]
			}

			// 8-way
			else if (parts.gpus[gpu].partName.toUpperCase().includes("(8-WAY)")) {
				performXWayCheck = true
				xWaySockets = [
					"LGA 3647-V3 (4P)",
					"LGA 3647-V3 (8P)"
				]
			}
		}

		if ((performXWayCheck) &&
			(!xWaySockets.includes(parts.cpus[cpu].cpuSocket))) {
			return false
		}

		return true
	}
}

function verifyParts(cpu, ramChannels, gpu, gpuCount, parts) {
	var alertMessage = "";
	if (!parts.cpus[cpu])
		alertMessage = "CPU not found.";
	else if (ramChannels > parts.cpus[cpu].maxMemoryChannels)
		alertMessage = "CPU only supports " + parts.cpus[cpu].maxMemoryChannels + " RAM Channels.";
	else if (!parts.gpus[gpu])
		alertMessage = "GPU not found.";
	else if (!cpuSupportsGpu(cpu, gpu, parts))
		alertMessage = "CPU does not support GPU.";
	else if (gpuCount == "2" && parts.gpus[gpu].multiGPU == null)
		alertMessage = "Selected GPU does not support multi-GPU.";
	
	if (alertMessage != "") {
		alert(alertMessage);
		return false;
	}

	return true;
}

function calculateScore() {
	form = document.getElementById('form');
	var cpu = form.cpu.value
	var ramSpeed = parseInt(form.ramSpeed.value)
	var ramChannels = form.ramChannels.value
	var gpu = form.gpu.value
	var gpuCount = form.gpuCount.value

	promisedParts.then(parts => {
		if (!verifyParts(cpu, ramChannels, gpu, gpuCount, parts)) return;

		var cpuScore = calcCpuScore(parts, cpu, ramChannels, ramSpeed);
		var gpuScore = calcGpuScore(parts, gpu, gpuCount);
		var systemScore = calcSystemScore(cpuScore, gpuScore);
		var gpuCooling = parts.gpus[gpu].gpuType;
		var systemWatts = calcSystemWattage(parts, cpu, gpu, gpuCount);
		var cpuPriceNew = parts.cpus[cpu].price;
		var cpuPriceUsed = parts.cpus[cpu].sellPrice;
		var gpuPriceNew = gpuCount * parts.gpus[gpu].price;
		var gpuPriceUsed = gpuCount * parts.gpus[gpu].sellPrice;

		console.log(cpuScore);
	
		document.getElementById('cpuScore').innerText = cpuScore;
		document.getElementById('gpuScore').innerText = gpuScore;
		document.getElementById('systemScore').innerText = systemScore;
		document.getElementById('gpuCooling').innerText = gpuCooling;
		document.getElementById('systemWatts').innerText = systemWatts + ' W';
		document.getElementById('cpuPriceNew').innerText = '$' + cpuPriceNew;
		document.getElementById('cpuPriceUsed').innerText = '$' + cpuPriceUsed;
		document.getElementById('gpuPriceNew').innerText = '$' + gpuPriceNew;
		document.getElementById('gpuPriceUsed').innerText = '$' + gpuPriceUsed;
	});
}

// Run after DOM
window.onload = function() {
	setListOptions();
	setSelectOptions();
	settingOptionsOnLoad = false;
}
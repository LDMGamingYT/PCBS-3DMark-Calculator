function addDrive() {
	const parent = document.getElementById("storage-drives");
	const _thisDriveIndex = parseInt(parent.getAttribute("data-drives")) + 1;

	const icon = document.createElement("i");
	icon.className = "fa-solid fa-hard-drive";

	const header = document.createElement("span");
	header.id = `storage-header-${_thisDriveIndex}`;
	header.appendChild(icon);
	header.appendChild(document.createTextNode(` Drive #${_thisDriveIndex}`));

	const input = document.createElement("input");
	input.name = `storage${_thisDriveIndex}`;
	input.id = `storage-${_thisDriveIndex}`;
	input.list = "storageDriveList";
	input.value = document.getElementById(`storage-${_thisDriveIndex-1}`).value;

	parent.setAttribute("data-drives", _thisDriveIndex)
	document.getElementById("remove-drive-button").disabled = false;

	parent.appendChild(header);
	parent.appendChild(input);
}

function removeDrive() {
	const parent = document.getElementById("storage-drives");
	const _driveIndex = parseInt(parent.getAttribute("data-drives"));

	parent.removeChild(document.getElementById(`storage-${_driveIndex}`))
	parent.removeChild(document.getElementById(`storage-header-${_driveIndex}`))
	parent.setAttribute("data-drives", _driveIndex - 1)

	if (parent.getAttribute("data-drives") == "1") {
		document.getElementById("remove-drive-button").disabled = true;
	}
}

function setOptions() {
	promisedParts.then(parts => {
		document.getElementById('motherboardList').innerHTML = wrapOptions(parts, "motherboards");
		document.getElementById('dimmList').innerHTML = wrapOptions(parts, "dimms");
		document.getElementById('storageDriveList').innerHTML = wrapOptions(parts, "storageDrives");
		document.getElementById('caseList').innerHTML = wrapOptions(parts, "cases");
	});
}

async function createDriveSpec(i) {
	const parent = document.getElementById("storage-specs-wrapper");

	const header = document.createElement("span");
	header.style = "font-weight: bold;";
	header.appendChild(document.createTextNode(`Drive #${i}`));

	const manufacturerHeader = document.createElement("span");
	const manufacturerIcon = document.createElement("i");
	manufacturerIcon.className = "fa-solid fa-hammer";
	const manufacturer = document.createElement("span");
	manufacturer.id = `storage${i}Manufacturer`;
	manufacturerHeader.appendChild(manufacturerIcon);
	manufacturerHeader.appendChild(document.createTextNode(" Manufacturer"));

	const sizeHeader = document.createElement("span");
	const sizeIcon = document.createElement("i");
	sizeIcon.className = "fa-solid fa-hard-drive";
	const size = document.createElement("span");
	size.id = `storage${i}Size`;
	sizeHeader.appendChild(sizeIcon);
	sizeHeader.appendChild(document.createTextNode(" Size"));

	const typeHeader = document.createElement("span");
	const typeIcon = document.createElement("i");
	typeIcon.className = "fa-solid fa-hard-drive";
	const type = document.createElement("span");
	type.id = `storage${i}Type`;
	typeHeader.appendChild(typeHeader);
	typeHeader.appendChild(document.createTextNode(" Type"));

	const speedHeader = document.createElement("span");
	const speedIcon = document.createElement("i");
	speedIcon.className = "fa-solid fa-gauge";
	const speed = document.createElement("span");
	speed.id = `storage${i}Speed`;
	speedHeader.appendChild(speedIcon);
	speedHeader.appendChild(document.createTextNode(" Speed"));

	const heatsinkHeader = document.createElement("span");
	const heatsinkIcon = document.createElement("i");
	heatsinkIcon.className = "fa-solid fa-fire";
	const heatsink = document.createElement("span");
	heatsink.id = `storage${i}Heatsink`;
	heatsinkHeader.appendChild(heatsinkIcon);
	heatsinkHeader.appendChild(document.createTextNode(" Has Heatsink"));

	const newPriceHeader = document.createElement("span");
	const newPriceIcon = document.createElement("i");
	newPriceIcon.className = "fa-solid fa-tags";
	const newPrice = document.createElement("span");
	newPrice.id = `storage${i}PriceNew`;
	newPriceHeader.appendChild(newPriceIcon);
	newPriceHeader.appendChild(document.createTextNode(" New Price"));

	const usedPriceHeader = document.createElement("span");
	const usedPriceIcon = document.createElement("i");
	usedPriceIcon.className = "fa-solid fa-tag";
	const usedPrice = document.createElement("span");
	usedPrice.id = `storage${i}PriceUsed`;
	usedPriceHeader.appendChild(usedPriceIcon);
	usedPriceHeader.appendChild(document.createTextNode(" Used Price"));

	parent.appendChild(header);
	parent.appendChild(document.createElement("span"));

	parent.appendChild(manufacturerHeader);
	parent.appendChild(manufacturer);

	parent.appendChild(sizeHeader);
	parent.appendChild(size);

	parent.appendChild(typeHeader);
	parent.appendChild(type);

	parent.appendChild(speedHeader);
	parent.appendChild(speed);

	parent.appendChild(heatsinkHeader);
	parent.appendChild(heatsink);

	parent.appendChild(newPriceHeader);
	parent.appendChild(newPrice);

	parent.appendChild(usedPriceHeader);
	parent.appendChild(usedPrice);
}

/**
 * This method assumes that {cpuName} is a valid CPU in parts.json.
 * @returns {Boolean}
 */
function verifyOtherParts(motherboardName, dimmName, caseName, gpuCount, cpuName, ramCount, parts) {
	var alertMessage = "";
	var motherboard;
	var dimm;
	var computerCase;
	var cpu = parts.cpus[cpuName];
	if (!(motherboard = parts.motherboards[motherboardName]))
		alertMessage = "Motherboard does not exist.";
	else if (!(dimm = parts.dimms[dimmName]))
		alertMessage = "DIMM(s) do not exist.";
	else if (!(computerCase = parts.cases[caseName]))
		alertMessage = "Case does not exist.";
	else if (motherboard.dualGpuMaxSlotSize <= gpuCount)
		alertMessage = `Motherboard does not have enough PCIe slots for ${gpuCount} GPUs.`;
	else if (cpu.cpuSocket != motherboard.cpuSocket)
		alertMessage = `${motherboard.cpuSocket} Motherboard cannot fit ${cpu.cpuSocket} CPU.`;
	else if (dimm.ramType == motherboard.ramType)
		alertMessage = `Motherboard has ${motherboard.ramType} slots, while DIMM uses ${dimm.ramType}`;
	else if (ramCount <= motherboard.ramSlots)
	  alertMessage = `Motherboard cannot fit ${ramCount} DIMM(s), only has ${motherboard.ramSlots} slot(s).`;
	else if (ramSpeed <= motherboard.maxMemorySpeed)
  		alertMessage = `RAM speed exceeds motherboard maximum.`;
	else if (computerCase.motherboardSize.split(", ").includes(motherboard.motherboardSize))
		alertMessage = "Motherboard cannot fit inside case.";
	
	if (alertMessage != "") {
		showAlert(alertMessage);
		return false;
	}

	return true;
}


class Build {
	constructor(motherboard, cpu, gpu, gpuCount, dimms, ramChannels, ramSpeed, drives, computerCase) {
		this.motherboard = motherboard;
		this.cpu = cpu;
		this.gpu = gpu;
		this.gpuCount = parseInt(gpuCount);
		this.dimms = dimms;
		this.ramChannels = parseInt(ramChannels);
		this.ramSpeed = parseInt(ramSpeed);
		this.drives = drives;
		this.computerCase = computerCase;
	}
}

/**
 * @returns {Build} or null
 */
function getBuild() {
	const form = document.getElementById("form");
	var drives = [];
	var buildValidity;

	promisedParts.then(parts => {
		buildValidity = verifyParts(build.cpu, build.ramChannels, build.gpu, build.gpuCount, parts) 
						&& verifyOtherParts(build.motherboard, build.dimms, build.computerCase, build.gpuCount, build.cpu, build.ramChannels, parts);
		if (!buildValidity) return;

		for (let i = 1; i <= parseInt(document.getElementById("storage-drives").getAttribute("data-drives")); i++) {
			var name = document.getElementById(`storage-${i}`).value;
			
			if (!parts.storageDrives[name]) {
				showAlert(`Drive #${i} does not exist.`);
				buildValidity = false;
				break;
			} else {
				drives.push(parts.storageDrives[name]);
			}
		}
	});

	var build = new Build(
		form.motherboard.value,
		form.cpu.value,
		form.gpu.value,
		form.gpuCount.value,
		form.dimms.value,
		form.ramChannels.value,
		form.ramSpeed.value,
		drives,
		form.computerCase.value
	);

	if (!buildValidity)
		return null;
	return build;
}

function calculateSpecs() {
	var build = getBuild();
	if (build === null) return;
	
	console.log(getBuild().drives);
}

window.onload = function() {
	// these methods are from 3dmark_calculator.js
	setListOptions();
	setSelectOptions();

	setOptions();
};
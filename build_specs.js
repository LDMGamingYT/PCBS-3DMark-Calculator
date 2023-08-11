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

async function loadSpecSheet(cpu, gpu, motherboard, memory, drives, computerCase) {
	// CPU
	document.getElementById("cpuManufacturer").innerHTML = cpu.manufacturer;
	document.getElementById("cpuSocket").innerHTML = cpu.cpuSocket;
	document.getElementById("cpuFrequency").innerHTML = cpu.frequency + " MHz";
	document.getElementById("cpuDefaultMemorySpeed").innerHTML = cpu.defaultMemorySpeed + " MHz";;
	document.getElementById("cpuMaxRamChannels").innerHTML = cpu.maxMemoryChannels;
	document.getElementById("cpuWattage").innerHTML = cpu.wattage + " W";;
	document.getElementById("cpuPriceNew").innerHTML = "$" + cpu.price;
	document.getElementById("cpuPriceUsed").innerHTML = "$" + cpu.sellPrice;
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
	else if (ramCount > motherboard.ramSlots)
	  alertMessage = `Motherboard cannot fit ${ramCount} DIMM(s), only has ${motherboard.ramSlots} slot(s).`;
	else if (ramSpeed <= motherboard.maxMemorySpeed)
  		alertMessage = `RAM speed exceeds motherboard maximum.`;
	else if (!computerCase.motherboardSize.slice(0, -1).split(", ").includes(motherboard.motherboardSize)) 
		alertMessage = `${motherboard.motherboardSize} Motherboard cannot fit inside case (supports ${computerCase.motherboardSize.slice(0, -1)} motherboards).`;
	if (alertMessage != "") {
		showAlert(alertMessage, 5000);
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

	/**
	 * @returns {Promise<Build> | Promise<null>}
	 */
	static get() {
		const form = document.getElementById("form");
		var drives = [];
		var driveValidity = true;

		return promisedParts.then(parts => {
			for (let i = 1; i <= parseInt(document.getElementById("storage-drives").getAttribute("data-drives")); i++) {
				var name = document.getElementById(`storage-${i}`).value;
				
				if (!parts.storageDrives[name]) {
					showAlert(`Drive #${i} does not exist.`);
					driveValidity = false;
					break;
				} else {
					drives.push(parts.storageDrives[name]);
				}
			}

			if (!driveValidity 
				|| !verifyParts(form.cpu.value, form.ramChannels.value, form.gpu.value, form.gpuCount.value, parts) 
				|| !verifyOtherParts(form.motherboard.value, form.dimms.value, form.computerCase.value, form.gpuCount.value, form.cpu.value, form.ramChannels.value, parts))
				return null;

			return new Build(
				parts.motherboards[form.motherboard.value],
				parts.cpus[form.cpu.value],
				parts.gpus[form.gpu.value],
				form.gpuCount.value,
				parts.dimms[form.dimms.value],
				form.ramChannels.value,
				form.ramSpeed.value,
				drives,
				parts.cases[form.computerCase.value]
			);
		});
	}
}

function calculateSpecs() {
	Build.get().then(build => {
		if (build === null) return;
		loadSpecSheet(build.cpu, build.gpu, build.motherboard, build.dimms, build.drives, build.computerCase);
	});
}

window.onload = function() {
	// these methods are from 3dmark_calculator.js
	setListOptions();
	setSelectOptions();

	setOptions();
};
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
	manufacturerHeader.appendChild(Icon);
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
	typeHeader.appendChild(Icon);
	typeHeader.appendChild(document.createTextNode(" Type"));

	const speedHeader = document.createElement("span");
	const speedIcon = document.createElement("i");
	speedIcon.className = "fa-solid fa-gauge";
	const speed = document.createElement("span");
	speed.id = `storage${i}Speed`;
	speedHeader.appendChild(Icon);
	speedHeader.appendChild(document.createTextNode(" Speed"));

	const heatsinkHeader = document.createElement("span");
	const heatsinkIcon = document.createElement("i");
	heatsinkIcon.className = "fa-solid fa-fire";
	const heatsink = document.createElement("span");
	heatsink.id = `storage${i}Heatsink`;
	heatsinkHeader.appendChild(Icon);
	heatsinkHeader.appendChild(document.createTextNode(" Has Heatsink"));

	const newPriceHeader = document.createElement("span");
	const newPriceIcon = document.createElement("i");
	newPriceIcon.className = "fa-solid fa-tags";
	const newPrice = document.createElement("span");
	newPrice.id = `storage${i}PriceNew`;
	newPriceHeader.appendChild(Icon);
	newPriceHeader.appendChild(document.createTextNode(" New Price"));

	const usedPriceHeader = document.createElement("span");
	const usedPriceIcon = document.createElement("i");
	usedPriceIcon.className = "fa-solid fa-tag";
	const usedPrice = document.createElement("span");
	usedPrice.id = `storage${i}PriceUsed`;
	usedPriceHeader.appendChild(Icon);
	usedPriceHeader.appendChild(document.createTextNode(" Used Price"));

	// TODO: Add all of these to parent
}

function calculateSpecs() {

}

window.onload = function() {
	// these methods are from 3dmark_calculator.js
	setListOptions();
	setSelectOptions();

	setOptions();
};
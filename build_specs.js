function addDrive() {
	const parent = document.getElementById("storage-drives");
	const _thisDriveIndex = parseInt(parent.getAttribute("data-drives")) + 1;

	const icon = document.createElement("i");
	icon.className = "fa-solid fa-hard-drive";

	const header = document.createElement("span");
	header.appendChild(icon);
	header.appendChild(document.createTextNode(` Drive #${_thisDriveIndex}`));

	const input = document.createElement("input");
	input.name = `storage`;
	input.id = `storage-${_thisDriveIndex}`;
	input.list = "storageDriveList";
	input.value = document.getElementById(`storage-${_thisDriveIndex-1}`).value;

	parent.setAttribute("data-drives", _thisDriveIndex)

	parent.appendChild(header);
	parent.appendChild(input);
}

function removeDrive() {
	const parent = document.getElementById("storage-drives");
	const _driveIndex = parseInt(parent.getAttribute("data-drives"));

	parent.removeChild(document.getElementById(`storage-${_driveIndex}`))
}

function calculateSpecs() {

}

function setOptions() {
	promisedParts.then(parts => {
		document.getElementById('motherboardList').innerHTML = wrapOptions(parts, "motherboards");
		document.getElementById('dimmList').innerHTML = wrapOptions(parts, "dimms");
		document.getElementById('storageDriveList').innerHTML = wrapOptions(parts, "storageDrives");
		document.getElementById('caseList').innerHTML = wrapOptions(parts, "cases");
	});
}

window.onload = function() {
	// these methods are from 3dmark_calculator.js
	setListOptions();
	setSelectOptions();

	setOptions();
};
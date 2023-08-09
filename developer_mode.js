function createButton(text, method) {
	const button = document.createElement("button");
	button.innerHTML = text;
	button.setAttribute("onclick", method);

	document.getElementById("buttonPanel").appendChild(button);
}

function prn() {
	showAlert(`Local storage is visible in the <b>console</b>.`)
	console.log(window.localStorage);
}

function add() {
	var rand = Math.round(Math.random()*100);
	showAlert(`Marking achievement #${rand} as completed.`)
	completeAchievement(rand);
}

function del() {
	delete window.localStorage.completed_achievements;
	showAlert("All items in local storage have been permanently deleted.");
}

window.onload = function() {
	showAlert("This page was created for development purposes! If you don't know what you're doing, <b>GO BACK!</b> It is possible to erase <b>ALL YOUR DATA</b> from this page!")
};
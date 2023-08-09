function prn() {
	console.log(window.localStorage);
}

function add() {
	var rand = Math.round(Math.random()*100);
	console.log(`Marking achievement #${rand} as completed`)
	completeAchievement(rand);
}

function del() {
	delete window.localStorage.completed_achievements;
	showAlert("Cleared local storage");
} 
function showAlert(message) {
	var alertBox = document.getElementById("alertBox");
	document.getElementById("alertMessage").innerHTML = message;
	alertBox.setAttribute("data-active", "true");
	setTimeout(function() {
		alertBox.setAttribute("data-active", "false")
	}, 2500);
}
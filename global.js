function showAlert(message, ms = 2500) {
	var alertBox = document.getElementById("alertBox");
	document.getElementById("alertMessage").innerHTML = message;
	alertBox.setAttribute("data-active", "true");
	setTimeout(function() {
		alertBox.setAttribute("data-active", "false")
	}, ms);
}
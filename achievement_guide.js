const uncheckedIcon = "fa-regular fa-square achievement-completed-icon";
const checkedIcon = "fa-solid fa-square-check achievement-completed-icon"

async function fetchAchievementsList() {
	return fetch("./assets/data/achievements.json")
			.then(function(data) {
				return data.json();
			});
}

async function createAchievement(group) {
	const parent = document.getElementById(`${group}-achievements`);

	const card = document.createElement("div");
	card.className = "achievement";

	const icon = document.createElement("img");
	icon.className = "achievement-icon";
	icon.alt = "Achievement icon"

	const metaWrapper = document.createElement("div");

	const title = document.createElement("div");
	title.className = "achievement-title";

	const description = document.createElement("div");
	description.className = "achievement-description";

	const reward = document.createElement("div");
	reward.className = "achievement-reward";

	const trophyIcon = document.createElement("i");
	trophyIcon.className = "fa-solid fa-trophy";

	const xp = document.createElement("span");
	xp.className = "achievement-xp";

	const rarity = document.createElement("div");
	rarity.className = "achievement-rarity gray";

	const checkbox = document.createElement("button");
	checkbox.className = "achievement-completed";
	checkbox.setAttribute("group", group);

	const checkboxIcon = document.createElement("i");
	checkboxIcon.className = "fa-regular fa-square achievement-completed-icon";

	checkbox.appendChild(checkboxIcon);

	reward.appendChild(trophyIcon);
	reward.appendChild(document.createTextNode("\u00A0"));
	reward.appendChild(xp);

	metaWrapper.appendChild(title);
	metaWrapper.appendChild(description);
	metaWrapper.appendChild(reward);
	metaWrapper.appendChild(rarity);

	card.appendChild(icon);
	card.appendChild(metaWrapper);
	card.appendChild(checkbox);

	parent.appendChild(card);
}

function calcRewardColor(xp) {
	if (xp < 50) return "bronze";
	else if (xp < 100) return "silver";
	else return "gold";
}

function getCompletedAchievements() {
	if (window.localStorage.completed_achievements == undefined) window.localStorage.completed_achievements = "[]"
	return JSON.parse(window.localStorage.completed_achievements)
}

async function loadAchievement(cardIndex, achievement) {
	document.getElementsByClassName("achievement-icon")[cardIndex].src = `assets/achievements/${achievement.title}.png`;
	document.getElementsByClassName("achievement-title")[cardIndex].innerHTML = achievement.title;
	document.getElementsByClassName("achievement-description")[cardIndex].innerHTML = achievement.description;
	document.getElementsByClassName("achievement-reward")[cardIndex].className = `achievement-reward ${calcRewardColor(achievement.xp)}`;
	document.getElementsByClassName("achievement-xp")[cardIndex].innerHTML = `${achievement.xp} XP`;
	document.getElementsByClassName("achievement-rarity")[cardIndex].innerHTML = `${achievement.rarity}% of player have this achievement`;

	const _checkbox = document.getElementsByClassName("achievement-completed")[cardIndex];
	const _complete = getCompletedAchievements().includes(achievement.id);
	_checkbox.id = `achievement-${achievement.id}`;
	_checkbox.setAttribute("onclick", `onAchievementCheckboxClicked(${achievement.id})`);
	_checkbox.setAttribute("data-checked", _complete);

	const _icon = document.getElementsByClassName("achievement-completed-icon")[cardIndex];
	_icon.id = `achievement-icon-${achievement.id}`;
	_icon.className = _complete ? checkedIcon : uncheckedIcon;
}

const promisedAchievements = fetchAchievementsList();

function recalcCompletion(group) {
	promisedAchievements.then(achievements => {
		var xp = 0;
		var i = 1;

		achievements[group].forEach(achievement => {
			if (getCompletedAchievements().includes(i)) {
				xp += achievement.xp;
			}
			i++;
		});

		document.getElementById(`${group}-xp`).innerText = xp;
		document.getElementById(`${group}-completion`).innerText = Math.round(getCompletedAchievements().length / achievements[group].length * 100);
		document.getElementById(`${group}-total`).innerText = achievements[group].length;
		document.getElementById(`${group}-completed`).innerText = getCompletedAchievements().length;
	});
}

async function updateAchievements(group) {
	promisedAchievements.then(achievements => {
		var i = 0;
		achievements[group].forEach(achievement => {
			createAchievement(group);
			loadAchievement(i, achievement);
			i++;
		});
	});
}

function completeAchievement(id) {
    if (window.localStorage.completed_achievements == undefined) window.localStorage.completed_achievements = "[]"
    let completedAchievements = JSON.parse(window.localStorage.completed_achievements);

    completedAchievements.push(id);

    window.localStorage.completed_achievements = JSON.stringify([...new Set(completedAchievements)]);
}

function uncompleteAchievement(id) {
    if (window.localStorage.completed_achievements == undefined) window.localStorage.completed_achievements = "[]"
    let completedAchievements = JSON.parse(window.localStorage.completed_achievements);

	if (!completedAchievements.includes(id)) {
		console.warn("Achievement uncompleted, but achievement is not complete in the first place. Ignoring.");
		return;
	}

    completedAchievements = completedAchievements.filter(val => val !== id)
    window.localStorage.completed_achievements = JSON.stringify([...new Set(completedAchievements)]);
}

function onAchievementCheckboxClicked(id) {
	const checkbox = document.getElementById(`achievement-${id}`);
	const icon = document.getElementById(`achievement-icon-${id}`);

	if (checkbox.getAttribute("data-checked") == "true") {
		uncompleteAchievement(id);
		icon.className = uncheckedIcon;
		checkbox.setAttribute("data-checked", "false");
	} else {
		completeAchievement(id);
		icon.className = checkedIcon;
		checkbox.setAttribute("data-checked", "true");
	}

	recalcCompletion(checkbox.getAttribute("group"));
}

window.onload = function() {
	updateAchievements("pcbs2");
	recalcCompletion("pcbs2");
};
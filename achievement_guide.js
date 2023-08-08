async function fetchAchievementsList() {
	return fetch("./achievements.json")
			.then(function(data) {
				return data.json();
			});
}

async function createAchievement() {
	const parent = document.getElementById("achievementWrapper");

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

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "achievement-completed";

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

async function loadAchievement(cardIndex, achievement) {
	document.getElementsByClassName("achievement-icon")[cardIndex].src = `assets/${achievement.title}.png`;
	document.getElementsByClassName("achievement-title")[cardIndex].innerHTML = achievement.title;
	document.getElementsByClassName("achievement-description")[cardIndex].innerHTML = achievement.description;
	document.getElementsByClassName("achievement-reward")[cardIndex].className = `achievement-reward ${calcRewardColor(achievement.xp)}`;
	document.getElementsByClassName("achievement-xp")[cardIndex].innerHTML = `${achievement.xp} XP`;
	document.getElementsByClassName("achievement-rarity")[cardIndex].innerHTML = `${achievement.rarity}% of player have this achievement`;
	document.getElementsByClassName("achievement-completed")[cardIndex].id = `achievement-${achievement.id}`;
}

const promisedAchievements = fetchAchievementsList();

async function updateAchievements() {
	promisedAchievements.then(achievements => {
		var i = 0;
		achievements.pcbs2.forEach(achievement => {
			createAchievement();
			loadAchievement(i, achievement);
			i++;
		});
	});
}

window.onload = function() {
	updateAchievements();
};
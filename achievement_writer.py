import json

def main():
    while True:
        title = input("Achievement title? ")
        description = input("Description? ")
        xp = input("Awarded XP? ").replace(" XP", "")
        rarity = input("How many players unlocked it? ").replace("% of players unlock", "")
        
        achievement = {
            "title": title,
            "description": description,
            "xp": int(xp),
            "rarity": float(rarity)
        }
        
        add_achievement(achievement)

def add_achievement(achievement):
    try:
        with open('achievements.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {}
    
    category = "pcbs2"
    if category not in data:
        data[category] = []
    
    if data[category]:
        existing_ids = [entry["id"] for entry in data[category]]
        new_id = max(existing_ids) + 1
    else:
        new_id = 1
    
    achievement["id"] = new_id
    data[category].append(achievement)
    
    with open('achievements.json', 'w') as file:
        json.dump(data, file, indent=4)
    
    print("Achievement added!")

if __name__ == "__main__":
    main()

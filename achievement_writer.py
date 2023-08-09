import json

def main():
    while True:
        title = input("Achievement title? ")
        description = input("Description? ")
        _id = input("Unique ID? ")
        xp = input("Awarded XP? ")
        rarity = input("How many players unlocked it? ")
        
        achievement = {
            "title": title,
            "description": description,
            "id": int(_id),
            "xp": int(xp),
            "rarity": int(rarity)
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
    
    data[category].append(achievement)
    
    with open('achievements.json', 'w') as file:
        json.dump(data, file, indent=4)
    
    print("Achievement added!")

if __name__ == "__main__":
    main()

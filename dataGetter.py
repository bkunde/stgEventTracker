import requests
from bs4 import BeautifulSoup
import json
import time
import uuid
from datetime import datetime

def fetch_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    return response.text

def parse_events(html):
    soup = BeautifulSoup(html, "html.parser")

    events = []

    # You will customize this based on the site structure
    event_cards = soup.find_all("div", class_="event")

    for card in event_cards:
        try:
            title = card.find("h2").text.strip()
            date = card.find("span", class_="date").text.strip()
            time_text = card.find("span", class_="time").text.strip()
            location = card.find("span", class_="location").text.strip()
            description = card.find("p").text.strip()

            event = {
                "id": str(uuid.uuid4()),
                "title": title,
                "date": format_date(date),
                "time": format_time(time_text),
                "location": location,
                "category": categorize(title, description),
                "description": description,
                "image": get_placeholder_image(),
                "attendees": 0,
                "created": int(time.time() * 1000)
            }

            events.append(event)

        except Exception as e:
            print("Skipping event:", e)

    return events

def format_date(date_str):
    # Example: "March 28, 2026" → "2026-03-28"
    try:
        dt = datetime.strptime(date_str, "%B %d, %Y")
        return dt.strftime("%Y-%m-%d")
    except:
        return datetime.now().strftime("%Y-%m-%d")


def format_time(time_str):
    # Example: "6:00 PM" → "18:00"
    try:
        dt = datetime.strptime(time_str, "%I:%M %p")
        return dt.strftime("%H:%M")
    except:
        return "18:00"

def categorize(title, description):
    text = (title + " " + description).lower()

    if "music" in text or "concert" in text or "jazz" in text:
        return "music"
    elif "food" in text or "market" in text:
        return "food"
    elif "art" in text or "gallery" in text:
        return "art"
    elif "sports" in text:
        return "sports"
    else:
        return "general"

# TODO: map basic stock images to categories
def get_placeholder_image():
    return "https://picsum.photos/640/360"

def save_events(events):
    with open("events.json", "w") as f:
        json.dump(events, f, indent=2)

def main():
    url = "https://www.sgcityutah.gov/activity/special_events/index.php"
    html = fetch_page(url)
    events = parse_events(html)
    save_events(events)

if __name__ == "__main__":
    main()

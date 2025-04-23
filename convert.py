# Scrip para convertir el json de credentials fire base a un string para .env
import json

with open("data/firebase-creds.json", "r") as f:
    creds = json.load(f)
    creds_str = json.dumps(creds)
    print("🔥 PEGA ESTO EN TU .env:")
    print(f'FIREBASE_CREDENTIALS={creds_str}')

# Validar los valores de las variables de entorno necesarias para el funcionamiento del script.
import os
import json
from dotenv import load_dotenv

load_dotenv()

REQUIRED_ENV_VARS = [
    "LOG_USER",
    "LOG_PASS",
    "GROQ_API_KEY",
    "FIREBASE_BUCKET",
    "FIREBASE_CREDENTIALS"
]

def validate_env():
    print("🔍 Validando variables del entorno...\n")
    all_ok = True

    for var in REQUIRED_ENV_VARS:
        value = os.environ.get(var)
        if not value:
            print(f"❌ {var} no está definida.")
            all_ok = False
        else:
            print(f"✅ {var} está definida.")

    # Validar que FIREBASE_CREDENTIALS sea JSON válido
    firebase_raw = os.environ.get("FIREBASE_CREDENTIALS")
    if firebase_raw:
        try:
            firebase_json = json.loads(firebase_raw)
            if not isinstance(firebase_json, dict):
                print("❌ FIREBASE_CREDENTIALS no es un JSON de tipo objeto.")
                all_ok = False
            else:
                print("✅ FIREBASE_CREDENTIALS es un JSON válido.")
        except json.JSONDecodeError as e:
            print("❌ FIREBASE_CREDENTIALS contiene JSON inválido.")
            print(f"   📛 Error: {e}")
            all_ok = False

    # Validar formato del bucket
    bucket = os.environ.get("FIREBASE_BUCKET", "")
    if bucket and not bucket.endswith(".appspot.com"):
        print(f"⚠️ FIREBASE_BUCKET '{bucket}' no parece válido. ¿Le falta '.appspot.com'?")
        all_ok = False
    elif bucket:
        print("✅ FIREBASE_BUCKET tiene formato correcto.")

    print("\n✅ Diagnóstico final:", "TODO OK 🔥" if all_ok else "🚨 Revisa las variables marcadas.")
    return all_ok

if __name__ == "__main__":
    validate_env()

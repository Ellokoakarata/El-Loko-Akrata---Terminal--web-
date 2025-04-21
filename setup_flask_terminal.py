import os
import shutil

# Paso 1: Crear carpetas
os.makedirs("public/css", exist_ok=True)
os.makedirs("public/js", exist_ok=True)

# Paso 2: Mover archivos si existen
if os.path.exists("index.html"):
    shutil.move("index.html", "public/index.html")

if os.path.exists("css/styles.css"):
    shutil.move("css/styles.css", "public/css/styles.css")

if os.path.exists("js/script.js"):
    shutil.move("js/script.js", "public/js/core.js")

# Paso 3: Crear archivos JS vacíos
for f in ["terminal.js", "automation.js", "menu.js", "alerts.js"]:
    open(f"public/js/{f}", "w").close()

# Paso 4: Crear app.py
app_py = '''from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='public', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
'''
with open("app.py", "w", encoding="utf-8") as f:
    f.write(app_py)

# Paso 5: Crear requirements.txt
with open("requirements.txt", "w") as f:
    f.write("Flask==2.3.2\n")

print("🔥 Estructura Flask creada con éxito.")

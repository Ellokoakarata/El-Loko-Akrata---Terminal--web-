from flask import Flask, render_template
import os

app = Flask(
    __name__,
    static_folder="public",    # CSS/JS/IMÁGENES
    static_url_path=""         # sirven en /css/... y /js/...
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ritual")
def ritual():
    return render_template("ritual.html")

@app.route("/glitch-core")
def glitch_core():
    return render_template("glitch-core.html")

@app.route("/espejo")
def espejo():
    return render_template("espejo.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

from flask import Flask

app = Flask(__name__)

@app.route("/test/<name>")
def test(name):
    return f"Bonjour, {name}!"

if __name__ == "__main__":
    app.run(debug=True)

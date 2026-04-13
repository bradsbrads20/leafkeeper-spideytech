from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app, origins=["http://localhost:3000"])

@app.route("/api/plant-care", methods=["GET"])
def plant_care():
    return jsonify({
        "plant": "Monstera",
        "health": "Good",
        "recommendation": "Water every 7 days, indirect sunlight, wipe leaves weekly"
    })

@app.route("/api/plant-care/<plant_name>", methods=["GET"])
def plant_care_by_name(plant_name):
    tips = {
        "monstera": {"water": "7 days", "light": "indirect"},
        "cactus": {"water": "14 days", "light": "direct"},
        "snake": {"water": "10 days", "light": "low light"}
    }
    plant = plant_name.lower()
    if plant in tips:
        return jsonify({"plant": plant_name, "care": tips[plant]})
    return jsonify({"error": "Plant not found"}), 404

if _name_ == "_main_":
    app.run(debug=True, port=5000)
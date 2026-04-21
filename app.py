from flask import Flask, request, jsonify
import re

app = Flask(__name__)

def detect_scam(text):
    score = 0
    reasons = []

    scam_words = ["urgent", "win", "lottery", "click", "otp", "bank", "free", "offer"]

    for word in scam_words:
        if word in text.lower():
            score += 1
            reasons.append(f"Contains suspicious word: {word}")

    # check links
    if "http" in text.lower():
        score += 1
        reasons.append("Contains link")

        if not "https" in text.lower():
            score += 1
            reasons.append("Unsecured link (http)")

    # check numbers (like fake prizes)
    if re.search(r"\d{4,}", text):
        score += 1
        reasons.append("Contains large numbers (possible bait)")

    if score >= 4:
        result = "Scam"
    elif score >= 2:
        result = "Suspicious"
    else:
        result = "Safe"

    return result, reasons

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    result, reasons = detect_scam(text)

    return jsonify({
        "result": result,
        "reasons": reasons
    })

if __name__ == '__main__':
    app.run(debug=True)

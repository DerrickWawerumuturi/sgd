from flask import Flask, request, jsonify
from models.bert import predict_song

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({'error': 'No lyrics text provided'}), 400

        lyrics = data['text'].strip()

        if not lyrics:
            return jsonify({'error': 'Lyrics text is empty'}), 400

        # Call the BERT model
        results = predict_song(lyrics, n_responses=3)

        return jsonify({'results': results})
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7455, debug=True)

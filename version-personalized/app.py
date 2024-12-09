import pandas as pd
from flask import Flask, request, jsonify, render_template
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Load dataset
df = pd.read_csv('Symptom2Disease.csv')

# Extract unique symptoms
unique_symptoms = df['Symptom'].unique()
unique_symptoms_set = set(unique_symptoms)

# Initialize Flask app
app = Flask(__name__, static_url_path='/static')

# Initialize session data
session_data = {}

# Function to preprocess and analyze user input
def process_input(user_input):
    # Tokenization
    tokens = word_tokenize(user_input.lower())

    # Remove stop words
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

    return lemmatized_tokens

# Function to identify symptoms in user input
def identify_symptoms(tokens):
    identified_symptoms = []
    for symptom in unique_symptoms:
        symptom_tokens = word_tokenize(symptom.lower())
        if all(token in tokens for token in symptom_tokens):
            identified_symptoms.append(symptom)
    return identified_symptoms

# Function to fetch medications for a given disease
def fetch_medications(disease):
    medications = {
        'influenza': ['Oseltamivir (Tamiflu)', 'Zanamivir (Relenza)', 'Peramivir (Rapivab)'],
        'hypertension': ['Lisinopril', 'Losartan', 'Amlodipine'],
        'common cold': ['Acetaminophen', 'Ibuprofen', 'Pseudoephedrine'],
        'covid-19': ['Remdesivir', 'Dexamethasone', 'Tocilizumab'],
        'migraine': ['Sumatriptan', 'Rizatriptan', 'Propranolol'],
        'stomach flu': ['Oral rehydration salts', 'Loperamide', 'Ondansetron'],
        'malaria': ['Artemether-Lumefantrine', 'Chloroquine', 'Doxycycline'],
        'dengue': ['Paracetamol (Acetaminophen)', 'Intravenous fluids', 'Platelet transfusion'],
        'typhoid': ['Ciprofloxacin', 'Azithromycin', 'Ceftriaxone'],
        'pneumonia': ['Amoxicillin', 'Ceftriaxone', 'Azithromycin'],
        'sinusitis': ['Amoxicillin-Clavulanate', 'Cefuroxime', 'Nasal corticosteroids']
        # Add more diseases and their corresponding medications as needed
    }

    return medications.get(disease.lower(), [])


# Route for the chatbot interface
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle user messages
@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.form['message']
    tokens = process_input(user_input)
    user_id = request.remote_addr
    if user_id not in session_data:
        session_data[user_id] = {'symptoms': []}
    if 'symptom_question' not in session_data[user_id]:
        response = "Please describe your symptoms. For example: 'I have a fever and a cough.'"
        session_data[user_id]['symptom_question'] = True
    else:
        identified_symptoms = identify_symptoms(tokens)
        if not identified_symptoms and 'no' not in tokens:
            response = "I'm sorry, I couldn't identify any symptoms in your message. Could you please provide more details?"
        else:
            session_data[user_id]['symptoms'].extend(identified_symptoms)
            session_data[user_id]['symptoms'] = list(set(session_data[user_id]['symptoms']))  # Remove duplicates

            # Check if more symptoms should be asked
            if len(session_data[user_id]['symptoms']) < 3:  # Ask about at least 3 symptoms
                remaining_symptoms = unique_symptoms_set - set(session_data[user_id]['symptoms'])
                if remaining_symptoms:
                    response = f"Do you also have any of the following symptoms? {', '.join(list(remaining_symptoms)[:5])}"
                else:
                    response = "Thank you for the information. Let me analyze your symptoms."
                    session_data[user_id]['symptom_question'] = False
            else:
                session_data[user_id]['symptom_question'] = False
    if not session_data[user_id]['symptom_question']:
        possible_diseases = df[df['Symptom'].isin(session_data[user_id]['symptoms'])]['Disease'].unique()
        if possible_diseases.size > 0:
            # Choose the first disease for simplicity (you can modify this logic as needed)
            disease = possible_diseases[0]
            medications = fetch_medications(disease)
            if medications:
                response = f"Based on your symptoms, you might have {disease}. The recommended medications are:\n"
                response += "\n".join(medications)
            else:
                response = f"Based on your symptoms, you might have {disease}. Unfortunately, we don't have specific medications available at the moment."
        else:
            response = "I couldn't match your symptoms to a known disease. Please consult a healthcare professional."
        session_data[user_id] = {'symptoms': []}
    return jsonify({"response": response})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)

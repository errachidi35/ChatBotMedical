document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('#submit-button');
    const inputField = document.querySelector('#user-input');
    const chatBox = document.querySelector('#chat-box');

    let askedQuestions = [];
    let answers = {};

    async function fetchNextQuestion() {
        try {
            const response = await fetch('http://127.0.0.1:5000/next_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ asked_questions: askedQuestions })
            });
            const data = await response.json();
            return data.question;
        } catch (error) {
            console.error('Error fetching the next question:', error);
            return null;
        }
    }

    async function diagnose() {
        try {
            const response = await fetch('http://127.0.0.1:5000/diagnose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers: answers })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching the diagnosis:', error);
            return null;
        }
    }

    async function handleUserInput(userMessage) {
        if (userMessage.trim() === '') return;

        // Display user message
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.innerHTML = `<p>${userMessage}</p>`;
        chatBox.appendChild(userMessageElement);

        // Store answer
        if (askedQuestions.length > 0) {
            const lastQuestionId = askedQuestions[askedQuestions.length - 1];
            answers[lastQuestionId] = userMessage.toLowerCase();
        }

        // Fetch next question or diagnosis
        const question = await fetchNextQuestion();
        if (question) {
            askedQuestions.push(question.id);
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'bot-message');
            botMessageElement.innerHTML = `<p>${question.question}</p>`;
            chatBox.appendChild(botMessageElement);
        } else {
            const diagnosisResult = await diagnose();
            if (diagnosisResult) {
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot-message');
                botMessageElement.innerHTML = `
                    <p>Diagnosis: ${diagnosisResult.diagnosis}</p>
                    <p>Prevention: ${diagnosisResult.prevention}</p>
                    <p>Medications: ${diagnosisResult.medications}</p>
                    <button id="download-diagnosis-pdf">Download Diagnosis PDF</button>
                `;
                chatBox.appendChild(botMessageElement);

                // Add event listener for PDF download button
                const downloadDiagnosisPDFButton = botMessageElement.querySelector('#download-diagnosis-pdf');
                downloadDiagnosisPDFButton.addEventListener('click', async () => {
                    generateDiagnosisPDF(diagnosisResult);
                });
            }
        }

        // Clear input field
        inputField.value = '';

        // Scroll chat box to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    submitButton.addEventListener('click', () => {
        const userMessage = inputField.value;
        handleUserInput(userMessage);
    });

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const userMessage = inputField.value;
            handleUserInput(userMessage);
        }
    });

    // Fetch the first question
    fetchNextQuestion().then(question => {
        if (question) {
            askedQuestions.push(question.id);
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'bot-message');
            botMessageElement.innerHTML = `<p>${question.question}</p>`;
            chatBox.appendChild(botMessageElement);
        }
    });

    // Function to generate PDF for diagnosis
    function generateDiagnosisPDF(diagnosisResult) {
        try {
            const pdf = new jsPDF();

            // Add diagnosis information to PDF
            pdf.text(`Diagnosis: ${diagnosisResult.diagnosis}`, 10, 10);
            pdf.text(`Prevention: ${diagnosisResult.prevention}`, 10, 20);
            pdf.text(`Medications: ${diagnosisResult.medications}`, 10, 30);

            // Save the PDF
            pdf.save('diagnosis.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
});

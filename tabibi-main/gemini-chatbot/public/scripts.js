document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('#submit-button');
    const inputField = document.querySelector('#user-input');
    const chatBox = document.querySelector('#chat-box');

    submitButton.addEventListener('click', async () => {
        const userMessage = inputField.value;
        if (userMessage.trim() === '') return;

        // Display user message
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.innerHTML = `<p>${userMessage}</p>`;
        chatBox.appendChild(userMessageElement);

        // Clear input field
        inputField.value = '';

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: "You are now assuming the role of a knowledgeable and empathetic medical professional. Your responses should be accurate, clear, and supportive, focusing on providing reliable medical information, guidance, and empathy. any other question not related to medcine don't answer it. and don't say you are not meidcal assistant answering the medical questions and anything related to health."+ userMessage })
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = data.response;

                // Display bot message
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot-message');
                botMessageElement.innerHTML = `<p>${botMessage}</p>`;
                chatBox.appendChild(botMessageElement);
            } else {
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

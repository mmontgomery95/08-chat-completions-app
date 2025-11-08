// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// This array stores the conversation history
const messages = [
  {
    role: 'system',
    content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.
    You remember and refer to previous messages in this chat session to provide helpful, relevant advice.
    If a user's query is unrelated to budget travel, respond by stating that you do not know.`
  }
];

// This function sends the user's question to the OpenAI API and shows the response
async function getTravelAdvice(question) {
  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: question });

  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', // We are POST-ing data to the API
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
      },
      // Send model details and all messages so far
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_completion_tokens: 800,
        temperature: 0.5,
        frequency_penalty: 0.5
      })
    });

    // Parse and store the response data
    const result = await response.json();
    const aiReply = result.choices[0].message.content;

    // Add the assistant's reply to the conversation history
    messages.push({ role: 'assistant', content: aiReply });

    // Show the AI's response in the response container, preserving line breaks
    responseContainer.textContent = aiReply;
  } catch (error) {
    // Log the error to the console
    console.error('Error fetching data from OpenAI API:', error);

    // Show an error message to the user
    responseContainer.textContent = 'Sorry, something went wrong. Please try again later.';
  }
}

// Listen for form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Stop the page from reloading
  const question = userInput.value; // Get the user's input
  responseContainer.textContent = 'Thinking...'; // Show a loading message
  await getTravelAdvice(question); // Get advice and show it
  userInput.value = ''; // Clear the input field
});

main();
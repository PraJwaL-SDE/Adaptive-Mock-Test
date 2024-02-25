
const Login_btn = document.getElementById('Login');

Login_btn.addEventListener('click',()=>{
    const username = document.getElementById('username').value;
    const data = {
    username: username
  };
  console.log(data);

   // Make a POST request to send the username to the backend
   fetch('/api/sendUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Specify the content type as JSON
    },
    body: JSON.stringify(data) // Convert the data to JSON format
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(responseData => {
    console.log('Response from server:', responseData);
    // Handle the response from the server here
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    // Handle errors gracefully, e.g., show an error message to the user
  });

});

 
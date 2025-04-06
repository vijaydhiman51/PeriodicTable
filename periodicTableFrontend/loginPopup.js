document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('LoginForm');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = {
        username: formData.get('username'),
        password: formData.get('password')
      };
  
      fetch('http://localhost:3000/api/login/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((data) => {
        window.opener?.postMessage({ status: data.message, jwtToken: data.token, username: data.username }, window.location.origin);
        window.close();
      })
      .catch(err => {
        console.error('Login failed', err);
        alert('Login failed');
      });
    });
  });
  
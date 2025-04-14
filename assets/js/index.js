const form = document.getElementById('login-form');
const message = document.querySelector('.message-login');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const loginData= {
        username: username,
        password: password
    }

    fetch('http://localhost:8080/login', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Error en la solicitud de inicio de sesión');
        }
        return response.json();
    })
    .then(data => {

        localStorage.setItem('token',data.token);
        console.log(data.token);
        window.location.href = '/user/courses';
    })
    .catch(error => {
        console.error('Error:', error);
        message.innerHTML = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    });
    form.reset();
})
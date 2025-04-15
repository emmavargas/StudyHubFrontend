const form = document.getElementById('login-form');
const message = document.querySelector('.message-login');

document.addEventListener('DOMContentLoaded', function(){

    const token = getToken();
    console.log(token);
    if(!token){
        return;
    }else{
        const sectionLoginHtml = document.querySelector('.login-container');
        sectionLoginHtml.style.display = 'none';
        const stateLogin = document.querySelector('.nav-actions');
        stateLogin.innerHTML  = `
            <nav class="nav-actions-profile">
                <button class="profile" type="button" onclick="window.location.href='/user/courses'">
                    <img src="/assets/img/profile.svg" alt="perfil">
                    <span>Perfil</span>
                </button>     
                <button class="exit" type="button" onclick="logoutSesion()">
                    <img src="/assets/img/logout.svg" alt="perfil">
                    <span>Salir</span>
                </button>            
            </nav>       
        `
    }
});





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

        //localStorage.setItem('token',data.token);
        saveToken(data.token);
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
          }, 60 * 60 * 1000); // 1 hora
        window.location.href = '/user/courses';

    })
    .catch(error => {
        console.error('Error:', error);
        message.innerHTML = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    });
    form.reset();
})



function saveToken(token) {
    const expirationTime = Date.now() + 60 * 60 * 1000; 
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime);
  }
  
  function isTokenExpired() {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return false;
    return Date.now() > expirationTime;
  }
  
  function getToken() {
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      return null;
    }
    return localStorage.getItem('token');
  }

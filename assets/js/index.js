const form = document.getElementById('login-form');
const message = document.querySelector('.message-login');

document.addEventListener('DOMContentLoaded', async function(){


        try{
            const response = await fetch('http://localhost:8080/user/courses',{
                method: 'GET',
                credentials: 'include'
            });
            if(response.ok){
                
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
            else{
                return;
            }
        }catch(error){
            console.log('No authenticado')
        }
});


form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const loginData= {
        username: username,
        password: password
    }


    try{
        const response = await fetch('http://localhost:8080/login',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        })
        if(!response.ok){
            throw new Error('Error en la solicitud de inicio de sesión');
            return;
        }

        window.location.href = '/user/courses'

    }catch(error){
        console.error('Error:', error);
        message.innerHTML = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    };
    form.reset();
})


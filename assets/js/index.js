const form = document.getElementById('login-form');
const message = document.querySelector('.message-login');

document.addEventListener('DOMContentLoaded', async function(){


        try{
            const response = await fetch('http://localhost:8080/api/user/courses',{
                method: 'GET',
                credentials: 'include'
            });
            if(response.ok){
                window.location.href = '/user/courses';
                /*
                isAuthenticated = true;
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
                */
            }
            else{
                return;
            }
        }catch(error){
            console.log('No authenticado')
        }
});


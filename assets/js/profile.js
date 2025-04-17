
async function logoutSesion() {
    try {
        const response = await fetch('http://65.21.56.202:3000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        }
        window.location.href = '/';
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/';
    }
}

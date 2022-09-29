const usuario = document.getElementById('usuarioPrueba');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');

if(usuario&&email&&password){
    usuario.addEventListener('click', () => {
        email.value = 'prueba@uptask.com'
        password.value = 'prueba'
    })
    
}

export default usuario;
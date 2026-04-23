import { loginWithGoogle, checkAuthState } from './auth.js';

const loginBtn = document.getElementById('google-login-btn');

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    try {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Iniciando sesión...';
      const user = await loginWithGoogle();
      console.log('Login exitoso:', user);
      // Redirigir a predicciones después de un login exitoso
      window.location.href = '/predictions.html';
    } catch (error) {
      console.error('Error en login:', error);
      alert('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar con Google';
    }
  });
}

// Verificar si ya está logueado
checkAuthState((user) => {
  if (user) {
    // Si ya está logueado, podríamos redirigirlo automáticamente
    // window.location.href = '/predictions.html';
  }
});

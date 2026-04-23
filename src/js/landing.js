// src/js/landing.js
// Controlador de la Landing Page

import { auth } from './firebase.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// === AUTH STATE ===
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario ya logueado -> redirigir al dashboard
    window.location.href = '/dashboard.html';
  }
});

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// === COUNTDOWN ===
const MUNDIAL_DATE = new Date('2026-06-11T16:00:00Z'); // Fecha de inicio oficial

function updateCountdown() {
  const now = new Date();
  const diff = MUNDIAL_DATE - now;
  if (diff <= 0) return;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// === MODAL ===
const modal = document.getElementById('auth-modal');
const openModal = () => modal.classList.add('open');
const closeModal = () => modal.classList.remove('open');

document.getElementById('btn-login').addEventListener('click', openModal);
document.getElementById('btn-register').addEventListener('click', openModal);
document.getElementById('hero-cta-primary').addEventListener('click', openModal);
document.getElementById('final-cta').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// === TABS ===
const tabRegister = document.getElementById('tab-register');
const tabLogin = document.getElementById('tab-login');
const submitBtn = document.getElementById('modal-submit');

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  submitBtn.textContent = 'Empieza a jugar 🚀';
});
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  submitBtn.textContent = 'Iniciar sesión';
});

// === GOOGLE AUTH ===
const provider = new GoogleAuthProvider();
document.getElementById('google-auth-btn').addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = '/dashboard.html';
  } catch (e) {
    console.error('Google auth error:', e);
    alert('Error al iniciar sesión con Google. Intenta de nuevo.');
  }
});

// === EMAIL AUTH ===
submitBtn.addEventListener('click', async () => {
  const email = document.getElementById('modal-email').value.trim();
  const password = document.getElementById('modal-password').value;
  if (!email || !password) { alert('Completa todos los campos.'); return; }

  const isLogin = tabLogin.classList.contains('active');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Cargando...';

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
    window.location.href = '/dashboard.html';
  } catch (e) {
    console.error('Email auth error:', e);
    let msg = 'Error de autenticación.';
    if (e.code === 'auth/email-already-in-use') msg = 'Este correo ya está registrado.';
    if (e.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.';
    if (e.code === 'auth/user-not-found') msg = 'Usuario no encontrado.';
    if (e.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres.';
    alert(msg);
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? 'Iniciar sesión' : 'Empieza a jugar 🚀';
  }
});

// === ANIMATE ON SCROLL ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

import { checkAuthState, logout } from './auth.js';
import { db, auth } from './firebase.js';
import { doc, setDoc } from "firebase/firestore";


const userNameEl = document.getElementById('user-name');
const userAvatarEl = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const matchesContainer = document.getElementById('matches-container');

// Datos de ejemplo para los partidos
const mockMatches = [
  { id: 1, teamA: 'México', flagA: '🇲🇽', teamB: 'Estados Unidos', flagB: '🇺🇸', date: '11 Jun 2026', time: '18:00' },
  { id: 2, teamA: 'Canadá', flagA: '🇨🇦', teamB: 'Brasil', flagB: '🇧🇷', date: '12 Jun 2026', time: '20:00' },
  { id: 3, teamA: 'Argentina', flagA: '🇦🇷', teamB: 'España', flagB: '🇪🇸', date: '13 Jun 2026', time: '15:00' },
  { id: 4, teamA: 'Francia', flagA: '🇫🇷', teamB: 'Alemania', flagB: '🇩🇪', date: '14 Jun 2026', time: '21:00' },
];

// Estado local de predicciones (en el futuro esto vendrá de Firestore)
const userPredictions = {};

// Verificar autenticación
checkAuthState((user) => {
  if (user) {
    userNameEl.textContent = user.displayName;
    if (user.photoURL) userAvatarEl.src = user.photoURL;
    renderMatches();
  } else {
    // Si no está logueado, redirigir a onboarding
    window.location.href = '/onboarding.html';
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = '/index.html';
  });
}

function renderMatches() {
  if (!matchesContainer) return;
  
  matchesContainer.innerHTML = mockMatches.map(match => `
    <div class="match-card">
      <div class="match-info">${match.date} • ${match.time}</div>
      <div class="match-teams">
        <div class="team">
          <span class="team-flag">${match.flagA}</span>
          <span class="team-name">${match.teamA}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <span class="team-flag">${match.flagB}</span>
          <span class="team-name">${match.teamB}</span>
        </div>
      </div>
      <div class="prediction-actions">
        <button class="predict-btn ${userPredictions[match.id] === 'A' ? 'selected' : ''}" 
                onclick="makePrediction(${match.id}, 'A')">
          Gana ${match.teamA}
        </button>
        <button class="predict-btn ${userPredictions[match.id] === 'B' ? 'selected' : ''}" 
                onclick="makePrediction(${match.id}, 'B')">
          Gana ${match.teamB}
        </button>
      </div>
    </div>
  `).join('');
}

// Hacer una función global para los botones
window.makePrediction = async (matchId, team) => {
  console.log(`Predicción para el partido ${matchId}: Gana equipo ${team}`);
  userPredictions[matchId] = team;
  renderMatches();
  
  // Guardar la predicción en Firestore (usuario actual ya está autenticado)
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(doc(db, "predictions", `${user.uid}_${matchId}`), {
      uid: user.uid,
      matchId,
      team,
      timestamp: Date.now()
    });
    console.log('Predicción guardada en Firestore');
  } catch (e) {
    console.error('Error guardando predicción:', e);
  }
};

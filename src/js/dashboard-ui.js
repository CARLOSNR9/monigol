// src/js/dashboard-ui.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const userNameEl = document.getElementById('user-name');
const userAvatarEl = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const matchesContainer = document.getElementById('matches-container');
const rankingList = document.getElementById('ranking-list');

// Mock matches (replace with Firestore in future)
const mockMatches = [
  { id: 1, teamA: 'México', flagA: '🇲🇽', teamB: 'Estados Unidos', flagB: '🇺🇸', date: '11 Jun 2026', time: '18:00' },
  { id: 2, teamA: 'Canadá', flagA: '🇨🇦', teamB: 'Brasil', flagB: '🇧🇷', date: '12 Jun 2026', time: '20:00' },
  { id: 3, teamA: 'Argentina', flagA: '🇦🇷', teamB: 'España', flagB: '🇪🇸', date: '13 Jun 2026', time: '15:00' },
  { id: 4, teamA: 'Francia', flagA: '🇫🇷', teamB: 'Alemania', flagB: '🇩🇪', date: '14 Jun 2026', time: '21:00' },
];

function renderMatches() {
  if (!matchesContainer) return;
  matchesContainer.innerHTML = mockMatches.map(match => `
    <div class="match-card glass-card">
      <div class="match-info">${match.date} • ${match.time}</div>
      <div class="match-teams">
        <div class="team"><span class="team-flag">${match.flagA}</span> <span class="team-name">${match.teamA}</span></div>
        <div class="vs">VS</div>
        <div class="team"><span class="team-flag">${match.flagB}</span> <span class="team-name">${match.teamB}</span></div>
      </div>
      <button class="btn btn-primary" onclick="window.location.href='predictions.html'">Predecir</button>
    </div>
  `).join('');
}

async function loadRanking() {
  if (!rankingList) return;
  try {
    const q = query(collection(db, 'rankings'), orderBy('points', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    const rankings = [];
    snapshot.forEach(doc => rankings.push({ id: doc.id, ...doc.data() }));
    rankingList.innerHTML = rankings.map(r => `
      <li class="ranking-item glass-card">
        <span class="rank-pos">#${r.position}</span>
        <img class="rank-avatar" src="${r.avatarUrl || './public/avatar_placeholder.png'}" alt="Avatar" />
        <span class="rank-name">${r.displayName}</span>
        <span class="rank-points">${r.points} pts</span>
      </li>
    `).join('');
  } catch (e) {
    console.error('Error loading ranking:', e);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    userNameEl.textContent = user.displayName || 'Usuario';
    if (user.photoURL) userAvatarEl.src = user.photoURL;
    renderMatches();
    loadRanking();
  } else {
    window.location.href = '/index.html';
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await auth.signOut();
    window.location.href = '/index.html';
  });
}

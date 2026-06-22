# 🎮 The Frontend Game

Un joc educativ interactiv de tip CTF (Capture The Flag) dedicat învățării conceptelor fundamentale de frontend development și web security.

## 📖 Despre Proiect

**The Frontend Game** este o platformă gamificată care învață developerii să exploreze și să înțeleagă:
- 🎨 HTML & DOM Manipulation
- 🌐 Network Requests & Browser DevTools
- 💾 Browser Storage (Cookies, LocalStorage, SessionStorage)
- 🔐 Web Security Basics
- 🛠️ Developer Tools

### Caracteristici
- ✅ 15 nivele progresive de dificultate
- ✅ Sistem de autentificare (Email/Password + Google OAuth)
- ✅ Leaderboard global și pe nivel
- ✅ Tracking statistici (timp, hints folosite, încercări greșite)
- ✅ Tutorial interactiv pentru începători
- ✅ Dark/Light mode
- ✅ Responsive design

## 🏗️ Tehnologii Folosite

### Frontend (Client)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapid
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Shadcn/ui** - Component library

### Backend (Server)
- **Node.js + Express** - REST API
- **TypeScript** - Type safety
- **Prisma** - ORM pentru baza de date
- **PostgreSQL** - Baza de date
- **JWT** - Authentication
- **Google OAuth 2.0** - Social login
- **bcrypt** - Password hashing

## 📚 Documentație

### Pentru a instala și rula proiectul:

**[📘 GHID_INSTALARE.md](./GHID_INSTALARE.md)** - Ghid complet de instalare și configurare

### Fișiere Template:
- `server/.env.example` - Template variabile de mediu pentru backend
- `client/.env.example` - Template variabile de mediu pentru frontend

## 🚀 Start Rapid

```bash
# 1. Instalare dependințe
cd server && npm install
cd ../client && npm install

# 2. Configurare .env (copiază din .example și editează)
cd server && cp .env.example .env
cd ../client && cp .env.example .env

# 3. Pornește baza de date
docker-compose up -d

# 4. Inițializează DB
cd server && npm run db:push

# 5. Pornește server (terminal 1)
cd server && npm run dev

# 6. Pornește client (terminal 2)
cd client && npm run dev

# 7. Accesează http://localhost:5173
```

## 📁 Structura Proiectului

```
the-frontend-game/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componente React
│   │   │   ├── game/       # Nivelurile jocului (Level1-15)
│   │   │   └── ui/         # Componente UI reutilizabile
│   │   ├── pages/          # Pagini (Dashboard, Login, Tutorial)
│   │   ├── context/        # React Context (Auth)
│   │   ├── lib/            # Utilități (API client)
│   │   └── config/         # Configurări (levels)
│   └── package.json
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Autentificare
│   │   │   └── games.ts    # Logica jocului
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Token utilities
│   ├── prisma/
│   │   └── schema.prisma   # Schema DB
│   └── package.json
│
├── docker-compose.yml      # PostgreSQL setup
├── GHID_INSTALARE.md       # Ghid complet în română
└── README.md               # Acest fișier
```

## 🎯 Cum Funcționează

### Niveluri pe Categorii:

#### 🎨 HTML & DOM (Nivele 1-5)
- Descoperirea elementelor ascunse
- Inspecția comentariilor HTML
- Meta tags & atribute
- Display:none & visibility

#### 🌐 Network & DevTools (Nivele 6-10)
- HTTP Headers
- Request/Response analysis
- Network timing
- URL Parameters
- 404 errors

#### 💾 Storage & JavaScript (Nivele 11-15)
- Cookies
- LocalStorage
- SessionStorage
- Console logging
- Base64 encoding/decoding

### Sistem de Scoring
- ⏱️ **Timp**: Mai rapid = punctaj mai mare
- 💡 **Hints**: Folosirea de hint-uri afectează scorul
- ❌ **Încercări greșite**: Sunt înregistrate și afișate

## 🔐 Autentificare

Proiectul suportă două metode de autentificare:

1. **Email/Password** - Înregistrare și login tradițional
2. **Google OAuth 2.0** - Login cu contul Google

Sistemul folosește:
- **Access Tokens** (JWT, 15 minute)
- **Refresh Tokens** (HTTP-only cookies, 7 zile)
- Rotație automată de token-uri pentru securitate

## 🛠️ Comenzi Disponibile

### Server
```bash
npm run dev        # Development cu hot-reload
npm run build      # Build pentru producție
npm start          # Run producție
npm run db:push    # Sync Prisma schema cu DB
npm run db:studio  # Deschide Prisma Studio
```

### Client
```bash
npm run dev        # Development server
npm run build      # Build pentru producție
npm run preview    # Preview build de producție
npm run lint       # Verificare cod
```

## 📊 Features în Detaliu

### Dashboard
- Progres per categorie (HTML, Network, Storage)
- Statistici personale (nivele completate, timp total)
- Acces rapid la nivele
- Vizualizare scor

### Leaderboard
- Top 10 jucători global (scor total)
- Leaderboard per nivel (cei mai rapizi)
- Afișare hints folosite și încercări greșite
- Filtrare și sortare

### Tutorial
- Ghid pas-cu-pas pentru începători
- Explicații despre DevTools
- Tips & tricks pentru fiecare categorie
- Navigare cu taste (←/→/Esc)

## 🐛 Debugging & Development

### Prisma Studio
```bash
cd server
npm run db:studio
```
Deschide interfață vizuală pentru baza de date la `http://localhost:5555`

### Loguri Server
Serverul loghează automat:
- Request-uri primite
- Erori de autentificare
- Operații pe baza de date

### React DevTools
Instalează extensia React DevTools pentru Chrome/Firefox pentru debugging mai ușor.

## 📝 Variabile de Mediu

### Server (.env)
```env
DATABASE_URL="postgresql://..."
ACCESS_TOKEN_SECRET="..."
REFRESH_TOKEN_SECRET="..."
GOOGLE_CLIENT_ID="..." (opțional)
NODE_ENV="development"
```

### Client (.env)
```env
VITE_API_URL="http://localhost:3001/api"
VITE_GOOGLE_CLIENT_ID="..." (opțional)
```

## 🚢 Deployment

### Frontend (Vercel - Recomandat)
```bash
cd client
npm run build
# Deploy folderul dist/ pe Vercel
```

### Backend (Railway, Render, sau VPS)
```bash
cd server
npm run build
# Deploy și configurează variabilele de mediu
```

### Bază de Date
- Folosește un PostgreSQL hosted (Railway, Supabase, ElephantSQL)
- Actualizează `DATABASE_URL` în .env

## 🔒 Securitate

### Best Practices Implementate:
- ✅ Password hashing cu bcrypt
- ✅ JWT tokens cu expirare
- ✅ HTTP-only cookies pentru refresh tokens
- ✅ CORS configurat corect
- ✅ Input validation
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection

### Pentru Producție:
- Folosește HTTPS obligatoriu
- Setează `NODE_ENV=production`
- Generează secrete JWT puternice
- Activează rate limiting
- Monitorizează logurile

## 🤝 Contribuții

Proiectul este open pentru îmbunătățiri! Idei:
- Adaugă mai multe nivele
- Implementează achievements/badges
- Adaugă multiplayer features
- Îmbunătățește UI/UX
- Adaugă mai multe metode de autentificare

## 📄 Licență

Acest proiect este creat în scop educațional.

## 🙏 Acknowledgments

Construit cu:
- React & TypeScript
- Express & Prisma
- TailwindCSS & Shadcn/ui
- PostgreSQL & Docker

---

**Pentru detalii complete despre instalare, configurare și rezolvarea problemelor, consultă [GHID_INSTALARE.md](./GHID_INSTALARE.md)**

**Mult succes la joc! 🎮🚀**

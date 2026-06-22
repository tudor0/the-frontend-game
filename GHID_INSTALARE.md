# 🎮 The Frontend Game - Ghid Complet de Instalare și Rulare

## 📋 Cuprins
- [Cerințe de Sistem](#cerințe-de-sistem)
- [Instalare Inițială](#instalare-inițială)
- [Configurare Bază de Date](#configurare-bază-de-date)
- [Configurare Variabile de Mediu](#configurare-variabile-de-mediu)
- [Pornire Proiect](#pornire-proiect)
- [Rezolvare Probleme](#rezolvare-probleme)
- [Comenzi Utile](#comenzi-utile)

---

## 🔧 Cerințe de Sistem

Înainte de a începe, asigură-te că ai instalate următoarele:

### Software Necesar:
1. **Node.js** (versiunea 18 sau mai nouă)
   - Verifică versiunea: `node --version`
   - Descarcă de la: https://nodejs.org/

2. **npm** (vine automat cu Node.js)
   - Verifică versiunea: `npm --version`

3. **Docker Desktop** (pentru baza de date PostgreSQL)
   - Descarcă de la: https://www.docker.com/products/docker-desktop
   - **ALTERNATIVĂ**: Poți instala PostgreSQL direct pe calculator

4. **Git** (opțional, dacă vrei să clonezi din repository)
   - Verifică versiunea: `git --version`

---

## 📦 Instalare Inițială

### Pasul 1: Pregătire Proiect

Dacă proiectul e pe un stick USB sau într-un folder comprimat:

```bash
# Copiază proiectul în locația dorită
# De exemplu, pe Desktop:
cp -r /path/to/the-frontend-game ~/Desktop/

# Navighează în folderul proiectului
cd ~/Desktop/the-frontend-game
```

### Pasul 2: Instalare Dependințe

Proiectul are două părți: **client** (frontend) și **server** (backend). Trebuie să instalezi dependințele pentru ambele.

#### 2.1. Instalare dependințe SERVER:

```bash
cd server
npm install
```

**Așteptare**: ~2-5 minute (depinde de conexiunea la internet)

#### 2.2. Instalare dependințe CLIENT:

```bash
cd ../client
npm install
```

**Așteptare**: ~2-5 minute

---

## 🗄️ Configurare Bază de Date

Proiectul folosește **PostgreSQL** ca bază de date. Ai două opțiuni:

### Opțiunea 1: Cu Docker (RECOMANDAT - Cel mai simplu)

#### 1. Pornește Docker Desktop
- Deschide aplicația Docker Desktop
- Așteaptă până apare iconița Docker în bara de sus (Mac) sau task bar (Windows)

#### 2. Pornește baza de date

```bash
# Din folderul principal al proiectului
cd ~/Desktop/the-frontend-game

# Pornește containerul PostgreSQL
docker-compose up -d
```

Comanda `docker-compose up -d` va:
- Descărca imaginea PostgreSQL (prima dată, ~150MB)
- Crea și porni containerul
- Baza de date va rula pe `localhost:5432`

#### 3. Verifică că funcționează

```bash
docker ps
```

Ar trebui să vezi un container numit similar cu `the-frontend-game-postgres-1` cu status `Up`.

### Opțiunea 2: PostgreSQL Instalat Local

Dacă ai PostgreSQL deja instalat:

1. Creează o bază de date nouă:
```sql
CREATE DATABASE gamedb;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE gamedb TO user;
```

2. Asigură-te că PostgreSQL rulează pe portul `5432`

---

## ⚙️ Configurare Variabile de Mediu

Aplicația necesită variabile de mediu pentru a funcționa corect.

### SERVER - Variabile de Mediu

#### 1. Creează fișierul `.env` în folderul `server`:

```bash
cd ~/Desktop/the-frontend-game/server
touch .env
```

#### 2. Deschide fișierul `.env` cu un editor de text și adaugă:

```env
# Conexiune la baza de date PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/gamedb"

# Secrete pentru JWT (folosește string-uri aleatoare lungi)
ACCESS_TOKEN_SECRET="genereaza_un_string_aleatoriu_lung_aici_12345"
REFRESH_TOKEN_SECRET="alt_string_aleatoriu_foarte_lung_si_secret_67890"

# Google OAuth (opțional - dacă vrei login cu Google)
GOOGLE_CLIENT_ID="id-ul-tau-google-oauth-aici"

# Mediu
NODE_ENV="development"
```

**IMPORTANT despre secretele JWT:**
- Folosește string-uri aleatoare și unice
- În producție, folosește generatoare de secrete sigure
- Nu partaja niciodată aceste secrete

**Exemplu generare secrete (în terminal):**
```bash
# Generează un string aleatoriu
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### CLIENT - Variabile de Mediu

#### 1. Creează fișierul `.env` în folderul `client`:

```bash
cd ~/Desktop/the-frontend-game/client
touch .env
```

#### 2. Adaugă în fișierul `.env`:

```env
# URL-ul API-ului backend
VITE_API_URL=http://localhost:3001/api

# Google OAuth Client ID (opțional - dacă vrei login cu Google)
VITE_GOOGLE_CLIENT_ID="id-ul-tau-google-oauth-aici"
```

---

## 🚀 Pornire Proiect

Acum că totul e configurat, poți porni aplicația!

### Pasul 1: Inițializează Baza de Date

Prima dată când pornești proiectul, trebuie să creezi tabelele în baza de date:

```bash
cd ~/Desktop/the-frontend-game/server

# Generează clientul Prisma și creează tabelele
npm run db:push
```

Ar trebui să vezi mesaje de succes despre crearea tabelelor (User, Score, LevelAttempt, etc.)

### Pasul 2: Pornește SERVER-ul (Backend)

```bash
cd ~/Desktop/the-frontend-game/server

# Pornește serverul în modul development
npm run dev
```

**Ce ar trebui să vezi:**
```
🚀 SERVER RUNNING ON: http://localhost:3001
🔒 Auth System: ACTIVE (Access + Refresh Tokens)
```

**NU ÎNCHIDE acest terminal** - serverul trebuie să ruleze continuu.

### Pasul 3: Pornește CLIENT-ul (Frontend)

Deschide un **terminal NOU** (lasă serverul să ruleze în cel vechi):

```bash
cd ~/Desktop/the-frontend-game/client

# Pornește aplicația frontend
npm run dev
```

**Ce ar trebui să vezi:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Pasul 4: Deschide Aplicația

Deschide browser-ul și navighează la:
```
http://localhost:5173
```

**🎉 GATA! Aplicația ar trebui să ruleze!**

---

## 🛑 Oprire Proiect

### Pentru a opri aplicația:

1. **CLIENT** (Vite):
   - În terminalul unde rulează clientul, apasă `Ctrl + C`

2. **SERVER** (Express):
   - În terminalul unde rulează serverul, apasă `Ctrl + C`

3. **Baza de date** (Docker - opțional):
   ```bash
   docker-compose down
   ```
   
   Sau lasă containerul să ruleze (se va opri automat când închizi Docker Desktop)

---

## 🔍 Verificare Componente

### Verifică dacă totul funcționează:

1. **Baza de date PostgreSQL:**
   ```bash
   docker ps
   # sau
   npm run db:studio
   # (din folderul server - deschide interfața Prisma Studio)
   ```

2. **Server API:**
   - Deschide: http://localhost:3001
   - Dacă vezi un răspuns (chiar și eroare), serverul rulează

3. **Client Web:**
   - Deschide: http://localhost:5173
   - Ar trebui să vezi pagina de login

---

## 🐛 Rezolvare Probleme

### Problema 1: `Port 5432 is already in use`
**Cauză:** Ai deja PostgreSQL instalat și rulează pe portul 5432

**Soluții:**
- Oprește PostgreSQL local și folosește Docker
- SAU modifică portul în `docker-compose.yml`:
  ```yaml
  ports:
    - "5433:5432"  # Schimbă 5432 în 5433
  ```
  Apoi modifică și `DATABASE_URL` în `.env`:
  ```
  DATABASE_URL="postgresql://user:password@localhost:5433/gamedb"
  ```

### Problema 2: `Port 3001 is already in use`
**Cauză:** Alt proces folosește portul 3001

**Soluție:**
```bash
# Găsește procesul care folosește portul
lsof -i :3001

# Omoară procesul (înlocuiește PID cu numărul afișat)
kill -9 PID
```

### Problema 3: `Port 5173 is already in use`
**Cauză:** Alt proces Vite rulează

**Soluție:**
- Închide celelalte procese Vite
- SAU Vite va folosi automat alt port (5174, 5175, etc.)

### Problema 4: "Cannot connect to database"
**Verificări:**

1. Docker Desktop rulează?
2. Containerul PostgreSQL e pornit?
   ```bash
   docker ps
   ```
3. Variabila `DATABASE_URL` e corectă în `.env`?

### Problema 5: "npm install" eșuează

**Soluții:**
```bash
# Șterge cache-ul npm
npm cache clean --force

# Șterge folder și reinstalează
rm -rf node_modules package-lock.json
npm install
```

### Problema 6: Erori Prisma

```bash
cd server

# Regenerează clientul Prisma
npx prisma generate

# Resetează și recreează baza de date
npx prisma db push --force-reset
```

---

## 📝 Comenzi Utile

### Pentru SERVER:

```bash
cd server

# Pornire development (cu auto-reload)
npm run dev

# Creare build pentru producție
npm run build

# Pornire versiune producție
npm start

# Sincronizează schema Prisma cu DB
npm run db:push

# Deschide Prisma Studio (interfață vizuală pentru DB)
npm run db:studio
```

### Pentru CLIENT:

```bash
cd client

# Pornire development
npm run dev

# Creare build pentru producție
npm run build

# Preview build de producție
npm run preview

# Verificare cod (linting)
npm run lint
```

### Pentru Docker:

```bash
# Pornește baza de date
docker-compose up -d

# Oprește baza de date
docker-compose down

# Vezi logurile bazei de date
docker-compose logs -f postgres

# Resetează complet (ATENȚIE: șterge toate datele!)
docker-compose down -v
```

---

## 🎯 Structura Proiectului

```
the-frontend-game/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Componente React
│   │   ├── pages/       # Pagini (Dashboard, Login, etc.)
│   │   ├── lib/         # Utilități (API client, etc.)
│   │   └── config/      # Configurări
│   ├── public/          # Fișiere statice
│   └── package.json
│
├── server/              # Backend Express + Prisma
│   ├── src/
│   │   ├── routes/      # Rute API (auth, games)
│   │   ├── middleware/  # Middleware-uri (auth)
│   │   └── utils/       # Utilități (tokens, etc.)
│   ├── prisma/
│   │   └── schema.prisma # Schema bazei de date
│   └── package.json
│
└── docker-compose.yml   # Configurare PostgreSQL
```

---

## 🔐 Informații Securitate

### Pentru Development (Local):
- Secretele JWT din `.env` sunt OK să fie simple
- Cookie-urile funcționează pe `localhost` fără HTTPS

### Pentru Producție:
- Folosește secrete JWT extrem de puternice (64+ caractere)
- Activează HTTPS obligatoriu
- Setează `NODE_ENV=production`
- Folosește variabile de mediu securizate (nu hardcodate)

---

## 📚 Resurse Adiționale

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Express**: https://expressjs.com
- **Prisma**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs

---

## 💡 Tips & Tricks

### 1. Reîncarcă automată:
- Frontend-ul (Vite) se reîncarcă automat la salvare
- Backend-ul (nodemon) se reîncarcă automat la salvare

### 2. Vezi datele din DB:
```bash
cd server
npm run db:studio
# Deschide http://localhost:5555
```

### 3. Curăță toate și reinstalează:
```bash
# În folderul principal
rm -rf client/node_modules server/node_modules
cd client && npm install
cd ../server && npm install
```

### 4. Test rapid API:
```bash
# Testează dacă serverul răspunde
curl http://localhost:3001/api/auth/refresh
```

---

## ✅ Checklist Final

Înainte de a considera proiectul funcțional, verifică:

- [ ] Node.js instalat (v18+)
- [ ] Docker Desktop instalat și pornit
- [ ] Dependințe instalate în `client/` și `server/`
- [ ] Fișier `.env` creat în ambele foldere
- [ ] PostgreSQL rulează (Docker sau local)
- [ ] `npm run db:push` executat cu succes
- [ ] Server pornit pe `http://localhost:3001`
- [ ] Client pornit pe `http://localhost:5173`
- [ ] Poți accesa aplicația în browser
- [ ] Poți crea un cont nou (Register)
- [ ] Poți face login

---

## 📞 Suport

Dacă întâmpini probleme:

1. Verifică secțiunea [Rezolvare Probleme](#rezolvare-probleme)
2. Verifică că toate cerințele de sistem sunt îndeplinite
3. Asigură-te că ai urmat pașii în ordine
4. Verifică consolele pentru mesaje de eroare specifice

---

**Mult succes! 🚀**

_Ultima actualizare: Iunie 2026_

# ALYAZEN – Dauerhafter Link (Veröffentlichung)

Die Vorschau-Adresse (`https://3000-<sandbox-id>.e2b.app`) ist **temporär** und ändert sich
bei jedem Neustart. Ein fester Link wie `alyazen.vercel.app` oder `www.alyazen.com` entsteht
erst durch ein Deployment.

## 1. Code auf GitHub laden
- Kostenloses Konto auf github.com, neues **privates** Repository.
- Diesen Projektordner hochladen (ohne `.env`, ohne `node_modules`, ohne `.next`).

## 2. Datenbank anlegen (z. B. Neon)
- Kostenlose PostgreSQL-Datenbank erstellen, `DATABASE_URL` kopieren.

## 3. Bei Vercel veröffentlichen
- vercel.com → Add New → Project → dein GitHub-Repository importieren.
- Environment Variable `DATABASE_URL` eintragen.
- Deploy klicken. Danach hast du einen festen Link `https://<projekt>.vercel.app`.

## 4. Datenbank initialisieren (einmalig)
Lokal mit der neuen `DATABASE_URL` in `.env`:
```
npx drizzle-kit push
```
Danach einmal im Browser `https://<projekt>.vercel.app/admin` öffnen und die Vorlage
über den Admin-Bereich anwenden, damit Produkte und Texte in der Datenbank stehen.

## 5. Admin-Passwort ändern
`https://<projekt>.vercel.app/admin/security` – Startpasswort `Alyazen2026` sofort ersetzen.

## 6. Eigene Domain (optional)
Vercel → Settings → Domains → z. B. `alyazen.com` eintragen und die DNS-Einträge
bei deinem Domain-Anbieter setzen.

## Hinweis für Syrien
Einige US-Dienste (GitHub, Vercel, Neon) beschränken die Nutzung aus Syrien. Falls die
Anmeldung nicht möglich ist, brauchst du einen Hoster, der Syrien erlaubt, oder jemanden
außerhalb Syriens, der das Konto einrichtet. Alternativ: VPS (z. B. Hetzner) mit
`npm run build && npm run start`, PostgreSQL und Nginx + HTTPS.

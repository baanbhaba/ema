# ALCHEMI — Backup & Recovery Plan

## 1. Database Backups (Neon Postgres)

Neon provides **automatic point-in-time recovery (PITR)** — no manual setup required.

| Feature | Detail |
|---------|--------|
| **Backup frequency** | Continuous WAL streaming |
| **Retention window** | 7 days (Neon free tier) / 30 days (paid) |
| **Restore granularity** | Any point in time within the retention window |
| **How to restore** | Neon Console → Project → Branches → Restore |

### Restore Steps
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project → **Branches**
3. Click **Restore** on the `main` branch
4. Pick a timestamp → confirm

---

## 2. Export Project Data Manually

Run this to dump a full SQL snapshot of your Neon database:

```bash
# Requires pg_dump installed (comes with PostgreSQL client tools)
pg_dump \
  "postgresql://neondb_owner:PASSWORD@ep-curly-paper-ayvb99ue-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require" \
  --no-owner \
  --no-acl \
  -f backup-$(date +%Y%m%d-%H%M%S).sql
```

Store the `.sql` dump in a secure location (S3, encrypted drive, etc.). **Never commit it to git.**

---

## 3. Vercel Deployment Recovery

| Asset | How to Recover |
|-------|---------------|
| **Frontend code** | Git repository — every commit is a rollback point |
| **Serverless functions** | Git repository |
| **Environment variables** | Vercel Dashboard → Project → Settings → Environment Variables |
| **Previous deployments** | Vercel Dashboard → Deployments → promote any previous deployment instantly |

### Instant Rollback on Vercel
```bash
# List recent deployments
vercel ls

# Promote a specific deployment to production
vercel promote <deployment-url>
```

---

## 4. Environment Variables Backup

Store a **private, encrypted copy** of your `.env` somewhere safe:

```bash
# Encrypt with age (recommended)
age -r YOUR_PUBLIC_KEY .env > .env.age

# Or with GPG
gpg --symmetric --cipher-algo AES256 .env
```

Critical variables to back up:
- `DATABASE_URL` / `POSTGRES_URL`
- `NVIDIA_API_KEY`
- `AIML_API_KEY`
- `VERCEL_OIDC_TOKEN` (auto-rotated, but keep a record)

---

## 5. Recovery Checklist

In case of a full environment loss:

- [ ] Clone the git repository
- [ ] Re-add all environment variables in Vercel Dashboard
- [ ] Run `npm install` → `npm run build` to verify
- [ ] Confirm Neon DB is reachable (`npx prisma migrate status`)
- [ ] Trigger a new Vercel deployment
- [ ] Verify `/api/v1/auth/login` responds correctly
- [ ] Verify `/api/v1/ai/chat` responds with a test prompt

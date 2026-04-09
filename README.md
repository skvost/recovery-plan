# Recovery Plan — Tréninkový a strečinkový tracker

Jednoduchá single-page aplikace pro sledování rehabilitačního tréninku a protahování. Vanilla HTML/CSS/JS, Supabase backend, GitHub Pages hosting.

## Funkce

- **Dnes** — denní checklist cvičení a strečinku, úroveň bolesti, poznámky
- **Plán** — kompletní tréninkový a strečinkový plán pro referenci
- **Přehled** — kalendář, série (streaks), graf bolesti, upozornění

## Setup

### 1. Supabase

Vytvořte nový projekt na [supabase.com](https://supabase.com) a spusťte tento SQL v SQL Editoru:

```sql
CREATE TABLE workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  phase INT NOT NULL,
  day_number INT NOT NULL,
  exercises_completed JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  pain_level INT CHECK (pain_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_workout_logs_date ON workout_logs(date);

CREATE TABLE stretch_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  session_type TEXT CHECK (session_type IN ('morning', 'post_workout')),
  stretches_completed JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_stretch_logs_date_type ON stretch_logs(date, session_type);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous access" ON workout_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE stretch_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous access" ON stretch_logs FOR ALL USING (true) WITH CHECK (true);
```

### 2. Credentials

V souboru `app.js` nahraďte `SUPABASE_URL` a `SUPABASE_ANON_KEY` hodnotami z vašeho Supabase projektu (Settings → API).

### 3. GitHub Pages

1. Pushněte repo na GitHub
2. Settings → Pages → Source: Deploy from branch → `main` / `root`
3. Aplikace bude dostupná na `https://<username>.github.io/<repo-name>/`

CREATE TABLE IF NOT EXISTS dogs (
  slug              TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  image             TEXT NOT NULL,
  photo_alt         TEXT NOT NULL,
  sex               TEXT NOT NULL,
  age_years         INTEGER NOT NULL DEFAULT 0,
  age_group         TEXT NOT NULL,
  size              TEXT NOT NULL,
  energy            TEXT NOT NULL,
  breed             TEXT NOT NULL,
  traits            TEXT[] NOT NULL DEFAULT '{}',
  good_with_gyerek  BOOLEAN,
  good_with_kutya   BOOLEAN,
  good_with_macska  BOOLEAN,
  status            TEXT NOT NULL,
  tagline           TEXT NOT NULL DEFAULT '',
  story             TEXT NOT NULL DEFAULT '',
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS dogs_sort_order_idx ON dogs (sort_order);

-- dog_photos is also created lazily by lib/dog-photos-store.ts on first use —
-- this definition is kept here only for reference. Holds a dog's additional
-- gallery photos; the cover photo stays in dogs.image.
CREATE TABLE IF NOT EXISTS dog_photos (
  id          BIGSERIAL PRIMARY KEY,
  dog_slug    TEXT NOT NULL REFERENCES dogs(slug) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS dog_photos_dog_slug_idx ON dog_photos (dog_slug, sort_order, id);

CREATE TABLE IF NOT EXISTS applications (
  id          TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT NOT NULL,
  garden      TEXT NOT NULL,
  other_pets  TEXT NOT NULL,
  dog         TEXT NOT NULL,
  intro       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications (created_at DESC);

-- help_requests is also created lazily by lib/help-store.ts on first submit —
-- this definition is kept here only for reference.
CREATE TABLE IF NOT EXISTS help_requests (
  id            TEXT PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL,
  category      TEXT NOT NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  availability  TEXT NOT NULL DEFAULT '',
  message       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS help_requests_created_at_idx ON help_requests (created_at DESC);

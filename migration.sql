-- This is an empty migration.-- Enable extension (safe to run if already present)
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- Array membership search
CREATE INDEX foodblogs_instructions_gin_idx
  ON "FoodBlogs" USING GIN ("instructions");
CREATE INDEX foodblogs_equipments_gin_idx
  ON "FoodBlogs" USING GIN ("equipments");

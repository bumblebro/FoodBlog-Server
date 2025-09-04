-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."FoodBlogs" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "subsection" TEXT NOT NULL,
    "subsubsection" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageurl" TEXT NOT NULL,
    "imagealt" TEXT NOT NULL,
    "content" JSONB[],
    "instructions" TEXT[],
    "recipedescription" TEXT NOT NULL,
    "recipedetails" JSONB NOT NULL,
    "seo" JSONB NOT NULL DEFAULT '{"ogTitle": "", "ogDescription": "", "metaDescription": "", "primaryKeywords": [], "secondaryKeywords": [], "primaryKeywordsNew": [], "secondaryKeywordsNew": []}',
    "faq" JSONB NOT NULL,
    "equipments" TEXT[],
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviews" JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodBlogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodBlogs_title_key" ON "public"."FoodBlogs"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FoodBlogs_slug_key" ON "public"."FoodBlogs"("slug");

-- CreateIndex
CREATE INDEX "foodblogs_equipments_gin_idx" ON "public"."FoodBlogs" USING GIN ("equipments");

-- CreateIndex
CREATE INDEX "foodblogs_instructions_gin_idx" ON "public"."FoodBlogs" USING GIN ("instructions");

-- CreateIndex
CREATE INDEX "idx_section_date" ON "public"."FoodBlogs"("section", "creationDate" DESC);

-- CreateIndex
CREATE INDEX "idx_subsection_date" ON "public"."FoodBlogs"("subsection", "creationDate" DESC);

-- CreateIndex
CREATE INDEX "idx_subsubsection_date" ON "public"."FoodBlogs"("subsubsection", "creationDate" DESC);

-- CreateIndex
CREATE INDEX "idx_title_btree" ON "public"."FoodBlogs"("title");

-- CreateIndex
CREATE INDEX "idx_recipedescription_btree" ON "public"."FoodBlogs"("recipedescription");

-- CreateIndex
CREATE UNIQUE INDEX "FoodBlogs_creationDate_id_key" ON "public"."FoodBlogs"("creationDate", "id");


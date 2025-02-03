-- CreateTable
CREATE TABLE "FoodBlogs" (
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
    "seo" JSONB NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodBlogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodBlogs_title_key" ON "FoodBlogs"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FoodBlogs_slug_key" ON "FoodBlogs"("slug");

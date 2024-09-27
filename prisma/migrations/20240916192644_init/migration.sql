-- CreateTable
CREATE TABLE "Blogs" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageurl" TEXT NOT NULL,
    "imagealt" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "subsection" TEXT NOT NULL,
    "subsubsection" TEXT NOT NULL,
    "content" JSONB[],
    "seo" JSONB NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_title_key" ON "Blogs"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Blogs_slug_key" ON "Blogs"("slug");

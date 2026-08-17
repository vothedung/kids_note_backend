-- AlterTable
ALTER TABLE "media" ADD COLUMN     "album_id" TEXT,
ADD COLUMN     "caption" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_albums_child_id" ON "albums"("child_id");

-- CreateIndex
CREATE INDEX "idx_media_album_id" ON "media"("album_id");

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

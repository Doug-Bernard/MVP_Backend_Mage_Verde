-- CreateTable
CREATE TABLE "Visitante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "cidade" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeUsuario" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atracaoId" INTEGER NOT NULL,
    "visitanteId" INTEGER,
    CONSTRAINT "Avaliacao_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "Atracao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Avaliacao_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Avaliacao" ("atracaoId", "createdAt", "id", "nomeUsuario", "nota") SELECT "atracaoId", "createdAt", "id", "nomeUsuario", "nota" FROM "Avaliacao";
DROP TABLE "Avaliacao";
ALTER TABLE "new_Avaliacao" RENAME TO "Avaliacao";
CREATE TABLE "new_Comentario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeUsuario" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atracaoId" INTEGER NOT NULL,
    "visitanteId" INTEGER,
    CONSTRAINT "Comentario_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "Atracao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comentario_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comentario" ("atracaoId", "comentario", "createdAt", "id", "nomeUsuario") SELECT "atracaoId", "comentario", "createdAt", "id", "nomeUsuario" FROM "Comentario";
DROP TABLE "Comentario";
ALTER TABLE "new_Comentario" RENAME TO "Comentario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Visitante_email_key" ON "Visitante"("email");

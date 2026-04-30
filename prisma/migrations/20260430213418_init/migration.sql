-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATEUR', 'CLIENT', 'RECEPTIONNISTE');

-- CreateEnum
CREATE TYPE "StatutChambre" AS ENUM ('DISPONIBLE', 'OCCUPEE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "nom" TEXT,
    "email" TEXT NOT NULL,
    "motdp" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "num_tele" TEXT,
    "CIN" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeChambre" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TypeChambre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chambre" (
    "id_ch" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "status" "StatutChambre" NOT NULL DEFAULT 'DISPONIBLE',
    "id_type" TEXT NOT NULL,

    CONSTRAINT "Chambre_pkey" PRIMARY KEY ("id_ch")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "pourcentage" DOUBLE PRECISION NOT NULL,
    "date_deb" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "date_arrivee" TIMESTAMP(3) NOT NULL,
    "date_depart" TIMESTAMP(3) NOT NULL,
    "statut" "StatutReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "clientId" INTEGER NOT NULL,
    "chambreId" TEXT NOT NULL,
    "promotionId" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "montant_total" DOUBLE PRECISION NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "nom_service" TEXT NOT NULL,
    "prix_serv" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consommation" (
    "id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_app" DOUBLE PRECISION NOT NULL,
    "date_cons" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Consommation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_clerkUserId_key" ON "Utilisateur"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_CIN_key" ON "Utilisateur"("CIN");

-- CreateIndex
CREATE UNIQUE INDEX "Chambre_numero_key" ON "Chambre"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_reservationId_key" ON "Facture"("reservationId");

-- AddForeignKey
ALTER TABLE "Chambre" ADD CONSTRAINT "Chambre_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "TypeChambre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("id_ch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consommation" ADD CONSTRAINT "Consommation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consommation" ADD CONSTRAINT "Consommation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

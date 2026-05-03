
const fs = require("fs");
const path = require("path");

const basePath = "d:/copier reservation hotel/reservations/src/core/reception/infrastructure/repositories";
const files = [
  "PrismaChambreRepository.ts",
  "PrismaClientRepository.ts",
  "PrismaDashboardRepository.ts",
  "PrismaDemandeRepository.ts",
  "PrismaReservationRepository.ts"
];

files.forEach(file => {
  const filePath = path.join(basePath, file);
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/import { PrismaClient } from "@prisma\/client";\n/, "");
  content = content.replace(/const prisma = new PrismaClient\(\);\n/, "");
  content = `import { prisma } from "../../../../lib/prisma";\n` + content;
  fs.writeFileSync(filePath, content);
});
console.log("Fix complete");


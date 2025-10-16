
import { Router } from "express";
import path from "path";

const router = Router();
const PUBLIC = path.join(__dirname, "../public");


router.get("/", (_req, res) => {
  res.sendFile(path.join(PUBLIC, "index.html"));
});


router.get("/ia", (_req, res) => {
  res.sendFile(path.join(PUBLIC, "ia.html"));
});

router.get("/le-projet", (_req, res) => {
  res.sendFile(path.join(PUBLIC, "le-projet.html"));
});

export default router;


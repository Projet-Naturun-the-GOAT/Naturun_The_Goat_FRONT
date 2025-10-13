import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Bienvenue sur le front du projet Naturun !");
});

export default router;

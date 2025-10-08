import express from "express";
import path from "path";
import routes from "./routes";

const app = express();
const PORT = 3000;

// Fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`✅ Front server running at http://localhost:${PORT}`);
});

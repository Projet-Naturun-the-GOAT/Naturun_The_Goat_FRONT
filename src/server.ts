import express from "express";
import routes from "./routes";
import path from "path";

const app = express();
const PORT = 3000;

// Fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Routes API
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`✅ Front server running at http://localhost:${PORT}`);
});

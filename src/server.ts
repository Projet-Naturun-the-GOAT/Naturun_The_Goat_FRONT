import express from "express";
import routes from "./routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`✅ Front server running at http://localhost:${PORT}`);
});

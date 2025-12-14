import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());

const PUBLIC = process.env.VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;

if (!PUBLIC || !PRIVATE) {
    console.error("Hiányzó VAPID kulcsok! Ellenőrizd: src/server/.env");
    process.exit(1);
}

webpush.setVapidDetails("mailto:test@example.com", PUBLIC, PRIVATE);


let sub: any = null;

app.post("/api/push/subscribe", (req, res) => {
    sub = req.body;
    res.sendStatus(201);
});

app.post("/api/push/notify", async (req, res) => {
  if (!sub) {
    return res
      .status(400)
      .json({ error: "Nincs subscription (hívd meg előbb: /api/push/subscribe)" });
  }

  const title = req.body?.title ?? "Receptkönyv";
  const body = req.body?.body ?? "Új értesítés";
  const url = req.body?.url ?? "/";

  const payload = JSON.stringify({ title, body, url });

  try {
    await webpush.sendNotification(sub, payload);
    return res.sendStatus(200);
  } catch (e: any) {
    console.error("webpush error:", e?.statusCode, e?.body || e);
    return res.status(500).json({
      error: "Push küldés hiba",
      statusCode: e?.statusCode,
      details: e?.body ?? String(e),
    });
  }
});



app.listen(3001, () => console.log("Push server: http://localhost:3001"));

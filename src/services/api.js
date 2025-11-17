const BASE_URL = "http://127.0.0.1:8000";

export async function fetchMaze() {
  const res = await fetch(`${BASE_URL}/maze`);
  return res.json();
}

export async function moveAgent(action) {
  const res = await fetch(`${BASE_URL}/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export async function resetAgent() {
  const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
  return res.json();
}

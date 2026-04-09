const API_KEY = process.env.LASTFM_API_KEY!;
const USER    = process.env.LASTFM_USER!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get("method");
  if (!method) return Response.json({ error: "method required" }, { status: 400 });

  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method",  method);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("user",    USER);
  url.searchParams.set("format",  "json");

  for (const [k, v] of searchParams.entries()) {
    if (k !== "method") url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) return Response.json({ error: `Last.fm ${res.status}` }, { status: 502 });
  const data = await res.json();
  return Response.json(data);
}

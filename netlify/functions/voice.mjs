import { getStore } from "@netlify/blobs";

export const config = {
  path: "/api/voice"
};

function generateShortId() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let id = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < bytes.length; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}

export default async (req) => {
  const store = getStore("voices");
  const url = new URL(req.url);

  if (req.method === "POST") {
    try {
      const mimeType = req.headers.get("content-type") || "audio/webm";
      const arrayBuffer = await req.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        return Response.json({ error: "Empty audio payload" }, { status: 400 });
      }
      if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
        return Response.json({ error: "Audio exceeds 5 MB limit" }, { status: 413 });
      }

      const id = generateShortId();
      await store.set(id, arrayBuffer, {
        metadata: {
          mimeType,
          createdAt: Date.now()
        }
      });

      return Response.json({ id }, { status: 201 });
    } catch (err) {
      return Response.json({ error: "Failed to save audio" }, { status: 500 });
    }
  }

  if (req.method === "GET") {
    const id = (url.searchParams.get("id") || "").trim().toLowerCase();
    if (!/^[a-z0-9]{4,12}$/.test(id)) {
      return Response.json({ error: "Invalid voice ID" }, { status: 400 });
    }

    try {
      const result = await store.getWithMetadata(id, { type: "arrayBuffer" });
      if (!result || !result.data) {
        return Response.json({ error: "Voice not found" }, { status: 404 });
      }

      return new Response(result.data, {
        status: 200,
        headers: {
          "Content-Type": result.metadata?.mimeType || "audio/webm",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    } catch (err) {
      return Response.json({ error: "Failed to load audio" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

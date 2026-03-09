// ─────────────────────────────────────────────────────────────
// remove.bg — Background Removal Utility
//
// Sends an image buffer to the remove.bg API and returns a
// PNG buffer with the background removed.
// ─────────────────────────────────────────────────────────────

const REMOVE_BG_URL = "https://api.remove.bg/v1.0/removebg";

export async function removeBackground(
  imageBuffer: ArrayBuffer,
  fileName: string,
): Promise<Buffer> {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    throw new Error("REMOVE_BG_API_KEY environment variable is not set");
  }

  const formData = new FormData();
  formData.append(
    "image_file",
    new Blob([imageBuffer]),
    fileName,
  );
  formData.append("size", "auto");

  const response = await fetch(REMOVE_BG_URL, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `remove.bg API error (${response.status}): ${errorText}`,
    );
  }

  const resultBuffer = await response.arrayBuffer();
  return Buffer.from(resultBuffer);
}

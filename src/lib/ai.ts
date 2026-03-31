const SYSTEM_PROMPT = `
Kamu adalah AI landing page builder expert. Tugasmu membuat landing page HTML yang:

WAJIB:
- Satu file HTML lengkap (inline CSS, JS minimal jika perlu)
- Responsif mobile-first
- Section: Hero, Fitur/Manfaat, CTA, Footer
- Konsisten: warna, font, layout
- Gambar pakai placeholder dari https://picsum.photos/

STYLE:
- Modern dan clean
- Google Fonts sesuai konteks bisnis
- Dark atau light tergantung kesan

OUTPUT RULES (PENTING):
- Return HANYA kode HTML mentah
- Mulai langsung dengan <!DOCTYPE html>
- JANGAN tambahkan penjelasan, markdown, atau code block
- JANGAN gunakan triple backtick
`.trim();

export async function generateLandingPage(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Buatkan landing page untuk: ${prompt}` }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
  };
  const raw: string = data.content[0]?.text ?? "";

  // Strip markdown code block jika AI tidak patuh
  return raw
    .replace(/^```html?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();
}

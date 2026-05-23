// ══════════════════════════════════════════════════════
// 💎 DIAMOND ENGINE — AI Proxy (Vercel Serverless)
// يدعم: Anthropic Claude | OpenAI GPT | Google Gemini
// ══════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { provider = 'anthropic', apiKey, userMsg, sysPrompt = '', imageData } = req.body;

  // المفتاح: من الطلب أو من متغيرات البيئة
  const key = apiKey ||
    process.env[provider === 'anthropic' ? 'ANTHROPIC_API_KEY' :
                provider === 'openai'    ? 'OPENAI_API_KEY'    : 'GEMINI_API_KEY'];

  if (!key) {
    return res.status(400).json({ error: `مفتاح ${provider} API غير موجود. أدخله في إعدادات 🤖 AI أو أضفه في Vercel Environment Variables.` });
  }

  try {
    let text = '';
    if      (provider === 'anthropic') text = await callAnthropic(key, userMsg, sysPrompt, imageData);
    else if (provider === 'openai')    text = await callOpenAI(key, userMsg, sysPrompt, imageData);
    else if (provider === 'gemini')    text = await callGemini(key, userMsg, sysPrompt, imageData);
    else return res.status(400).json({ error: 'مزوّد غير معروف: ' + provider });

    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// ── Anthropic Claude ──────────────────────────────────
async function callAnthropic(key, userMsg, sysPrompt, imageData) {
  const content = [];
  if (imageData) content.push({ type: 'image', source: { type: 'base64', media_type: imageData.type, data: imageData.data } });
  content.push({ type: 'text', text: userMsg });

  const body = { model: 'claude-sonnet-4-20250514', max_tokens: 4000, messages: [{ role: 'user', content }] };
  if (sysPrompt) body.system = sysPrompt;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content?.map(c => c.text || '').join('') || '';
}

// ── OpenAI GPT ────────────────────────────────────────
async function callOpenAI(key, userMsg, sysPrompt, imageData) {
  const messages = [];
  if (sysPrompt) messages.push({ role: 'system', content: sysPrompt });
  if (imageData) {
    messages.push({ role: 'user', content: [
      { type: 'image_url', image_url: { url: `data:${imageData.type};base64,${imageData.data}` } },
      { type: 'text', text: userMsg }
    ]});
  } else {
    messages.push({ role: 'user', content: userMsg });
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model: 'gpt-4o', max_tokens: 4000, messages })
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.choices?.[0]?.message?.content || '';
}

// ── Google Gemini ─────────────────────────────────────
async function callGemini(key, userMsg, sysPrompt, imageData) {
  const parts = [];
  if (imageData) parts.push({ inlineData: { mimeType: imageData.type, data: imageData.data } });
  parts.push({ text: sysPrompt ? sysPrompt + '\n\n' + userMsg : userMsg });

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }] }) }
  );
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

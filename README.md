# 💎 DIAMOND ENGINE ULTRA — صانع الأوائل

## 🚀 رفع المشروع على Vercel (مجاناً في 5 دقائق)

### الخطوة 1 — إنشاء حساب GitHub
1. اذهب إلى [github.com](https://github.com) وأنشئ حساباً مجانياً
2. أنشئ مستودعاً جديداً باسم `diamond-engine`
3. ارفع ملفات المجلد هذا كلها

### الخطوة 2 — ربط Vercel
1. اذهب إلى [vercel.com](https://vercel.com) وسجّل دخولاً بحساب GitHub
2. اضغط **"Add New Project"**
3. اختر مستودع `diamond-engine`
4. اضغط **"Deploy"** مباشرة — بدون أي إعدادات

### الخطوة 3 — إضافة مفاتيح API (اختياري)
إذا أردت مفاتيح ثابتة بدون إدخالها في كل مرة:
1. في لوحة Vercel → **Settings → Environment Variables**
2. أضف واحداً أو أكثر:
   - `ANTHROPIC_API_KEY` = `sk-ant-...`
   - `OPENAI_API_KEY` = `sk-...`
   - `GEMINI_API_KEY` = `AIza...`
3. اضغط **Redeploy**

### النتيجة
- رابط عام مثل: `https://diamond-engine-abc123.vercel.app`
- يعمل على الموبايل والكمبيوتر
- الذكاء الاصطناعي يعمل بالكامل (توليد + OCR)
- التحديثات تنزل تلقائياً عند رفع أي تعديل

---

## 📁 هيكل المشروع

```
diamond-engine/
├── api/
│   └── ai.js          ← الـ proxy (يحل مشكلة CORS)
├── public/
│   └── index.html     ← التطبيق كاملاً
├── vercel.json        ← إعدادات Vercel
├── package.json
└── README.md
```

## 🔑 الحصول على مفاتيح API

| المزوّد | الرابط | السعر |
|---------|--------|-------|
| Anthropic Claude | [console.anthropic.com](https://console.anthropic.com/keys) | مدفوع / رصيد مجاني للبداية |
| OpenAI GPT | [platform.openai.com](https://platform.openai.com/api-keys) | مدفوع / رصيد مجاني للبداية |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) | **مجاني** بحدود سخية |

> 💡 **نصيحة:** ابدأ بـ Gemini — مجاني تماماً ويدعم الصور والتوليد.

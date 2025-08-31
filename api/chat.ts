// api/chat.ts
export default async function handler(req, res) {
  const { messages } = req.body;
  const API_KEY = process.env.QWEN_API_KEY;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages },
        parameters: { temperature: 0.7, max_tokens: 1024 }
      }),
    });

    const data = await response.json();
    const text = data.output?.text || "I'm not sure how to help with that.";
    res.status(200).json({ choices: [{ message: { content: text } }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reach AI" });
  }
}

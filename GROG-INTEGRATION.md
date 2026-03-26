``` bash
npx create-next-app my-groq-app
# or
yarn create next-app my-groq-app
# or
pnpm create next-app my-groq-app

```

# Pull your latest environment variables
Run vercel env pull .env.development.local to make the latest environment variables available to your project locally.

# Install the SDK

``` bash
npm install groq-sdk
# or
yarn add groq-sdk
# or
pnpm add groq-sdk

```

# Create (or edit) your project API route

Create an API route in your Next.js project at pages/api/groq-test.js:

``` javascript

import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  const groq = new Groq({ apiKey: process.env.YOUR_SECRET });
  
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Hello from Vercel!" }
      ]
    });
    
    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

# 5

Start the app

Run npm run dev or yarn dev or pnpm dev and navigate to http://localhost:3000/api/groq-test to test your integration.
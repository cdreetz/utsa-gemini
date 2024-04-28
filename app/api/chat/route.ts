import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
 
export const dynamic = 'force-dynamic';
 
// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});
 
export async function POST(req: Request) {
  try {
    // Extract the `prompt` from the body of the request
    const { messages } = await req.json();
  
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-1.5-pro-latest' })
      .generateContentStream(buildGoogleGenAIPrompt(messages));
  
    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);
  
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in POST /api/chat', error);
    if (error instanceof GoogleGenerativeAI) {
      return new Response(JSON.stringify({ error: true, message: "The model is overloaded. Please try again later."}), { status: 503, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ error: true, message: "An unexpected error occured."}), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
}
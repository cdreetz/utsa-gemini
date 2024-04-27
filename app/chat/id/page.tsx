import ChatComponent from "@/components/chat";
import { Message } from "ai/react";
import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Params {
  id: number;
}

const urls = [
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/sta/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cs/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cpe/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/ent/"
];


const fetchAndParseHTML = async (urls: string[]): Promise<string> => {
  try {
    const allCoursesText: string[] = await Promise.all(urls.map(async (url) => {
      const { data: htmlString } = await axios.get(url);
      const dom = new JSDOM(htmlString);
      const coursesText = dom.window.document.querySelector('.courses')?.textContent || '';
      return coursesText.replace(/\s+/g, ' ').trim();
    }));

    return allCoursesText.join(' ');
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
    return '';
  }
};

const initialMessages = async (): Promise<Message[]> => {
  const htmlString = await fetchAndParseHTML(urls);
  const messages: Message[] = [
    { id: 'system-0', role: "user", content: `Answer questions based on the html string.${htmlString}` },
    { id: 'assistant-0', role: "assistant", content: "How can I help you learn about UTSA programs?" },
  ];
  console.log("Initial messages:", messages);
  return messages;
};


export default async function PrescreeningChat({ params }: { params: Params }) {
  return (
    <>
      <div className="mt-20 mb-5 h-full">
        <ChatComponent initialMessages={await initialMessages()} />
      </div>
    </>
  )
}

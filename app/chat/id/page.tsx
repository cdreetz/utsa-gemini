import ChatComponent from "@/components/chat";
import { Message } from "ai/react";
import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Params {
  id: number;
}

//const urls = [
//  "https://catalog.utsa.edu/undergraduate/coursedescriptions/sta/",
//  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cs/",
//  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cpe/",
//  "https://catalog.utsa.edu/undergraduate/coursedescriptions/ent/"
//];

// Assuming baseURL is the base URL of the website where the course descriptions are listed
const baseURL = 'https://catalog.utsa.edu';

const fetchCourseURLs = async (): Promise<string[]> => {
  try {
    const indexPageURL = `${baseURL}/undergraduate/coursedescriptions/`;
    const { data: htmlString } = await axios.get(indexPageURL);
    const dom = new JSDOM(htmlString);
    const links = dom.window.document.querySelectorAll('.atozindex ul li a');
    const urls = Array.from(links).map(link => baseURL + link.getAttribute('href'));
    return urls;
  } catch (error) {
    console.error('Error fetching course URLs:', error);
    return [];
  }
};

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
  const urls = await fetchCourseURLs();
  console.log("Fetched URLs:", urls);
  const htmlString = await fetchAndParseHTML(urls);
  const messages: Message[] = [
    { id: 'system-0', role: "user", content: `You are a helpful Academic Assistant. You have the full university catalog in the form of a single string. Answer any questions based on the contents of this catalog: ${htmlString}` },
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

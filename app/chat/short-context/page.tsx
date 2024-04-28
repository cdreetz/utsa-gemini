import ChatComponent from "@/components/chat";
import { Message } from "ai/react";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import xpath from 'xpath';

interface Params {
  id: number;
}

const urls = [
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/sta/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cs/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/cpe/",
  "https://catalog.utsa.edu/undergraduate/coursedescriptions/ent/"
];

// Assuming baseURL is the base URL of the website where the course descriptions are listed
const baseURL = 'https://catalog.utsa.edu';

//const fetchCourseURLs = async (): Promise<string[]> => {
//  try {
//    const indexPageURL = `${baseURL}/undergraduate/coursedescriptions/`;
//    const { data: htmlString } = await axios.get(indexPageURL);
//    const dom = new JSDOM(htmlString);
//    const links = dom.window.document.querySelectorAll('.atozindex ul li a');
//    const urls = Array.from(links).map(link => baseURL + link.getAttribute('href'));
//    return urls;
//  } catch (error) {
//    console.error('Error fetching course URLs:', error);
//    return [];
//  }
//};

//const fetchCourseURLs = async (): Promise<string[]> => {
//  try {
//    const indexPageURL = `${baseURL}/undergraduate/coursedescriptions/`;
//    const { data: htmlString } = await axios.get(indexPageURL);
//    const dom = new JSDOM(htmlString);
//    const doc = dom.window.document;
//
//    // XPath for the atozindex div
//    const atozIndexXPath = "/html/body/div[6]/div[2]/div[2]/div/div[2]";
//    const evaluator = new dom.window.XPathEvaluator();
//    const atozIndexResult = evaluator.evaluate(atozIndexXPath, doc, null, dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//
//    let urls: string[] = [];
//    if (atozIndexResult) {
//      // Assuming each letter section is represented by a ul within the atozindex div
//      // Adjust the XPath or iteration logic if the structure is different
//      for (let i = 1; i <= atozIndexResult.childNodes.length; i++) {
//        // Constructing XPath for each letter section's ul
//        const letterSectionXPath = `${atozIndexXPath}/ul[${i}]`;
//        const letterSectionResult = evaluator.evaluate(letterSectionXPath, doc, null, dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//
//        if (letterSectionResult) {
//          // Now, for each letter section, find the links
//          const links = (letterSectionResult as Element).querySelectorAll("li > a");
//          links.forEach((link: Element) => {
//            const href = link.getAttribute('href');
//            if (href) {
//              urls.push(baseURL + href);
//            }
//          });
//        }
//      }
//    }
//    return urls;
//  } catch (error) {
//    console.error('Error fetching course URLs:', error);
//    return [];
//  }
//};

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

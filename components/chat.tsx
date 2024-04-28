'use client'
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Message, useChat } from "ai/react";
import ReactMarkdown from 'react-markdown';

interface ChatComponentProps {
  initialMessages: Message[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages}) => {
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, setMessages } = useChat();

  useEffect(() => {
    setMessages(initialMessages);
  }, [setMessages, initialMessages]);

  const visibleMEssages = messages.slice(1);

  const handleSubmit = async (event?: React.SyntheticEvent) => {
    if (event) {
      event?.preventDefault();
      originalHandleSubmit(event as React.FormEvent<HTMLFormElement>);
    }

  }

  const handleKeyboardSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex flex-col h-full items-center mx-auto w-5/6">
      <ScrollArea className="flex-1 w-full rounded-md border overflow-y-auto bg-white ">
        <div className="p-4">
          <h4 className="self-start mb-4 text-sm font-bold leading-none text-[#d3430d]">UTSA+Gemini AI Academic Advisor</h4>
          <Separator className="my-2 border-b" />
          <div className="flex gap-2 flex-col">
            {visibleMEssages.filter(m => m.role !== 'system').map(m => (
              <React.Fragment key={m.id}>
                <div className="text-sm">
                  <div className="font-bold">{m.role === 'user' ? 'You' : 'Assistant'}:</div>
                  <div className="m-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="mt-4" />
        <Textarea
          placeholder="Type message here.."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyboardSubmit}
        />
        <Button className="mt-2 w-full bg-black text-white" onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}>Send Message</Button>
    </div>
  );
};

export default ChatComponent;
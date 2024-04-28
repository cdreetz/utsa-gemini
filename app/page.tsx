import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

function HomeCard() {
  return (
    <Card className="w-full md:w-1/2 overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#d3430d] text-center md:text-left">UTSA+Gemini AI Academic Advisor</CardTitle>
        <CardDescription className="text-sm md:text-base">Learn about all UTSA programs, courses, and curriculum. Ask questions with an AI chatbot and get instant help.</CardDescription>
      </CardHeader>
      <div className="flex justify-center">
        <Separator className="mb-4 w-3/4"></Separator>
      </div>
      <CardContent>
        <div className="flex flex-col gap-10 px-4 mb-4">
          <CardDescription className="text-sm md:text-base">Due to Vercel timeout limits for free tier maxing out at 10 seconds and long context responses taking 30-60s, the deployed long context version does not work, but it will work if running locally.</CardDescription>
          <div className="flex flex-col gap-2">
            <Label htmlFor="short-context">Short Context Functional Version</Label>
            <Button id="short-context" className="text-xs md:text-sm">
              <Link href="/chat/short-context">Short Context</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="long-context">Long Context Nonfunctional Version</Label>
            <Button id="long-context" className="text-xs md:text-sm">
              <Link href="/chat/long-context">Long Context</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <HomeCard />
    </div>
  )
}
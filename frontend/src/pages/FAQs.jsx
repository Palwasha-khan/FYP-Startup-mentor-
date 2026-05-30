import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingLayout from "@/components/landing/LandingLayout";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What is Start Up Mentor?",
    answer: "Start Up Mentor is an AI-powered platform that helps entrepreneurs validate their startup ideas, identify potential risks, and get data-driven insights before investing time and resources.",
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our advanced algorithms analyze your business model, target market, location, and industry trends to provide comprehensive insights about your startup idea's potential for success.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All your startup ideas and personal information are encrypted and stored securely. We never share your data with third parties.",
  },
  {
    question: "How accurate are the predictions?",
    answer: "Our predictions are based on extensive market data and historical patterns. While no prediction is 100% accurate, our insights help you make more informed decisions.",
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. No questions asked.",
  },
  {
    question: "How do I get started?",
    answer: "Simply create an account, submit your startup idea using our intuitive form, and receive comprehensive AI-powered analysis within minutes.",
  },
];

const FAQs = () => {
  return (
    <LandingLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about Start Up Mentor
          </p>
        </div>

        <Card className="p-8 bg-white border-border/30 shadow-2xl rounded-2xl mb-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/30">
                <AccordionTrigger className="text-left font-semibold hover:text-primary py-5 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Still have questions */}
        <Card className="p-8 bg-gradient-to-br from-purple/5 via-pink/5 to-cyan/5 border-border/30 rounded-2xl text-center">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">Can't find what you're looking for? We're here to help!</p>
          <Link to="/contact">
            <Button className="gradient-button text-white rounded-xl px-8 py-3">
              Contact Support
            </Button>
          </Link>
        </Card>
      </div>
    </LandingLayout>
  );
};

export default FAQs;

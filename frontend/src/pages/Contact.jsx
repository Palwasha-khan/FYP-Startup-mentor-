import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LandingLayout from "@/components/landing/LandingLayout";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSubmitContactMutation } from "@/redux/api/contactApi";
import Loader from "@/components/ui/loader";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@startupmentor.com",
    gradient: "icon-blue",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+92 300 1234567",
    gradient: "icon-purple",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Lahore, Pakistan",
    gradient: "icon-cyan",
  },
];

const Contact = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitContact, { isLoading }] = useSubmitContactMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all the fields before sending.",
      });
      return;
    }

    try {
      // Call the mutation
      await submitContact({ name, email, subject, message }).unwrap();

      toast({
        title: "Message Sent!",
        description: "Your message has been saved and emailed to our team.",
      });

      // Clear the form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
       console.log(err)
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };
  

  return (
    <LandingLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-400 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 bg-white border-border/30 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${info.gradient} flex items-center justify-center shadow-lg`}>
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{info.title}</h3>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 p-8 bg-white border-border/30 shadow-2xl rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Added Subject Input to match backend controller */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is this regarding?"
                  className="bg-muted/20"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px] bg-muted/30 border-border/50 focus:border-primary rounded-xl resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 gradient-button text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </LandingLayout>
  );
};

export default Contact;

import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LandingLayout from "@/components/landing/LandingLayout";
import { useGetfeedbacksQuery } from "@/redux/api/feedbackApi";

const reviews = [
  {
    quote: "This platform helped me validate my startup idea and identify potential risks I hadn't considered. The suggestions were incredibly valuable!",
    name: "Sarah Johnson",
    role: "Tech Entrepreneur",
    initials: "SJ",
    rating: 5,
  },
  {
    quote: "An excellent tool for organizing thoughts and getting structured feedback. The interface is intuitive and the insights are spot-on.",
    name: "Michael Chen",
    role: "Business Consultant",
    initials: "MC",
    rating: 5,
  },
  {
    quote: "I've used many mentoring platforms, but this one stands out with its modern design and practical approach to idea validation.",
    name: "Emily Rodriguez",
    role: "Startup Founder",
    initials: "ER",
    rating: 5,
  },
  {
    quote: "The AI analysis gave me insights I never would have thought of. Helped me pivot my idea before wasting months on the wrong approach.",
    name: "David Park",
    role: "Serial Entrepreneur",
    initials: "DP",
    rating: 5,
  },
  {
    quote: "Clean interface, powerful features, and genuinely helpful suggestions. This is exactly what the startup ecosystem needed.",
    name: "Lisa Thompson",
    role: "Angel Investor",
    initials: "LT",
    rating: 5,
  },
  {
    quote: "Used this to validate three different ideas. The risk assessment feature alone saved me from a costly mistake.",
    name: "James Wilson",
    role: "Product Manager",
    initials: "JW",
    rating: 5,
  },
];

const stats = [
  { value: "5.0", label: "Average Rating", icon: "⭐" },
  { value: "500+", label: "Happy Users", icon: "👥" },
  { value: "1000+", label: "Ideas Validated", icon: "💡" },
];

const Reviews = () => {

 const { data, error, isLoading } = useGetfeedbacksQuery();
 
console.log("DATA:", data?.data);
console.log("ERROR:", error);
console.log("LOADING:", isLoading);

  return (
    <LandingLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              User Reviews
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See what our community says about their experience with Start Up Mentor
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-white border-border/30 shadow-xl rounded-2xl text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-accent-900 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {data?.data?.map((review, index) => (
    <Card
      key={review._id}
      className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border border-border/30 rounded-2xl hover:-translate-y-1"
    >
      <Quote className="w-8 h-8 text-pink/30 mb-4" />

      <p className="text-blue mb-6 leading-relaxed">
        {review.message}
      </p>

      <div className="flex gap-1 mb-4">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-gold text-gold" />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/30">
        <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400">
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
            {review.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="font-semibold text-foreground">
            {review.user?.name}
          </div>
        </div>
      </div>
    </Card>
  ))}
</div>

      </div>
    </LandingLayout>
  );
};

export default Reviews;

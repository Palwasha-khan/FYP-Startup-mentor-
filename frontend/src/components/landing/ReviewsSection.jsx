import { Star, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetfeedbacksQuery } from "@/redux/api/feedbackApi";


const stats = [
  { value: "5.0", label: "Average Rating" },
  { value: "500+", label: "Happy Users" },
  { value: "1000+", label: "Ideas Validated" },
];

const ReviewsSection = () => {
  
   const { data, error, isLoading } = useGetfeedbacksQuery();
   const latestReviews = data?.data 
  ? [...data.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3) 
  : [];
   
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple/20 to-pink/20 flex items-center justify-center blur-xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 blur-xl opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink/10 text-pink text-sm font-medium mb-6">
            ⭐ Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500   to-cyan-400 bg-clip-text text-transparent">
              User Reviews
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See what our community says about their experience with Start Up Mentor
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 md:gap-20 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r  from-pink-500   to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {latestReviews.map((review) => (
            <Card
              key={review._id}
              className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border border-border/30 rounded-2xl hover:-translate-y-1"
            >
              {/* Quote icon */}
              <div className="text-5xl text-pink/30 mb-2 font-serif">"</div>

              {/* Quote text */}
              <p className="text-foreground mb-6 leading-relaxed">
                {review.message}
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                 {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-gold text-gold" />
        ))}
              </div>

              {/* Author */}
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
    </section>
  );
};

export default ReviewsSection;
// import { useState } from "react";
// import { Lightbulb, Target, MapPin, Sparkles, Users, Award, Wallet, ChevronDown } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import LocationMapPicker from "@/components/dashboard/LocationMapPicker";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Checkbox } from "@/components/ui/checkbox";

// // API & UI Hooks
// import { useSubmitIdeaMutation } from "@/redux/api/ideaApi";
// import { useToast } from "@/hooks/use-toast";

// const categories = [
//   "Technology",
//   "Healthcare",
//   "Finance",
//   "Education",
//   "E-Commerce",
//   "Food",
// ];

// const marketReadinessOptions = {
//   Food: ["Cook", "Shop", "Sitting Area", "Kitchen Equipment", "Delivery Setup"],
//   Healthcare: ["Staff", "Building", "Machinery", "Licensing", "Medical Supplies"],
//   Education: ["Teachers", "Classrooms", "Curriculum", "Learning Materials", "Online Platform"],
//   Technology: ["Prototype", "MVP", "Beta Release", "Production", "Scaling"],
//   Finance: ["Concept", "Compliance", "Pilot", "Partnerships", "Market Launch"],
//   "E-Commerce": ["Product Sourcing", "Website", "Payment Setup", "Logistics", "Marketing"],
// };

// const DashboardSubmitIdea = () => {
//   // --- Form State ---
//   const [title, setTitle] = useState(""); // Add this line
//   const [category, setCategory] = useState("");
//   const [lat, setLat] = useState(30.3753);
//   const [lng, setLng] = useState(69.3451);
//   const [locationName, setLocationName] = useState("");
//   const [description, setDescription] = useState("");
//   const [teamSize, setTeamSize] = useState(1);
//   const [avgTeamExperience, setAvgTeamExperience] = useState(0);
//   const [fundingAmount, setFundingAmount] = useState("");
//   const [mentorshipSupport, setMentorshipSupport] = useState(0);
//   const [incubationSupport, setIncubationSupport] = useState(0);
//   const [readinessChecked, setReadinessChecked] = useState([]);
//   // --- Hooks ---
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [submitIdea, { isLoading }] = useSubmitIdeaMutation();

//   const readinessChoices = category ? marketReadinessOptions[category] ?? [] : [];
//   const marketReadinessLevel = readinessChecked.length;

//   const handleCategoryChange = (val) => {
//     setCategory(val);
//     setReadinessChecked([]); // Reset readiness when category changes
//   };
//   const toggleReadiness = (opt) => {
//     setReadinessChecked((prev) =>
//       prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
//     );
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic Validation
//     if (!category || !description || !locationName) {
//       toast({
//         variant: "destructive",
//         title: "Missing Fields",
//         description: "Please fill in the Category, Location, and Description.",
//       });
//       return;
//     }

//     // const ideaData = {
//     // Inside your ideaController.js
//     const ideaData = {
//       title: req.body.title,
//       category: req.body.category,
//       locationName: req.body.locationName,
//       description: req.body.description,
//       teamSize: parseInt(req.body.teamSize),
//       // Ensure this is a float/number
//       avgTeamExperience: parseFloat(req.body.avgTeamExperience),
//       fundingAmount: parseFloat(req.body.fundingAmount),
//       // CONVERT 0/1 to true/false for Python
//       mentorshipSupport: !!req.body.mentorshipSupport,
//       incubationSupport: !!req.body.incubationSupport,
//       marketReadinessLevel: parseInt(req.body.marketReadinessLevel),
//       marketReadinessItems: req.body.marketReadinessItems || []
//     };

//     // Log this to your terminal to see exactly what is being sent to Python
//     console.log("Calling Python API with:", ideaData);

//     const pythonResponse = await axios.post("http://127.0.0.1:8080/predict", ideaData);


//     //   title,
//     //   category,
//     //   lat,
//     //   lng,
//     //   locationName,
//     //   description,
//     //   teamSize,
//     //   avgTeamExperience,
//     //   fundingAmount: fundingAmount ? Number(fundingAmount) : 0,
//     //   mentorshipSupport,
//     //   incubationSupport,
//     //   marketReadinessLevel,
//     //   marketReadinessItems: readinessChecked,
//     // };

//     console.log("📤 FRONTEND SENDING TO BACKEND:", ideaData);

//     try {
//       // API Call
//       const response = await submitIdea(ideaData).unwrap();

//       toast({
//         title: "Idea Submitted!",
//         description: "Analyzing your startup potential...",
//       });

//       // Navigate to results using the ID from the backend
//       navigate(`/dashboard/results/${response.idea._id}`);

//     } catch (error) {
//       console.error("Submission Error:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error?.data?.message || "Something went wrong while submitting.",
//       });
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="max-w-4xl mx-auto">
//         <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
//               <Lightbulb className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
//                 Submit Your Idea
//               </h2>
//               <p className="text-muted-foreground">Transform your vision into reality ✨</p>
//             </div>
//           </div>
//           {/* Title */}
//           <div className="mb-6">
//             <label className="flex items-center gap-2 text-sm font-medium mb-2">
//               <Sparkles className="w-4 h-4 text-purple-500" />
//               Idea Title
//             </label>
//             <Input
//               placeholder="Your Startup Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="bg-background/50 border-border/50"
//             />
//           </div>

//           {/* Category & Readiness */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="flex items-center gap-2 text-sm font-medium mb-2">
//                 <Target className="w-4 h-4 text-pink-500" />
//                 Category
//               </label>
//               <Select value={category} onValueChange={handleCategoryChange}>
//                 <SelectTrigger className="bg-background/50 border-border/50">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover border-border z-[10000]">
//                   {categories.map((cat) => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="flex items-center gap-2 text-sm font-medium mb-2">
//                 <Sparkles className="w-4 h-4 text-cyan" />
//                 Market Readiness Level{" "}
//                 <span className="text-muted-foreground">({marketReadinessLevel})</span>
//               </label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     disabled={!category}
//                     className="w-full justify-between bg-background/50 border-border/50 font-normal"
//                   >
//                     <span className="truncate text-left">
//                       {!category
//                         ? "Select category first"
//                         : readinessChecked.length === 0
//                           ? "Select readiness items"
//                           : readinessChecked.join(", ")}
//                     </span>
//                     <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[--radix-popover-trigger-width] bg-popover border-border z-[10000] p-2">
//                   <div className="space-y-1">
//                     {readinessChoices.map((opt) => (
//                       <label
//                         key={opt}
//                         className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
//                       >
//                         <Checkbox
//                           checked={readinessChecked.includes(opt)}
//                           onCheckedChange={() => toggleReadiness(opt)}
//                         />
//                         <span className="text-sm">{opt}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>

//           </div>

//           {/* Location Picker */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-sm font-medium mb-2">
//               <MapPin className="w-4 h-4 text-cyan-500" />
//               Location
//             </label>
//             <LocationMapPicker
//               lat={lat}
//               lng={lng}
//               locationName={locationName}
//               onChange={(newLat, newLng, name) => {
//                 setLat(newLat);
//                 setLng(newLng);
//                 setLocationName(name);
//               }}
//             />
//           </div>

//           {/* Sliders for Team */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="flex items-center justify-between gap-2 text-sm font-medium mb-2">
//                 <span className="flex items-center gap-2">
//                   <Users className="w-4 h-4 text-cyan-500" />
//                   Team Size
//                 </span>
//                 <span className="text-muted-foreground font-bold">{teamSize}</span>
//               </label>
//               <Slider
//                 min={1}
//                 max={10}
//                 step={1}
//                 value={[teamSize]}
//                 onValueChange={(v) => setTeamSize(v[0])}
//               />
//             </div>

//             <div>
//               <label className="flex items-center justify-between gap-2 text-sm font-medium mb-2">
//                 <span className="flex items-center gap-2">
//                   <Award className="w-4 h-4 text-pink-500" />
//                   Avg. Team Experience (yrs)
//                 </span>
//                 <span className="text-muted-foreground font-bold">{avgTeamExperience}</span>
//               </label>
//               <Slider
//                 min={0}
//                 max={10}
//                 step={0.5}
//                 value={[avgTeamExperience]}
//                 onValueChange={(v) => setAvgTeamExperience(v[0])}
//               />
//             </div>
//           </div>

//           {/* Funding */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-sm font-medium mb-2">
//               <Wallet className="w-4 h-4 text-purple-500" />
//               Funding Amount (PKR)
//             </label>
//             <Input
//               type="number"
//               placeholder="e.g. 500000"
//               value={fundingAmount}
//               onChange={(e) => setFundingAmount(e.target.value)}
//               className="bg-background/50 border-border/50"
//             />
//           </div>

//           {/* Support Buttons */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">Mentorship Support</label>
//               <div className="flex gap-2">
//                 {[{ l: "Yes", v: 1 }, { l: "No", v: 0 }].map((o) => (
//                   <Button
//                     key={o.l}
//                     variant={mentorshipSupport === o.v ? "default" : "outline"}
//                     onClick={() => setMentorshipSupport(o.v)}
//                     className="flex-1"
//                   >
//                     {o.l}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-2 block">Incubation Support</label>
//               <div className="flex gap-2">
//                 {[{ l: "Yes", v: 1 }, { l: "No", v: 0 }].map((o) => (
//                   <Button
//                     key={o.l}
//                     variant={incubationSupport === o.v ? "default" : "outline"}
//                     onClick={() => setIncubationSupport(o.v)}
//                     className="flex-1"
//                   >
//                     {o.l}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mb-6">
//             <label className="flex items-center gap-2 text-sm font-medium mb-2">
//               <Sparkles className="w-4 h-4 text-purple-500" />
//               Idea Description
//             </label>
//             <Textarea
//               placeholder="Describe your innovative startup idea in detail..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="bg-background/50 border-border/50 min-h-[150px]"
//             />
//           </div>

//           {/* Submit Button */}
//           <Button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full gradient-button text-white font-semibold py-6 text-lg transition-all active:scale-95"
//           >
//             {isLoading ? "Analyzing Vision..." : "🚀 Analyze My Idea ✨"}
//           </Button>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default DashboardSubmitIdea;



import { useState } from "react";
import { Lightbulb, Target, MapPin, Sparkles, Users, Award, Wallet, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LocationMapPicker from "@/components/dashboard/LocationMapPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// API & UI Hooks
import { useSubmitIdeaMutation } from "@/redux/api/ideaApi";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-Commerce",
  "Food",
];

const marketReadinessOptions = {
  Food: ["Cook", "Shop", "Sitting Area", "Kitchen Equipment", "Delivery Setup"],
  Healthcare: ["Staff", "Building", "Machinery", "Licensing", "Medical Supplies"],
  Education: ["Teachers", "Classrooms", "Curriculum", "Learning Materials", "Online Platform"],
  Technology: ["Prototype", "MVP", "Beta Release", "Production", "Scaling"],
  Finance: ["Concept", "Compliance", "Pilot", "Partnerships", "Market Launch"],
  "E-Commerce": ["Product Sourcing", "Website", "Payment Setup", "Logistics", "Marketing"],
};

const DashboardSubmitIdea = () => {
  // --- Form State ---
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [lat, setLat] = useState(30.3753);
  const [lng, setLng] = useState(69.3451);
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [avgTeamExperience, setAvgTeamExperience] = useState(0);
  const [fundingAmount, setFundingAmount] = useState("");
  const [mentorshipSupport, setMentorshipSupport] = useState(0);
  const [incubationSupport, setIncubationSupport] = useState(0);
  const [readinessChecked, setReadinessChecked] = useState([]);

  // --- Hooks ---
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitIdea, { isLoading }] = useSubmitIdeaMutation();

  const readinessChoices = category ? marketReadinessOptions[category] ?? [] : [];
  const marketReadinessLevel = readinessChecked.length;

  const handleCategoryChange = (val) => {
    setCategory(val);
    setReadinessChecked([]);
  };

  const toggleReadiness = (opt) => {
    setReadinessChecked((prev) =>
      prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!title || !category || !description || !locationName) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in the Title, Category, Location, and Description.",
      });
      return;
    }

    // 2. Prepare Data Object for Backend
    const ideaData = {
      title,
      category,
      lat,
      lng,
      locationName,
      description,
      teamSize: Number(teamSize),
      avgTeamExperience: Number(avgTeamExperience),
      fundingAmount: fundingAmount ? Number(fundingAmount) : 0,
      mentorshipSupport: mentorshipSupport === 1, // Convert 1/0 to true/false
      incubationSupport: incubationSupport === 1, // Convert 1/0 to true/false
      marketReadinessLevel,
      marketReadinessItems: readinessChecked,
    };

    console.log("📤 FRONTEND SENDING TO BACKEND:", ideaData);

    try {
      // 3. API Call via RTK Query
      const response = await submitIdea(ideaData).unwrap();

      toast({
        title: "Idea Submitted!",
        description: "Analyzing your startup potential...",
      });

      // 4. Navigate to results using the ID from the backend
      if (response?.idea?._id) {
        navigate(`/dashboard/results/${response.idea._id}`);
      }

    } catch (error) {
      console.error("Submission Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.data?.message || "Something went wrong while submitting.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                Submit Your Idea
              </h2>
              <p className="text-muted-foreground">Transform your vision into reality ✨</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Idea Title
            </label>
            <Input
              placeholder="Your Startup Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Target className="w-4 h-4 text-pink-500" />
                Category
              </label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-[10000]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4 text-cyan" />
                Market Readiness Level <span className="text-muted-foreground">({marketReadinessLevel})</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!category}
                    className="w-full justify-between bg-background/50 border-border/50 font-normal"
                  >
                    <span className="truncate text-left">
                      {!category
                        ? "Select category first"
                        : readinessChecked.length === 0
                          ? "Select readiness items"
                          : readinessChecked.join(", ")}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] bg-popover border-border z-[10000] p-2">
                  <div className="space-y-1">
                    {readinessChoices.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                      >
                        <Checkbox
                          checked={readinessChecked.includes(opt)}
                          onCheckedChange={() => toggleReadiness(opt)}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 text-cyan-500" />
              Location
            </label>
            <LocationMapPicker
              lat={lat}
              lng={lng}
              locationName={locationName}
              onChange={(newLat, newLng, name) => {
                setLat(newLat);
                setLng(newLng);
                setLocationName(name);
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center justify-between gap-2 text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-500" />
                  Team Size
                </span>
                <span className="text-muted-foreground font-bold">{teamSize}</span>
              </label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[teamSize]}
                onValueChange={(v) => setTeamSize(v[0])}
              />
            </div>

            <div>
              <label className="flex items-center justify-between gap-2 text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-500" />
                  Avg. Team Experience (yrs)
                </span>
                <span className="text-muted-foreground font-bold">{avgTeamExperience}</span>
              </label>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[avgTeamExperience]}
                onValueChange={(v) => setAvgTeamExperience(v[0])}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Wallet className="w-4 h-4 text-purple-500" />
              Funding Amount (PKR)
            </label>
            <Input
              type="number"
              placeholder="e.g. 500000"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Mentorship Support</label>
              <div className="flex gap-2">
                {[{ l: "Yes", v: 1 }, { l: "No", v: 0 }].map((o) => (
                  <Button
                    key={o.l}
                    type="button"
                    variant={mentorshipSupport === o.v ? "default" : "outline"}
                    onClick={() => setMentorshipSupport(o.v)}
                    className="flex-1"
                  >
                    {o.l}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Incubation Support</label>
              <div className="flex gap-2">
                {[{ l: "Yes", v: 1 }, { l: "No", v: 0 }].map((o) => (
                  <Button
                    key={o.l}
                    type="button"
                    variant={incubationSupport === o.v ? "default" : "outline"}
                    onClick={() => setIncubationSupport(o.v)}
                    className="flex-1"
                  >
                    {o.l}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Idea Description
            </label>
            <Textarea
              placeholder="Describe your innovative startup idea in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-border/50 min-h-[150px]"
            />
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full gradient-button text-white font-semibold py-6 text-lg transition-all active:scale-95"
          >
            {isLoading ? "Analyzing Vision..." : "🚀 Analyze My Idea ✨"}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSubmitIdea;
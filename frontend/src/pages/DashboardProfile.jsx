import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/redux/api/userApi";

const DashboardProfile = ({ profileImage, setProfileImage }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {user} = useSelector((state) => state.auth); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar , setAvatar] = useState('')
  const [avatarPreview , setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url :""
  )
  
  const fileInputRef = useRef(null);
  const [updateProfile, {isLoading,error,isSuccess}] = useUpdateProfileMutation();

  useEffect(() => {
    if(user) {
      setName(user.name);
      setEmail(user.email)
      setAvatarPreview(user.avatar || "");
    }

    if(error){
       toast({
       title: "Error",
       description: error?.data?.message || "Something went wrong.",
    });
    }
    if(isSuccess){
       toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    navigate("/dashboard");
    }
  },[user,error,isSuccess])
   
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  }
};

  const handleSave = async (e) => {
  e.preventDefault();

  const userData = {
    name,
    email,
    avatar: avatarPreview, // base64 string
  };

  await updateProfile(userData).unwrap();
};

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Profile Settings
        </h1>

        <p className="text-muted-foreground mb-8">
          Manage your account settings and profile information
        </p>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={user?.avatar?.url}
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Click the camera icon to upload a new photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-background"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full gradient-button text-white font-semibold"
              disabled={isLoading}
            >
             {isLoading? "saving changes":"Save Changes"} 
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;

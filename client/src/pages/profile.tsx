import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user, logout, token } = useAuth();

  // Fetch user progress (for level information)
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/progress'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch('/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    }
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="p-4">
      {/* User profile */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {progressLoading ? (
          <div className="flex items-center">
            <Skeleton className="w-20 h-20 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ) : (
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-neutral-200 overflow-hidden mr-4">
              {/* Placeholder profile image - in a real app, this would be the user's profile picture */}
              <div className="w-full h-full bg-primary-light text-primary flex items-center justify-center text-2xl font-bold">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-neutral-500">{user?.fullName || user?.username}</h2>
              <p className="text-neutral-300">Member since {user?.memberSince ? new Date(user.memberSince).getFullYear() : '2023'}</p>
              <div className="flex items-center mt-1">
                <span className="bg-primary-light text-primary text-xs font-semibold px-2 py-1 rounded-full mr-2">
                  {user?.isPremium ? 'Premium' : 'Standard'}
                </span>
                <span className="bg-neutral-200 text-neutral-400 text-xs font-semibold px-2 py-1 rounded-full">
                  Level {user?.level || 3}
                </span>
              </div>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full border-primary text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-light"
          onClick={() => {
            // In a real app, this would navigate to an edit profile page
            console.log("Edit profile clicked");
          }}
        >
          Edit Profile
        </Button>
      </div>
      
      {/* Account settings */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <h3 className="font-heading font-semibold text-lg p-4 border-b text-neutral-500">Account Settings</h3>
        <div className="divide-y">
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Personal Information</p>
              <p className="text-neutral-300 text-sm">Update your personal details</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Notifications</p>
              <p className="text-neutral-300 text-sm">Configure notification preferences</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Privacy Settings</p>
              <p className="text-neutral-300 text-sm">Manage data and privacy options</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Connected Apps</p>
              <p className="text-neutral-300 text-sm">Manage linked applications</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
        </div>
      </div>
      
      {/* Help & Support */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <h3 className="font-heading font-semibold text-lg p-4 border-b text-neutral-500">Help & Support</h3>
        <div className="divide-y">
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">FAQs</p>
              <p className="text-neutral-300 text-sm">Frequently asked questions</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Contact Support</p>
              <p className="text-neutral-300 text-sm">Get help from our team</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div>
              <p className="font-semibold text-neutral-500">Terms & Conditions</p>
              <p className="text-neutral-300 text-sm">Read our terms and conditions</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-neutral-300" />
          </button>
        </div>
      </div>
      
      <Button
        className="w-full bg-error hover:bg-error/90 text-white font-semibold py-3 px-4 rounded-lg mb-6"
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </div>
  );
}

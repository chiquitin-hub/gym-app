import { useState } from "react";
import { useLocation } from "wouter";
import { BellIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { NotificationsPanel } from "./notifications-panel";

export function AppHeader() {
  const [location] = useLocation();
  const { user, token } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Fetch notifications for the badge indicator
  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    }
  });
  
  // Count unread notifications
  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;
  
  // Get page title based on current location
  const getPageTitle = () => {
    if (location === '/') return 'Dashboard';
    if (location === '/routines') return 'Exercise Routines';
    if (location === '/booking') return 'Book Classes & Trainers';
    if (location === '/profile') return 'Profile';
    return 'GymApp';
  };
  
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-heading font-bold text-xl text-neutral-500">{getPageTitle()}</h1>
          <div className="flex items-center">
            <button 
              className="relative p-2"
              onClick={() => setShowNotifications(true)}
            >
              <BellIcon className="h-6 w-6 text-neutral-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-secondary rounded-full w-2 h-2"></span>
              )}
            </button>
            <button 
              className="ml-2 rounded-full w-10 h-10 bg-neutral-200 overflow-hidden flex items-center justify-center"
              onClick={() => window.location.href = "/profile"}
            >
              {/* Placeholder profile image - in a real app, this would be the user's profile picture */}
              <div className="w-full h-full bg-primary-light text-primary flex items-center justify-center text-lg font-bold">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Notifications panel */}
      <NotificationsPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications || []}
      />
    </>
  );
}

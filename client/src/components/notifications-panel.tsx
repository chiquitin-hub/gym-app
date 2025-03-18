import { useAuth } from "@/hooks/use-auth";
import { X as CloseIcon, Clipboard, Edit, CheckCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export function NotificationsPanel({ open, onClose, notifications }: NotificationsPanelProps) {
  const { token } = useAuth();
  
  if (!open) return null;
  
  const markAsRead = async (id: number) => {
    if (!token) return;
    
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        // Invalidate notifications query to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clipboard className="h-6 w-6 text-primary" />;
      case 'update':
        return <Edit className="h-6 w-6 text-secondary" />;
      case 'confirmation':
        return <CheckCircle className="h-6 w-6 text-success" />;
      default:
        return <Clipboard className="h-6 w-6 text-primary" />;
    }
  };
  
  // Get border color based on notification type
  const getBorderClass = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'border-primary';
      case 'update':
        return 'border-secondary';
      case 'confirmation':
        return 'border-success';
      default:
        return 'border-primary';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
      <div className="mt-auto bg-white rounded-t-xl p-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-neutral-500">Notifications</h3>
          <button className="p-1" onClick={onClose}>
            <CloseIcon className="h-6 w-6 text-neutral-400" />
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-400">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`flex p-3 border-l-4 ${getBorderClass(notification.type)} ${notification.type === 'reminder' ? 'bg-primary-light/10' : notification.type === 'update' ? 'bg-secondary-light/10' : 'bg-success/10'} rounded`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-500">{notification.title}</p>
                  <p className="text-sm text-neutral-400">{notification.message}</p>
                  <p className="text-xs text-neutral-300 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

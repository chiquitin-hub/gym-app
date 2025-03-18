import { useLocation } from "wouter";
import { 
  HomeIcon, 
  PackageIcon, 
  CalendarIcon, 
  UserIcon 
} from "lucide-react";

export function BottomNav() {
  const [location, setLocation] = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-t">
      <div className="flex items-center justify-around">
        <button 
          className={`py-3 px-6 flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-neutral-300'}`}
          onClick={() => setLocation('/')}
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className={`py-3 px-6 flex flex-col items-center ${isActive('/routines') ? 'text-primary' : 'text-neutral-300'}`}
          onClick={() => setLocation('/routines')}
        >
          <PackageIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Routines</span>
        </button>
        <button 
          className={`py-3 px-6 flex flex-col items-center ${isActive('/booking') ? 'text-primary' : 'text-neutral-300'}`}
          onClick={() => setLocation('/booking')}
        >
          <CalendarIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Book</span>
        </button>
        <button 
          className={`py-3 px-6 flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-neutral-300'}`}
          onClick={() => setLocation('/profile')}
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
}

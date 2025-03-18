import { 
  PlayCircleIcon, 
  Dumbbell, 
  TimerIcon, 
  Clock, 
  CloudLightning 
} from "lucide-react";
import { Link } from "wouter";

interface WorkoutCardProps {
  id: number;
  name: string;
  duration: number;
  exerciseCount: number;
  category: string;
}

export function WorkoutCard({ id, name, duration, exerciseCount, category }: WorkoutCardProps) {
  // Return appropriate icon and background color based on category
  const getCategoryInfo = (category: string) => {
    switch (category.toLowerCase()) {
      case 'strength':
        return {
          icon: <Dumbbell className="h-6 w-6 text-primary" />,
          bgColor: 'bg-primary-light'
        };
      case 'cardio':
        return {
          icon: <Clock className="h-6 w-6 text-secondary" />,
          bgColor: 'bg-secondary-light'
        };
      default:
        return {
          icon: <CloudLightning className="h-6 w-6 text-neutral-300" />,
          bgColor: 'bg-neutral-200'
        };
    }
  };
  
  const { icon, bgColor } = getCategoryInfo(category);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center">
        <div className={`${bgColor} rounded-lg w-12 h-12 flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-neutral-500">{name}</h3>
          <p className="text-neutral-300 text-sm">{duration} min · {exerciseCount} exercises</p>
        </div>
        <Link href={`/routines/${id}`}>
          <button className="bg-primary text-white rounded-full p-2">
            <PlayCircleIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

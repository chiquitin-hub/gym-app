import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { 
  ClockIcon, 
  UsersIcon, 
  TagIcon,
  ChevronRightIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Routines() {
  const { token } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Fetch all routines
  const { data: routines, isLoading } = useQuery({
    queryKey: ['/api/routines'],
    retry: false
  });
  
  // Filter routines based on category
  const filteredRoutines = activeFilter === "all" 
    ? routines 
    : routines?.filter((routine: any) => 
        routine.category.toLowerCase() === activeFilter.toLowerCase()
      );
  
  return (
    <div className="p-4">
      <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-500">Exercise Routines</h2>
      
      {/* Filter options */}
      <div className="flex overflow-x-auto pb-2 mb-4 -mx-1">
        <button 
          className={`whitespace-nowrap px-4 py-2 ${activeFilter === "all" ? "bg-primary text-white" : "bg-white text-neutral-400"} rounded-full text-sm font-semibold mx-1`}
          onClick={() => setActiveFilter("all")}
        >
          All Routines
        </button>
        <button 
          className={`whitespace-nowrap px-4 py-2 ${activeFilter === "strength" ? "bg-primary text-white" : "bg-white text-neutral-400"} rounded-full text-sm font-semibold mx-1`}
          onClick={() => setActiveFilter("strength")}
        >
          Strength
        </button>
        <button 
          className={`whitespace-nowrap px-4 py-2 ${activeFilter === "cardio" ? "bg-primary text-white" : "bg-white text-neutral-400"} rounded-full text-sm font-semibold mx-1`}
          onClick={() => setActiveFilter("cardio")}
        >
          Cardio
        </button>
        <button 
          className={`whitespace-nowrap px-4 py-2 ${activeFilter === "flexibility" ? "bg-primary text-white" : "bg-white text-neutral-400"} rounded-full text-sm font-semibold mx-1`}
          onClick={() => setActiveFilter("flexibility")}
        >
          Flexibility
        </button>
        <button 
          className={`whitespace-nowrap px-4 py-2 ${activeFilter === "recovery" ? "bg-primary text-white" : "bg-white text-neutral-400"} rounded-full text-sm font-semibold mx-1`}
          onClick={() => setActiveFilter("recovery")}
        >
          Recovery
        </button>
      </div>
      
      {/* Exercise routine cards */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </>
        ) : filteredRoutines && filteredRoutines.length > 0 ? (
          filteredRoutines.map((routine: any) => (
            <div key={routine.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-40 bg-neutral-200 relative">
                {routine.imageUrl && (
                  <img 
                    src={routine.imageUrl} 
                    alt={routine.name} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="font-heading font-semibold text-white text-lg">{routine.name}</h3>
                  <p className="text-white/80 text-sm">{routine.description}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-neutral-300 mr-1" />
                    <span className="text-sm text-neutral-400">{routine.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-neutral-300 mr-1" />
                    <span className="text-sm text-neutral-400">{routine.difficulty}</span>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-neutral-300 mr-1" />
                    <span className="text-sm text-neutral-400">{routine.category}</span>
                  </div>
                </div>
                
                {/* Exercises list - would be populated from backend data */}
                <div className="mb-4">
                  <h4 className="font-semibold text-neutral-400 mb-2 text-sm">Exercises</h4>
                  <ul className="text-sm text-neutral-400 space-y-2">
                    <li className="flex items-center">
                      <span className="w-4 h-4 inline-flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">1</span>
                      Bench Press - 3 sets x 12 reps
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 inline-flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">2</span>
                      Shoulder Press - 3 sets x 10 reps
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 inline-flex items-center justify-center bg-primary text-white rounded-full text-xs mr-2">3</span>
                      Tricep Extensions - 3 sets x 15 reps
                    </li>
                    <li className="text-primary font-semibold">+ 5 more exercises</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-150"
                  onClick={async () => {
                    // In a real app, this would start the workout and track progress
                    console.log(`Starting workout: ${routine.name}`);
                  }}
                >
                  Start Workout
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-neutral-400">No routines found for this category</p>
            <Button 
              className="mt-4 bg-primary text-white"
              onClick={() => setActiveFilter("all")}
            >
              View all routines
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

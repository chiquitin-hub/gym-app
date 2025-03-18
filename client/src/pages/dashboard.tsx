import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutCard } from "@/components/workout-card";
import { ProgressRing } from "@/components/progress-ring";
import { 
  CalendarIcon, 
  ChevronRightIcon,
  TimerIcon,
  UsersIcon
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { token } = useAuth();
  
  // Fetch routines
  const { data: routines, isLoading: routinesLoading } = useQuery({
    queryKey: ['/api/routines'],
    retry: false
  });
  
  // Fetch upcoming bookings (requires auth)
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    }
  });
  
  // Fetch user progress (requires auth)
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
  
  // Fetch nutrition data (requires auth)
  const { data: nutrition, isLoading: nutritionLoading } = useQuery({
    queryKey: ['/api/nutrition'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch('/api/nutrition', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch nutrition data');
      return res.json();
    }
  });
  
  // Format date for upcoming classes display
  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    return { day, dayOfMonth };
  };
  
  // Format time for classes display
  const formatClassTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startTime = startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const endTime = endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${startTime} - ${endTime}`;
  };
  
  return (
    <div className="p-4">
      {/* Today's stats */}
      <section className="mb-6">
        <h2 className="font-heading font-semibold text-lg mb-3 text-neutral-500">Today's Activity</h2>
        {bookingsLoading ? (
          <Skeleton className="h-24 w-full rounded-lg" />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div className="flex-1">
              <p className="text-neutral-300 text-sm">Next workout</p>
              <p className="font-heading font-semibold text-neutral-500">
                {bookings && bookings.length > 0 
                  ? bookings[0].class.name 
                  : "No upcoming workouts"}
              </p>
              <p className="text-primary text-sm font-semibold">
                {bookings && bookings.length > 0 
                  ? new Date(bookings[0].class.startTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })
                  : "Schedule a workout"}
              </p>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <ProgressRing value={80} size={64} strokeWidth={3} />
            </div>
          </div>
        )}
      </section>

      {/* Progress tracking */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-neutral-500">Your Progress</h2>
          <Link href="/progress" className="text-primary text-sm font-semibold">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {progressLoading ? (
            <>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </>
          ) : (
            <>
              {/* Weight */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-300 text-xs">Weight</span>
                  <span className="text-success text-xs">+2.3%</span>
                </div>
                <div className="flex items-end">
                  <span className="font-mono font-semibold text-2xl text-neutral-500">
                    {progress && progress.length > 0 ? progress[0].weight : 72}
                  </span>
                  <span className="font-mono text-neutral-300 text-sm ml-1">kg</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              {/* Body Fat */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-300 text-xs">Body Fat</span>
                  <span className="text-success text-xs">-1.5%</span>
                </div>
                <div className="flex items-end">
                  <span className="font-mono font-semibold text-2xl text-neutral-500">
                    {progress && progress.length > 0 ? progress[0].bodyFat : 18}
                  </span>
                  <span className="font-mono text-neutral-300 text-sm ml-1">%</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              {/* Classes */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-300 text-xs">Classes</span>
                  <span className="text-success text-xs">+3</span>
                </div>
                <div className="flex items-end">
                  <span className="font-mono font-semibold text-2xl text-neutral-500">
                    {progress && progress.length > 0 ? progress[0].classesAttended : 12}
                  </span>
                  <span className="font-mono text-neutral-300 text-sm ml-1">this month</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              {/* Calories */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-300 text-xs">Calories</span>
                  <span className="text-warning text-xs">-5%</span>
                </div>
                <div className="flex items-end">
                  <span className="font-mono font-semibold text-2xl text-neutral-500">
                    {progress && progress.length > 0 ? progress[0].calories : 1850}
                  </span>
                  <span className="font-mono text-neutral-300 text-sm ml-1">kcal</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="bg-warning h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Exercise routines */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-neutral-500">Your Routines</h2>
          <Link href="/routines" className="text-primary text-sm font-semibold">View All</Link>
        </div>
        <div className="space-y-4">
          {routinesLoading ? (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          ) : (
            routines && routines.slice(0, 3).map((routine: any) => (
              <WorkoutCard 
                key={routine.id}
                id={routine.id}
                name={routine.name}
                duration={routine.duration}
                exerciseCount={8} // This would typically come from the backend
                category={routine.category}
              />
            ))
          )}
        </div>
      </section>

      {/* Upcoming classes */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-neutral-500">Upcoming Classes</h2>
          <Link href="/booking" className="text-primary text-sm font-semibold">Book More</Link>
        </div>
        <div className="space-y-4">
          {bookingsLoading ? (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          ) : bookings && bookings.length > 0 ? (
            bookings.map((booking: any) => {
              const { day, dayOfMonth } = formatBookingDate(booking.class.startTime);
              return (
                <div className="bg-white rounded-lg shadow-sm p-4" key={booking.id}>
                  <div className="flex items-center">
                    <div className="w-12 text-center mr-4">
                      <p className="text-xs text-neutral-300 uppercase">{day}</p>
                      <p className="font-mono font-semibold text-lg text-primary">{dayOfMonth}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-neutral-500">{booking.class.name}</h3>
                      <p className="text-neutral-300 text-sm">
                        {formatClassTime(booking.class.startTime, booking.class.endTime)} · {booking.class.location}
                      </p>
                    </div>
                    <button 
                      className="text-error text-sm font-semibold"
                      onClick={async () => {
                        // Cancel booking
                        if (token) {
                          try {
                            const res = await fetch(`/api/bookings/${booking.id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            });
                            
                            if (res.ok) {
                              // Refresh bookings data
                              // This would be handled by TanStack Query in a complete implementation
                            }
                          } catch (error) {
                            console.error("Failed to cancel booking:", error);
                          }
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <p className="text-neutral-400">No upcoming classes</p>
              <Link href="/booking" className="text-primary font-semibold block mt-2">
                Book a class
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Nutrition Plan */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-neutral-500">Today's Nutrition</h2>
          <Link href="/nutrition" className="text-primary text-sm font-semibold">Full Plan</Link>
        </div>
        {nutritionLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-primary relative mb-1">
                  <ProgressRing 
                    value={nutrition ? nutrition.proteinPercentage : 75} 
                    size={48} 
                    strokeWidth={3} 
                    color="white" 
                    backgroundColor="rgba(255,255,255,0.2)" 
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-mono font-semibold text-xs">
                    {nutrition ? nutrition.proteinPercentage : 75}%
                  </span>
                </div>
                <span className="text-xs text-neutral-300">Protein</span>
              </div>
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-secondary relative mb-1">
                  <ProgressRing 
                    value={nutrition ? nutrition.carbsPercentage : 60} 
                    size={48} 
                    strokeWidth={3} 
                    color="white" 
                    backgroundColor="rgba(255,255,255,0.2)" 
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-mono font-semibold text-xs">
                    {nutrition ? nutrition.carbsPercentage : 60}%
                  </span>
                </div>
                <span className="text-xs text-neutral-300">Carbs</span>
              </div>
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-warning relative mb-1">
                  <ProgressRing 
                    value={nutrition ? nutrition.fatsPercentage : 40} 
                    size={48} 
                    strokeWidth={3} 
                    color="white" 
                    backgroundColor="rgba(255,255,255,0.2)" 
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-mono font-semibold text-xs">
                    {nutrition ? nutrition.fatsPercentage : 40}%
                  </span>
                </div>
                <span className="text-xs text-neutral-300">Fats</span>
              </div>
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-success relative mb-1">
                  <ProgressRing 
                    value={85} 
                    size={48} 
                    strokeWidth={3} 
                    color="white" 
                    backgroundColor="rgba(255,255,255,0.2)" 
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-mono font-semibold text-xs">
                    85%
                  </span>
                </div>
                <span className="text-xs text-neutral-300">Water</span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-mono font-semibold text-xl text-neutral-500">
                1,250 <span className="text-neutral-300 text-sm">/ {nutrition ? nutrition.dailyCalories : 2100} kcal</span>
              </p>
              <p className="text-sm text-neutral-300">Daily calorie intake</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

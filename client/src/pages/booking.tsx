import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays, isSameDay } from "date-fns";

export default function Booking() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Helper function to generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -3; i < 18; i++) {
      days.push(addDays(today, i));
    }
    return days;
  };
  
  // Calendar days
  const calendarDays = generateCalendarDays();
  
  // Fetch classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    retry: false
  });
  
  // Filter classes by selected date
  const classesForSelectedDate = classes?.filter((classItem: any) => {
    const classDate = new Date(classItem.startTime);
    return isSameDay(classDate, selectedDate);
  });
  
  // Fetch trainers
  const { data: trainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['/api/trainers'],
    retry: false
  });
  
  // Fetch user's bookings
  const { data: bookings } = useQuery({
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
  
  // Determine if a class is already booked
  const isClassBooked = (classId: number) => {
    if (!bookings) return false;
    return bookings.some((booking: any) => booking.classId === classId);
  };
  
  // Book class mutation
  const bookClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ classId })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to book class');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Class booked!',
        description: 'Your class has been successfully booked.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Navigate to previous month
  const prevMonth = () => {
    // This would typically navigate to previous month
    // For this demo, we'll just leave it as a placeholder
  };
  
  // Navigate to next month
  const nextMonth = () => {
    // This would typically navigate to next month
    // For this demo, we'll just leave it as a placeholder
  };
  
  // Format class time
  const formatClassTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startTime = format(startDate, 'h:mm a');
    const endTime = format(endDate, 'h:mm a');
    
    return `${startTime} - ${endTime}`;
  };
  
  return (
    <div className="p-4">
      <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-500">Book Classes & Trainers</h2>
      
      {/* Calendar view */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1" onClick={prevMonth}>
            <ChevronLeftIcon className="h-5 w-5 text-neutral-400" />
          </button>
          <h3 className="font-heading font-semibold text-neutral-500">
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <button className="p-1" onClick={nextMonth}>
            <ChevronRightIcon className="h-5 w-5 text-neutral-400" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          <span className="text-xs text-neutral-300">S</span>
          <span className="text-xs text-neutral-300">M</span>
          <span className="text-xs text-neutral-300">T</span>
          <span className="text-xs text-neutral-300">W</span>
          <span className="text-xs text-neutral-300">T</span>
          <span className="text-xs text-neutral-300">F</span>
          <span className="text-xs text-neutral-300">S</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            const hasEvents = classes?.some((classItem: any) => {
              const classDate = new Date(classItem.startTime);
              return isSameDay(classDate, day);
            });
            
            return (
              <button 
                key={index}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm mx-auto relative
                  ${isSelected ? 'bg-primary text-white font-semibold' : ''}
                  ${hasEvents && !isSelected ? 'bg-primary-light text-primary' : ''}
                `}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, 'd')}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Available classes */}
      <div className="mb-6">
        <h3 className="font-heading font-semibold text-lg mb-3 text-neutral-500">Available Classes</h3>
        <div className="space-y-4">
          {classesLoading ? (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          ) : classesForSelectedDate && classesForSelectedDate.length > 0 ? (
            classesForSelectedDate.map((classItem: any) => {
              const alreadyBooked = isClassBooked(classItem.id);
              const isFull = classItem.spotsLeft === 0;
              
              return (
                <div className="bg-white rounded-lg shadow-sm p-4" key={classItem.id}>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-neutral-500">{classItem.name}</h4>
                      <p className="text-neutral-300 text-sm mb-2">
                        {formatClassTime(classItem.startTime, classItem.endTime)} · {classItem.location}
                      </p>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 overflow-hidden mr-2">
                          {/* Would be replaced with actual instructor image */}
                          <div className="w-full h-full bg-primary-light"></div>
                        </div>
                        <span className="text-xs text-neutral-400">{classItem.instructor}</span>
                        <span className="mx-2 text-neutral-300">•</span>
                        <span className="text-xs text-neutral-400">
                          {isFull ? (
                            <span className="text-error">Class full</span>
                          ) : (
                            `${classItem.spotsLeft} spots left`
                          )}
                        </span>
                      </div>
                    </div>
                    {alreadyBooked ? (
                      <Button 
                        variant="outline"
                        className="text-primary border-primary font-semibold"
                        disabled
                      >
                        Booked
                      </Button>
                    ) : isFull ? (
                      <Button
                        variant="outline"
                        className="text-neutral-400 border-neutral-200"
                        disabled
                      >
                        Full
                      </Button>
                    ) : (
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-white font-semibold"
                        onClick={() => bookClassMutation.mutate(classItem.id)}
                        disabled={bookClassMutation.isPending}
                      >
                        {bookClassMutation.isPending ? "Booking..." : "Book"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-neutral-400">No classes available on this date</p>
              <p className="text-sm text-neutral-300 mt-2">Try selecting a different date</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Available trainers */}
      <div>
        <h3 className="font-heading font-semibold text-lg mb-3 text-neutral-500">Personal Trainers</h3>
        <div className="grid grid-cols-2 gap-4">
          {trainersLoading ? (
            <>
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </>
          ) : trainers && trainers.length > 0 ? (
            trainers.map((trainer: any) => (
              <div className="bg-white rounded-lg shadow-sm p-4" key={trainer.id}>
                <div className="mb-3 relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200 overflow-hidden mb-2">
                    {trainer.imageUrl && (
                      <img 
                        src={trainer.imageUrl} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h4 className="font-heading font-semibold text-neutral-500 text-center">{trainer.name}</h4>
                  <p className="text-neutral-300 text-xs text-center">{trainer.specialty}</p>
                  {trainer.isAvailable && (
                    <div className="absolute top-0 right-2 bg-success text-white text-xs px-2 py-1 rounded-full">Available</div>
                  )}
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150"
                  disabled={!trainer.isAvailable}
                  onClick={() => {
                    // In a real app, this would open a booking modal for the trainer
                    toast({
                      title: 'Training session request sent',
                      description: `Your request to book ${trainer.name} has been sent.`
                    });
                  }}
                >
                  {trainer.isAvailable ? "Book Session" : "Not Available"}
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-neutral-400">No trainers available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

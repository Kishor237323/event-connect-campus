import { useState, useEffect } from "react";
import { Users, RefreshCw } from "lucide-react";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";

interface EventRegistrationCountProps {
  eventId: string;
  collegeId?: string;
  showRefresh?: boolean;
}

export function EventRegistrationCount({ 
  eventId, 
  collegeId, 
  showRefresh = false 
}: EventRegistrationCountProps) {
  const { getRegistrationCount, isLoading } = useEventRegistrations();
  const [count, setCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchCount = async () => {
    const result = await getRegistrationCount(eventId, collegeId);
    if (result) {
      setCount(result.registration_count);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchCount();
  }, [eventId, collegeId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [eventId, collegeId]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="mr-2 h-4 w-4" />
        <span>
          Registered: {isLoading ? "..." : count}
        </span>
      </div>
      {showRefresh && (
        <button
          onClick={fetchCount}
          disabled={isLoading}
          className="ml-2 p-1 hover:bg-muted rounded"
          title="Refresh registration count"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreateEventRequest } from "@/types";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventRequest) => Promise<void>;
  isLoading?: boolean;
  initialCollegeId?: string;
}

const eventTypes = [
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "social", label: "Social" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" }
];

const eventCategories = [
  { value: "academic", label: "Academic" },
  { value: "cultural", label: "Cultural" },
  { value: "professional", label: "Professional" },
  { value: "sports", label: "Sports" },
  { value: "social", label: "Social" }
];

const colleges = [
  { id: "college-1", name: "University of Technology" },
  { id: "college-2", name: "State University" },
  { id: "college-3", name: "Community College" }
];

export function CreateEventModal({ isOpen, onClose, onSubmit, isLoading = false, initialCollegeId }: CreateEventModalProps) {
  const [selectedCollege, setSelectedCollege] = useState<string>(initialCollegeId || "college-1");
  const [formData, setFormData] = useState<CreateEventRequest>({
    title: "",
    description: "",
    event_type: "workshop",
    category: "academic",
    start_date: "",
    end_date: "",
    location: "",
    capacity: 100,
    college_id: initialCollegeId || "college-1"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleInputChange = (field: keyof CreateEventRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleDateChange = (field: 'start_date' | 'end_date', date: Date | undefined) => {
    if (date) {
      const isoString = date.toISOString();
      setFormData(prev => ({
        ...prev,
        [field]: isoString
      }));
      
      if (field === 'start_date') {
        setStartDate(date);
        // Set end date to start date if it's before start date
        if (endDate && endDate < date) {
          setEndDate(date);
          setFormData(prev => ({
            ...prev,
            end_date: isoString
          }));
        }
      } else {
        setEndDate(date);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    if (formData.capacity > 10000) {
      newErrors.capacity = "Capacity cannot exceed 10,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ ...formData, college_id: selectedCollege });
      handleClose();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      event_type: "workshop",
      category: "academic",
      start_date: "",
      end_date: "",
      location: "",
      capacity: 100,
      college_id: "college-1"
    });
    setSelectedCollege("college-1");
    setStartDate(undefined);
    setEndDate(undefined);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new campus event. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter event title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <Label htmlFor="event_type">Event Type *</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => handleInputChange("event_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Category */}
            <div>
              <Label htmlFor="category">Event Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* College */}
            <div>
              <Label htmlFor="college">College *</Label>
              <Select
                value={selectedCollege}
                onValueChange={setSelectedCollege}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10000"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                placeholder="Enter capacity"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && (
                <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.start_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange("start_date", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.start_date && (
                <p className="text-sm text-red-500 mt-1">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.end_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange("end_date", date)}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.end_date && (
                <p className="text-sm text-red-500 mt-1">{errors.end_date}</p>
              )}
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter event location"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter event description (optional)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary shadow-glow"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

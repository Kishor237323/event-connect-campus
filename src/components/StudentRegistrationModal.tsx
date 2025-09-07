import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, Mail, IdCard } from "lucide-react";

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentRegistrationData) => Promise<void>;
  eventTitle: string;
  isLoading?: boolean;
}

export interface StudentRegistrationData {
  name: string;
  srn: string;
  phone: string;
  email: string;
  event_id: string;
  college_id: string;
}

export function StudentRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  eventTitle,
  isLoading = false
}: StudentRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    srn: "",
    phone: "",
    email: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // SRN validation
    if (!formData.srn.trim()) {
      newErrors.srn = "SRN is required";
    } else if (formData.srn.trim().length < 3) {
      newErrors.srn = "SRN must be at least 3 characters";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
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
      const selectedCollegeId = localStorage.getItem('selectedCollegeId') || '';
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        srn: formData.srn.trim().toUpperCase(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        event_id: '', // Will be set by parent component
        college_id: selectedCollegeId
      });
      
      // Reset form on successful submission
      setFormData({ name: "", srn: "", phone: "", email: "" });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    setFormData({ name: "", srn: "", phone: "", email: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Register for Event
          </DialogTitle>
          <DialogDescription>
            Register for <span className="font-semibold">{eventTitle}</span>. 
            Please fill in all your details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="srn" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Student Registration Number (SRN) *
            </Label>
            <Input
              id="srn"
              type="text"
              placeholder="Enter your SRN"
              value={formData.srn}
              onChange={(e) => handleInputChange("srn", e.target.value.toUpperCase())}
              className={errors.srn ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.srn && (
              <p className="text-sm text-red-500">{errors.srn}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={errors.phone ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
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
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

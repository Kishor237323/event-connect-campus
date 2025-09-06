import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CollegeNameModalProps {
  isOpen: boolean;
  onSubmit: (collegeName: string) => void;
}

export function CollegeNameModal({ isOpen, onSubmit }: CollegeNameModalProps) {
  const [collegeName, setCollegeName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collegeName.trim()) {
      onSubmit(collegeName.trim());
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Your College Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="College Name"
            value={collegeName}
            onChange={e => setCollegeName(e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="submit" className="w-full">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

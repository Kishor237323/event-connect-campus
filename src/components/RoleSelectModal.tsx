import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RoleSelectModalProps {
  isOpen: boolean;
  onSelect: (role: "admin" | "student") => void;
}

export function RoleSelectModal({ isOpen, onSelect }: RoleSelectModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your role</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button className="w-full" onClick={() => onSelect("admin")}>Admin</Button>
          <Button className="w-full" onClick={() => onSelect("student")}>Student</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

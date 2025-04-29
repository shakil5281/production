"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"; // if you're using Sonner for toast notifications
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: any;
  onDeleted?: () => void; // optional callback after successful delete
}

export const DeleteDialog = ({ open, setOpen, payment, onDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/production-order/${payment.id}`);
      toast.success("Deleted successfully");
      setOpen(false);
      onDeleted?.(); // callback to refresh data or notify parent
      router.refresh(); 
    } catch (error) {
      toast.error("Failed to delete");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{payment.programCode}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

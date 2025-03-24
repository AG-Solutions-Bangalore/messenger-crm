import React, { useState } from "react";
import axios from "axios";
import { Check, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import BASE_URL from "@/config/BaseUrl";

const StatusChangePopover = ({ enquiryId, onStatusUpdate }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleStatusChange = async () => {
    if (!status) {
      setError("Please select a status");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/panel-update-enquiry-status/${enquiryId}`,
        { 
          enquiry_company_status: status 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        if (onStatusUpdate) onStatusUpdate();
      }, 200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Change status</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change Status</p>
          </TooltipContent>
        </Tooltip>
        
        <PopoverContent className="w-56 p-3" align="end">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Change Status</h4>
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancel">Cancel</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
            
            {error && (
              <p className="text-destructive text-xs">{error}</p>
            )}
            
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleStatusChange}
                disabled={isSubmitting || success}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Updating
                  </>
                ) : success ? (
                  <>
                    <Check className="mr-2 h-3 w-3" />
                    Updated
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default StatusChangePopover;
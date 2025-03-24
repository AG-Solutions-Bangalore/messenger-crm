import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import moment from "moment";

const FollowupDialog = ({ open, onOpenChange, followupId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const { toast } = useToast();

  // Fetch company status for dropdown
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["companyStatus"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-company-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.companyStatus;
    },
  });

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-followup/${followupId}`,
        {
          data_status: selectedStatus,
          followup_date: selectedDate ? selectedDate : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code === 200) {
        toast({
          title: "Success",
          description: "Follow-up updated successfully",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg || "Failed to update follow-up",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update follow-up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form on open/close
  React.useEffect(() => {
    if (open) {
      setSelectedStatus("");
      setSelectedDate("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Follow-up</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusData?.map((status) => (
                  <SelectItem key={status.id} value={status.companyStatus}>
                    {status.companyStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followup_date">Follow-up Date</Label>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                id="followup_date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-yellow-500 text-black hover:bg-yellow-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Follow-up"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowupDialog;
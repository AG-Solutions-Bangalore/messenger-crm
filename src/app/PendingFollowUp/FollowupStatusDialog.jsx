import useApiToken from "@/components/common/UseToken";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const FollowupStatusDialog = ({
  open,
  onOpenChange,
  followupId,
  onSuccess,
  currentStatus,
}) => {
  const token = useApiToken();
  const { toast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { data: statusData } = useQuery({
    queryKey: ["companyStatus"],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/api/panel-fetch-company-status`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data.companyStatus;
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
    }
  }, [open, currentStatus]);
  const handleSubmit = async (value) => {
    if (!followupId) return;
    console.log(value, "value");

    setIsLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-followup/${followupId}`,
        { data_status: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res?.data?.code === 200) {
        toast({
          title: "Success",
          description: res.data.msg || "Follow-up updated",
        });
        onSuccess();
        onOpenChange(false);
        setSelectedStatus("");
      } else {
        throw new Error(res?.data?.msg);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Update failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isLoading && onOpenChange(v)}>
      <DialogContent
        className="max-w-[280px] sm:max-w-md p-4 overflow-visible"
        aria-describedby={undefined}
      >
        <div className="grid gap-2">
          <Label className="text-xs">
            Status <span className="text-red-500">*</span>
          </Label>

          <Select
            key={followupId}
            value={selectedStatus}
            disabled={isLoading}
            onValueChange={(value) => {
              if (value === selectedStatus) return;
              setSelectedStatus(value);
              handleSubmit(value);
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent position="popper">
              {statusData?.map((status) => (
                <SelectItem key={status.id} value={status.companyStatus}>
                  {status.companyStatus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowupStatusDialog;

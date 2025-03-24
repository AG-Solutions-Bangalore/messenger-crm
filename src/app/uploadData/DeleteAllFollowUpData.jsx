import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";

const DeleteAllFollowUpData = ({
  open,
  onOpenChange,
  onSuccess,
  followupdeleteId,
  formData,
  setFormData,
  handleStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["companyStatus"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-company-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.companyStatus;
    },
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication failed. Please log in again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/panel-delete-upload-data-all`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.code === 200) {
        toast({
          title: "Success",
          description: response?.data?.msg || "Deleted successfully!",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: response?.data?.msg || "Failed to delete follow-up.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        This action cannot be undone. This will permanently delete the selected
        company status.{" "}
        <div className="space-y-3">
          <div>
            <label htmlFor="data_created" className="text-right">
              Date
            </label>
            <Input
              type="date"
              id="data_created"
              name="data_created"
              value={formData.data_created}
              onChange={handleStatusChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.data_status} onValueChange={setFormData}>
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
                Deleteting...
              </>
            ) : (
              "Delete Follow-up"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllFollowUpData;

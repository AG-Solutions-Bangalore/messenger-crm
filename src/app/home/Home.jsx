import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Page from '../dashboard/page';

const BASE_URL = 'http://agsdemo.in/emapi/public';

const Home = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <div className="flex justify-center items-center h-screen">
          <Card className="w-full max-w-sm shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-destructive mb-4">Failed to load dashboard data</p>
              <div className="flex justify-center">
                <Button onClick={() => refetch()} size="sm" variant="outline" className="text-xs">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  const metrics = [
    { title: "Enquiry Pending", value: data.enquiry_pending_count },
    { title: "Enquiry Cancel", value: data.enquiry_cancel_count },
    { title: "Enquiry User", value: data.enquiry_user_count },
    { title: "DataUpload Pending", value: data.DataUpload_pending_count },
    { title: "DataUpload Completed", value: data.DataUpload_completed_count },
    { title: "DataUpload Other", value: data.DataUpload_other_count },
  ];

  return (
    <Page>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-3 p-4">
        {metrics.map((metric, index) => (
          <DashboardCard key={index} {...metric} />
        ))}
      </div>
    </Page>
  );
};

const DashboardCard = ({ title, value }) => (
  <Card className="bg-white shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
    <CardContent className="p-4">
      <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </CardContent>
  </Card>
);

export default Home;
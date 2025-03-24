import Page from "@/app/dashboard/page";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import StatusChangePopover from "../statusChangeToggle/StatusChangePopover";


const PendingList = () => {
  const {
    data: enquiries,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-enquiry-list-pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.enquiry;
    },
  });

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
 
  // Define columns for the table
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "enquiry_company_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("enquiry_company_name")}</div>,
    },
    {
      accessorKey: "enquiry_company_type",
      header: "Company Type",
      cell: ({ row }) => <div>{row.getValue("enquiry_company_type")}</div>,
    },
    {
      accessorKey: "enquiry_company_mobile",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("enquiry_company_mobile")}</div>,
    },
    {
      accessorKey: "enquiry_company_email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("enquiry_company_email")}</div>,
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const pendingId = row.original.id;

        return (
          <div className="flex flex-row">
            <StatusChangePopover 
              enquiryId={pendingId} 
              onStatusUpdate={() => refetch()}
            />
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: enquiries || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Render loading state
  if (isLoading) {
    return (
     <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Pending Data
          </Button>
        </div>
        </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Pending Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
        </Page>
    );
  }
  
  return (
   <Page>
      <div className="w-full p-4">
         <div className="flex text-left text-2xl text-gray-800 font-[400]">
           Pending List
         </div>
   
         {/* searching and column filter  */}
         <div className="flex items-center py-4">
           <div className="relative w-72">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
             <Input
               placeholder="Search pending..."
               value={table.getState().globalFilter || ""}
               onChange={(event) => table.setGlobalFilter(event.target.value)}
               className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
             />
           </div>
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" className="ml-auto ">
                 Columns <ChevronDown className="ml-2 h-4 w-4" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
               {table
                 .getAllColumns()
                 .filter((column) => column.getCanHide())
                 .map((column) => {
                   return (
                     <DropdownMenuCheckboxItem
                       key={column.id}
                       className="capitalize"
                       checked={column.getIsVisible()}
                       onCheckedChange={(value) =>
                         column.toggleVisibility(!!value)
                       }
                     >
                       {column.id}
                     </DropdownMenuCheckboxItem>
                   );
                 })}
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
         
         {/* table  */}
         <div className="rounded-md border">
           <Table>
             <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => (
                 <TableRow key={headerGroup.id}>
                   {headerGroup.headers.map((header) => {
                     return (
                       <TableHead
                         key={header.id}
                         className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                       >
                         {header.isPlaceholder
                           ? null
                           : flexRender(
                               header.column.columnDef.header,
                               header.getContext()
                             )}
                       </TableHead>
                     );
                   })}
                 </TableRow>
               ))}
             </TableHeader>
             <TableBody>
               {table.getRowModel().rows?.length ? (
                 table.getRowModel().rows.map((row) => (
                   <TableRow
                     key={row.id}
                     data-state={row.getIsSelected() && "selected"}
                   >
                     {row.getVisibleCells().map((cell) => (
                       <TableCell key={cell.id}>
                         {flexRender(
                           cell.column.columnDef.cell,
                           cell.getContext()
                         )}
                       </TableCell>
                     ))}
                   </TableRow>
                 ))
               ) : (
                 <TableRow>
                   <TableCell
                     colSpan={columns.length}
                     className="h-24 text-center"
                   >
                     No results.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </div>
         
         {/* row selection and pagination button  */}
         <div className="flex items-center justify-end space-x-2 py-4">
           <div className="flex-1 text-sm text-muted-foreground">
             Total Pending : &nbsp;
             {table.getFilteredRowModel().rows.length}
           </div>
           <div className="space-x-2">
             <Button
               variant="outline"
               size="sm"
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
             >
               Previous
             </Button>
             <Button
               variant="outline"
               size="sm"
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
             >
               Next
             </Button>
           </div>
         </div>
       </div>
   </Page>
  );
};

export default PendingList;
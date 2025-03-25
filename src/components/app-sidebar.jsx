import * as React from "react";
import {
  AudioWaveform,
  BadgeIndianRupee,
  Blocks,
  Command,
  File,
  FileDown,
  Frame,
  GalleryVerticalEnd,
  Map,
  NotebookText,
  Package,
  ReceiptText,
  Settings,
  Settings2,
  ShoppingBag,
  TicketPlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMainUser } from "./nav-main-user";

export function AppSidebar({ ...props }) {
  const nameL = localStorage.getItem("name");
  const emailL = localStorage.getItem("email");

  const initialData = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: `Messenger`,
        logo: GalleryVerticalEnd,
        plan: "",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/home",
        icon: Frame,
        isActive: false,
      },
      {
        title: "Enquiry",
        url: "#",
        isActive: false,
        icon: Settings2,
        items: [
          {
            title: "Pending",
            url: "/enquiry/pending",
          },
          {
            title: "Cancel",
            url: "/enquiry/cancel",
          },
          {
            title: "User",
            url: "/enquiry/user",
          },
        ],
      },
      {
        title: "Company List",
        url: "/company-list",
        icon: ShoppingBag,
        isActive: false,
      },
      {
        title: "User List",
        url: "/company-list-user",
        icon: ShoppingBag,
        isActive: false,
      },
      {
        title: "Company Status",
        url: "/company-status",
        icon: Package,
        isActive: false,
      },
      {
        title: "Upload Data",
        url: "/upload-data",
        icon: Package,
        isActive: false,
      },
      {
        title: "Download",
        url: "/download",
        icon: FileDown,
        isActive: false,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        {/* <NavProjects projects={data.projects} /> */}
        <NavMain items={initialData.navMain} />
        <NavMainUser projects={initialData.userManagement} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import {
  CalendarArrowDown,
  CalendarArrowUp,
  House,
  Users,
  Video,
} from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: "/icons/Home.svg",
    route: "/",
    label: "Home",
    icon: <House />,
  },

  {
    imgURL: "/icons/upcoming.svg",
    route: "/upcoming",
    label: "Upcoming",
    icon: <CalendarArrowUp />,
  },
  {
    imgURL: "/icons/previous.svg",
    route: "/previous",
    label: "Previous",
    icon: <CalendarArrowDown />,
  },
  {
    imgURL: "/icons/Video.svg",
    route: "/recordings",
    label: "Recordings",
    icon: <Video />,
  },
  {
    imgURL: "/icons/add-personal.svg",
    route: "/personal-room",
    label: "Personal Room",
    icon: <Users />,
  },
];

export const avatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
];

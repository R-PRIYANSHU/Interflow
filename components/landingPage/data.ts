type Action = {
  href: string;
  label: string;
  variant:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null;
};
export const ACTIONS: Action[] = [
  {
    label: "See Features",
    href: "#features",
    variant: "outline",
  },
{
    label: "Get Started",
    href: "#",
    variant: "default",
  },
];

export const PEOPLE = [
  {
    id: "135950363",
    name: "Karan",
    designation: "PhantomInTheWire",
  },
  {
    id: "47332922",
    name: "Ishu",
    designation: "ishu-codes",
  },
  {
    id: "146630018",
    name: "Priyanshu",
    designation: "R-Priyanshu",
  },
  {
    id: "153438162",
    name: "Pranav",
    designation: "Pranav",
  },
  {
    id: "153438162",
    name: "Meghna",
    designation: "Meghna",
  },
];

export const UNIVERSITIES = [
  "Michigan State University",
  "Massachusetts Institute of Technology",
  "University of Michigan",
  "Princeton University",
  "Stanford University",
  "Harvard University",
  "University of Pennsylvania",
  "University of California",
  "University of Chicago",
];

export const FEATURES = [
  {
    icon: "",
    title: "Video Conferencing",
    desc: "High-quality video and audio for seamless communication.",
  },
  {
    icon: "",
    title: "Real-time Chat",
    desc: "Engage with participants through live chat during video conferences.",
  },
  {
    icon: "",
    title: "Collaborative Whiteboard",
    desc: "Brainstorm and visualize ideas together with screen sharing.",
  },
  {
    icon: "",
    title: "Screen Sharing",
    desc: "Share your screen for presentations and demonstrations.",
  },
  {
    icon: "",
    title: "Meeting Recording",
    desc: "Record meetings for future reference.",
  },
  {
    icon: "",
    title: "Scheduling & Invites",
    desc: "Schedule meetings and send invites easily.",
  },
];

export const STEPS = [
  { img: "", title: "Schedule a Meeting", desc: "Create a meeting and invite participants." },
  { img: "", title: "Join a Meeting", desc: "Join a scheduled meeting as a host or participant." },
  {
    img: "",
    title: "Start Collaborating",
    desc: "Share your screen, chat, and use the collaborative whiteboard.",
  },
];

export const PRICES = [
  {
    title: "Basic",
    price: "0",
    desc: "Perfect for individuals and casual use.",
    features: [
      "Host up to 4 participants",
      "45-minute meeting limit",
      "Screen sharing",
      "Real-time chat",
    ],
 button: "Get Started",
    isPrimary: false,
  },
  {
    title: "Pro",
    price: "99",
    desc: "Ideal for small teams and growing businesses.",
    features: [
      "Host up to 25 participants",
      "Unlimited meeting duration",
      "Screen sharing",
      "Real-time chat",
      "Meeting recording",
      "Collaborative whiteboard",
    ],
    button: "Choose Pro",
    isPrimary: true,
  },
];

export const TESTIMONIALS = [
  {
    avatar:
      "https://example.com/avatar1.png",
    name: "John Doe",
    handle: "johndoe",
    text: "Interflow has revolutionized our team meetings. The whiteboard feature is a game-changer!",
    url: "https://example.com/johndoe",
  },
  {
    avatar:
      "https://example.com/avatar2.png",
    name: "Jane Smith",
    handle: "janesmith",
    text: "The real-time chat and screen sharing features make collaboration a breeze. Highly recommended!",
    url: "https://example.com/janesmith",
  },
  {
    avatar:
      "https://example.com/avatar3.png",
    name: "Peter Jones",
    handle: "peterjones",
    text: "Interflow's meeting recording feature is invaluable for training and knowledge sharing.",
    url: "https://example.com/peterjones",
  },
];

export const FOOTER_LINKS = [
  { title: "Terms & Conditions", href: "./terms-conditions" },
  { title: "Privacy Policy", href: "./privacy-policy" },
  { title: "Contact Us", href: "./contact-us" }
];

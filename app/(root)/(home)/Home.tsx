import React from "react";
import {
  FaVideo,
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaCompactDisc,
  FaDoorOpen,
  FaPlusCircle,
  FaSignInAlt,
  FaCalendarPlus,
  FaPhotoVideo,
  FaBolt,
  FaLink,
  FaClock,
  FaPlayCircle,
} from "react-icons/fa";
// import
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const navLinks = [
  { href: "#home", label: "Home", icon: <FaHome />, active: true },
  { href: "#upcoming", label: "Upcoming", icon: <FaCalendarAlt /> },
  { href: "#previous", label: "Previous", icon: <FaHistory /> },
  { href: "#recordings", label: "Recordings", icon: <FaCompactDisc /> },
  { href: "#personal-room", label: "Personal Room", icon: <FaDoorOpen /> },
];

const actionCards = [
  {
    icon: <FaPlusCircle />,
    title: "New Meeting",
    description: "Start an instant meeting",
    buttonText: "Start Instant",
    buttonIcon: <FaBolt />,
    className: "text-cyan-400 shadow-cyan-400/60",
  },
  {
    icon: <FaSignInAlt />,
    title: "Join Meeting",
    description: "Via invitation link or ID",
    buttonText: "Join Now",
    buttonIcon: <FaLink />,
    className: "text-pink-400 shadow-pink-400/60",
  },
  {
    icon: <FaCalendarPlus />,
    title: "Schedule Meeting",
    description: "Plan your meeting ahead",
    buttonText: "Schedule",
    buttonIcon: <FaClock />,
    className: "text-yellow-300 shadow-yellow-300/60",
  },
  {
    icon: <FaPhotoVideo />,
    title: "View Recordings",
    description: "Access past meeting recordings",
    buttonText: "View Now",
    buttonIcon: <FaPlayCircle />,
    className: "text-green-400 shadow-green-400/60",
  },
];

const VMeetHome: React.FC = () => {
  return (
    <div className="font-[Poppins] bg-[#121218] min-h-screen text-[#e0e0e0] relative overflow-x-hidden">
      {/* Background Shapes */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_#00bcd4,_transparent_70%)] top-[-100px] left-[-100px] blur-[100px] opacity-30 animate-float1" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_#ff4081,_transparent_70%)] bottom-[-50px] right-[-80px] blur-[100px] opacity-30 animate-float2" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_#ffffff,_transparent_60%)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-5 animate-float3" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex justify-between items-center px-6 py-3 backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl z-50 shadow-lg">
        <div className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
          <FaVideo /> VMeet
        </div>
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition duration-300 ${
                  link.active
                    ? "text-cyan-400 bg-cyan-400/10 shadow-inner shadow-cyan-400/20 font-semibold"
                    : "text-[#a0a0a0] hover:text-[#e0e0e0] hover:bg-white/10"
                }`}
              >
                {link.icon} {link.label}
              </a>
            </li>
          ))}
        </ul>
        <img
          src="https://via.placeholder.com/40/007bff/FFFFFF?text=U"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
        />
      </nav>

      {/* Main */}
      <main className="pt-[140px] px-[5%] max-w-[1200px] mx-auto pb-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Good <span>Morning</span>, User!
          </h1>
          <p className="text-lg text-[#a0a0a0] mb-3">
            Ready to connect? Here are your quick actions:
          </p>
          <div className="text-5xl font-bold text-[#e0e0e0] drop-shadow-[0_0_15px_rgba(0,188,212,0.6)]">
            10:30 AM
          </div>
          <div className="text-sm text-[#a0a0a0]">Wednesday, July 26, 2023</div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {actionCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl text-center transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`text-4xl mb-5 ${card.className}`}>
                {card.icon}
              </div>
              <h2 className="text-xl font-semibold mb-1">{card.title}</h2>
              <p className="text-[#a0a0a0] mb-4">{card.description}</p>
              <button
                className={`mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 ${card.className}`}
              >
                {card.buttonIcon} {card.buttonText}
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default VMeetHome;

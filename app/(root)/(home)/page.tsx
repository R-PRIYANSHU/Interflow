import MeetingTypeList from "@/components/MeetingTypeList";
import { Calendar, Clock, Link, LogIn, Play, Plus, Video } from "lucide-react";

const actionCards = [
  {
    icon: <Plus size={40} />,
    title: "New Meeting",
    description: "Start an instant meeting",
    buttonText: "Start Instant",
    buttonIcon: <Plus />,
    className: "text-cyan-400 shadow-cyan-400/60",
  },
  {
    icon: <LogIn size={40} />,
    title: "Join Meeting",
    description: "Via invitation link or ID",
    buttonText: "Join Now",
    buttonIcon: <Link />,
    className: "text-pink-400 shadow-pink-400/60",
  },
  {
    icon: <Calendar size={40} />,
    title: "Schedule Meeting",
    description: "Plan your meeting ahead",
    buttonText: "Schedule",
    buttonIcon: <Clock />,
    className: "text-yellow-300 shadow-yellow-300/60",
  },
  {
    icon: <Video size={40} />,
    title: "View Recordings",
    description: "Access past meeting recordings",
    buttonText: "View Now",
    buttonIcon: <Play />,
    className: "text-green-400 shadow-green-400/60",
  },
];

const Home = () => {
  const now = new Date();

  // Dynamic greeting
  const hours = now.getHours();
  let greeting = "Good morning";
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // Ensure AM/PM
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );

  return (
    <section className="h-full mb-12 flex flex-col gap-20">
      {/* Greeting and Time Section - Centered */}
      <header className="flex flex-col items-center text-center gap-2">
        <h1 className="text-[3rem] font-semibold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
          {greeting}, User!
        </h1>
        <p className="text-lg text-[#a0a0a0] mb-3">
          Ready to connect? Here are your quick actions:
        </p>
        <h2 className="text-5xl font-bold text-[#e0e0e0] drop-shadow-[0_0_15px_rgba(0,188,212,0.6)]">
          {time}
        </h2>
        <p className="text-sm text-[#a0a0a0]">{date}</p>
      </header>

      {/* Meeting Action Cards */}
      <MeetingTypeList />
      {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {actionCards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center glass-bg glass-border backdrop-blur-md p-6 rounded-2xl text-center transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
          >
            <div className={`mb-5 ${card.className}`}>{card.icon}</div>
            <h2 className="text-xl font-semibold mb-1">{card.title}</h2>
            <p className="text-[#a0a0a0] mb-4">{card.description}</p>
            <button
              className={`mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-bg glass-border hover:!bg-white/10 ${card.className}`}
            >
              {card.buttonIcon} {card.buttonText}
            </button>
          </div>
        ))}
      </section> */}
    </section>
  );
};

export default Home;

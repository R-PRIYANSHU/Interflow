import MeetingTypeList from '@/components/MeetingTypeList';

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

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Ensure AM/PM
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  return (
    // Main container: Full height, flex column, dark background, padding, increased gap
    <section className="flex size-full flex-col gap-10 text-white px-4 py-8 md:px-8 lg:p-11 bg-dark-1">
      {/* Greeting and Time Section - Centered */}
      <div className="flex flex-col items-center text-center gap-2">
         {/* Greeting */}
         <h1 className="text-3xl font-bold text-sky-1 lg:text-5xl">
           {greeting}, User!
         </h1>
         {/* Subtitle */}
         <p className="text-lg font-normal text-gray-300 lg:text-xl">
           Ready to connect? Here are your quick actions:
         </p>
         {/* Time */}
         <h2 className="text-5xl font-extrabold lg:text-7xl mt-4">
           {time}
         </h2>
         {/* Date */}
         <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
      </div>

      {/* Meeting Action Cards */}
      <MeetingTypeList />
    </section>
  );
};

export default Home;

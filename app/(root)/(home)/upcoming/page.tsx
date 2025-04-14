"use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import CallList from "@/components/CallList";

export default function UpcomingPage() {
  // const [meetings, setMeetings] = useState<Call[]>([]);
  // // const client = new StreamVideoClient({ apiKey, token, user });
  // const client = useStreamVideoClient();

  // useEffect(() => {
  //     client?.queryCalls({filter_conditions: {
  //       ended_at: null
  //     }}).then(res => setMeetings(res.calls))
  // }, []);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Upcoming</h1>
      {/* <nav className='flex flex-col gap-2'>
        {meetings.map(meeting => {
          const id = meeting.cid.split(':')[1];
          
          return (
            <Link target='_blank' href={`/meeting/${id}`} key={id}>{id}</Link>
          )
        })}
      </nav> */}
      <CallList type="upcoming" />
    </section>
  )
}

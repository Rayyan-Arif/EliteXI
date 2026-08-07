"use client";
import { formatTime, sendMessage } from '@/lib/clientUtils';
import { API_URL } from '@/lib/clientUtils';
import { socket } from '@/lib/socket';
import { ManagerClub } from '@/types/club';
import { Match, Timeline } from '@/types/games';
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const UserMatchPage = () => {
    const router = useRouter();
    const [match, setMatch] = useState<Match | null>(null);
    const [time, setTime] = useState(180);
    const [timeline, setTimeline] = useState<Timeline[]>([]);
    const [club1Goals, setClub1Goals] = useState(0);
    const [club2Goals, setClub2Goals] = useState(0);
    const {match_id} = useParams();

    useEffect(() => {
        const m = JSON.parse(localStorage.getItem("match")!);

        if(!m)
            router.push("/user/matches");

        const getMatchDetails = async() => {
            try{
                const res = await fetch(`${API_URL}/matches/${match_id}`);

                if(!res.ok) return;

                const data = await res.json();

                if(data.status !== 'success'){
                    sendMessage(false, data.message);
                    return;
                }

                setMatch({...m, has_game_started: data.data.match});
            } catch(err){

            }
        }

        getMatchDetails();
    }, []);

    useEffect(() => {
        if(!match) return;

        setMatch(match);
        setClub1Goals(match?.goals_club_1 ?? 0);
        setClub2Goals(match?.goals_club_2 ?? 0);

        if(match?.has_game_started !== 1) return;

        socket.connect();

        socket.emit("join-match", match?.game_id);

        const handleTime = (time: number) => setTime(time);

        const handleTimeline = (timeline: Timeline[]) => {
            setTimeline([...timeline].reverse());
            setClub1Goals(timeline[timeline.length - 1].event.club1Goals);
            setClub2Goals(timeline[timeline.length - 1].event.club2Goals);
        };

        const handleFinish = (details: {club1Goals: number, club2Goals: number}) => {
            localStorage.setItem("match", JSON.stringify({
                ...match,
                goals_club_1: details.club1Goals,
                goals_club_2: details.club2Goals,
                has_game_started: 2
            }));
        }

        socket.on(`time_${match?.game_id}`, handleTime);
        socket.on(`timeline`, handleTimeline);
        socket.on('finished', handleFinish);

        return () => {
            if(match?.has_game_started !== 1) return;

            socket.off(`time_${match?.game_id}`, handleTime);
            socket.off(`timeline`, handleTimeline);
            socket.off('finished', handleFinish);

            socket.disconnect();
        }
    }, [match]);

    return (
        <>
        <style>
        {
            `
            .timeline-scroll {
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #4b5563 transparent;
            }

            .timeline-scroll::-webkit-scrollbar {
                width: 6px;
            }

            .timeline-scroll::-webkit-scrollbar-track {
                background: transparent;
            }

            .timeline-scroll::-webkit-scrollbar-thumb {
                background: #4b5563;
                border-radius: 9999px;
            }

            .live-pulse {
                animation: live-pulse 1.6s ease-in-out infinite;
            }

            @keyframes live-pulse {
                0%,
                100% {
                opacity: 1;
                }
                50% {
                opacity: 0.45;
                }
            }
            `
        }
        </style>
        <main className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
            <header className="shrink-0 px-6 pt-6 pb-4 border-b border-gray-800">
            <div className="flex items-center justify-between gap-4 mb-5">
                <Link
                    href="/user/matches"
                    className="text-sm text-gray-400 hover:text-white"
                    >
                    ← Back to Matches
                </Link>
                <div className="flex items-center gap-2">
                {
                    match?.has_game_started === 1 &&
                    <span
                    className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-red-500/20 bg-opacity-20 text-red-400"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 live-pulse"></span>
                        LIVE
                    </span>
                }
                {
                    match?.has_game_started === 2 &&
                    <span
                    className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 bg-opacity-20 text-emerald-400"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse"></span>
                        Finished
                    </span>
                }
                </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-4">{match?.game_name}</p>

            <div className="grid grid-cols-3 items-center gap-4 max-w-3xl mx-auto">
                <div className="text-right">
                <p className="text-xl sm:text-2xl font-extrabold leading-tight">
                    {match?.club1_name}
                </p>
                <p className="mt-1 text-xs text-gray-400">Home</p>
                </div>

                <div className="text-center">
                <p className="text-4xl sm:text-5xl font-black tracking-tight">
                    <span className="text-white">{club1Goals}</span>
                    <span className="text-gray-500 mx-1">-</span>
                    <span className="text-white">{club2Goals}</span>
                </p>
                <p className="mt-3 text-xs text-gray-400 uppercase tracking-wide">
                    Time left
                </p>
                <p className="mt-1 text-lg font-bold text-green-400" id="time-left">
                    {match?.has_game_started === 1 ? formatTime(time) : '00:00'}
                </p>
                </div>

                <div className="text-left">
                <p className="text-xl sm:text-2xl font-extrabold leading-tight">
                    {match?.club2_name}
                </p>
                <p className="mt-1 text-xs text-gray-400">Away</p>
                </div>
            </div>
            </header>

            <section className="flex-1 min-h-0 flex flex-col px-6 py-5">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <div>
                    <h2 className="text-lg font-bold">Match Timeline</h2>
                    <p className="mt-0.5 text-sm text-gray-400">
                        Live events as they happen on the pitch.
                    </p>
                    </div>
                    <p className="text-xs text-gray-500">Newest at the top</p>
                </div>

                <div
                    className="timeline-scroll flex-1 min-h-0 max-h-[calc(100dvh-18rem)] bg-gray-800 border border-gray-700 rounded-xl"
                >
                    <div className="relative px-5 py-5 space-y-0">
                    <div
                        className="absolute left-9 top-5 bottom-5 w-px bg-gray-700"
                        aria-hidden="true"
                    ></div>

                    {
                        timeline.map((moment, i) => {
                            return (
                                <article className="relative flex gap-4 pb-6" key={i}>
                                <div
                                className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold"
                                >
                                →
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                    <p className="font-semibold text-white">
                                        {moment.event.player}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {moment.event.eventType}
                                    </p>
                                    </div>
                                    <span
                                    className="shrink-0 text-xs font-semibold px-2 py-1 rounded bg-gray-900 text-blue-400"
                                    >
                                    {formatTime(moment.time)}
                                    </span>
                                </div>
                                </div>
                            </article>
                            )
                        })
                    }
                    </div>
                </div>
            </section>
        </main>
        </>
    )
}

export default UserMatchPage
const UserMatchSkeleton = () => {
    return (
        <>
            <style>
                {`
                    @keyframes skeleton-pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.45;
                        }
                    }

                    .skeleton-pulse {
                        animation: skeleton-pulse 1.5s ease-in-out infinite;
                    }
                `}
            </style>

            <main className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="shrink-0 px-6 pt-6 pb-4 border-b border-gray-800">
                    <div className="flex items-center justify-between gap-4 mb-5">
                        {/* Back button */}
                        <div className="h-4 w-32 rounded bg-gray-800 skeleton-pulse" />

                        {/* Live badge */}
                        <div className="h-6 w-16 rounded bg-gray-800 skeleton-pulse" />
                    </div>

                    {/* Game name */}
                    <div className="flex justify-center mb-4">
                        <div className="h-4 w-40 rounded bg-gray-800 skeleton-pulse" />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4 max-w-3xl mx-auto">
                        {/* Club 1 */}
                        <div className="text-right">
                            <div className="ml-auto h-7 w-40 sm:w-48 rounded bg-gray-800 skeleton-pulse" />
                            <div className="ml-auto mt-2 h-3 w-12 rounded bg-gray-800 skeleton-pulse" />
                        </div>

                        {/* Score */}
                        <div className="text-center">
                            <div className="flex justify-center items-center gap-2">
                                <div className="h-12 w-10 rounded bg-gray-800 skeleton-pulse" />
                                <div className="h-10 w-4 rounded bg-gray-800 skeleton-pulse" />
                                <div className="h-12 w-10 rounded bg-gray-800 skeleton-pulse" />
                            </div>

                            <div className="flex justify-center mt-3">
                                <div className="h-3 w-16 rounded bg-gray-800 skeleton-pulse" />
                            </div>

                            <div className="flex justify-center mt-2">
                                <div className="h-6 w-14 rounded bg-gray-800 skeleton-pulse" />
                            </div>
                        </div>

                        {/* Club 2 */}
                        <div>
                            <div className="h-7 w-40 sm:w-48 rounded bg-gray-800 skeleton-pulse" />
                            <div className="mt-2 h-3 w-12 rounded bg-gray-800 skeleton-pulse" />
                        </div>
                    </div>
                </header>

                {/* Timeline */}
                <section className="flex-1 min-h-0 flex flex-col px-6 py-5">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                            <div className="h-5 w-36 rounded bg-gray-800 skeleton-pulse" />
                            <div className="mt-2 h-4 w-64 rounded bg-gray-800 skeleton-pulse" />
                        </div>

                        <div className="h-3 w-28 rounded bg-gray-800 skeleton-pulse" />
                    </div>

                    <div className="timeline-scroll flex-1 min-h-0 max-h-[calc(100dvh-18rem)] bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                        <div className="relative px-5 py-5">
                            {/* Vertical timeline line */}
                            <div
                                className="absolute left-9 top-5 bottom-5 w-px bg-gray-700"
                                aria-hidden="true"
                            />

                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <article
                                        key={item}
                                        className="relative flex gap-4"
                                    >
                                        {/* Timeline icon */}
                                        <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-gray-700 skeleton-pulse" />

                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-2">
                                                    {/* Player */}
                                                    <div className="h-4 w-32 rounded bg-gray-700 skeleton-pulse" />

                                                    {/* Event */}
                                                    <div className="h-3 w-24 rounded bg-gray-700 skeleton-pulse" />
                                                </div>

                                                {/* Time */}
                                                <div className="shrink-0 h-6 w-12 rounded bg-gray-900 skeleton-pulse" />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default UserMatchSkeleton;
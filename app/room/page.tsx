"use client";

import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import {useRouter} from "next/router";

export default function Page() {

    const [token, setToken] = useState("");

    useEffect(() => {
        (async () => {
            const urlObj = new URL(window.location.href);
            const room = urlObj.searchParams.get('name')
            console.log(`room name ${room}`)
            try {
                const resp = await fetch(
                    `/api/get-participant-token?room=${room}&username=${room}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    if (token === "") {
        return <div>Getting token...</div>;
    }

    return (
        <LiveKitRoom
            video={true}
    audio={true}
    token={token}
    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    // Use the default LiveKit theme for nice styles.
    data-lk-theme="default"
    style={{ height: '100dvh' }}
>
    {/* Your custom component with basic video conferencing functionality. */}
    <MyVideoConference />
    {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
    <RoomAudioRenderer />
    {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
    <ControlBar />
    </LiveKitRoom>
);
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
    {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
    <ParticipantTile />
    </GridLayout>
);
}

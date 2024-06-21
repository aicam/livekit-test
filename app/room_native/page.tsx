"use client";

import { Room, createLocalVideoTrack, createLocalAudioTrack} from "livekit-client";
import { useEffect, useState, useRef } from "react";
import * as React from "react";

export default function Page() {
    const [token, setToken] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const setUpRoom = async (token: string) => {
        const room = new Room();
        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || "", token);

        const videoTrack = await createLocalVideoTrack({ deviceId: undefined, resolution: { width: 1280, height: 720 } });
        const audioTrack = await createLocalAudioTrack();

        room.localParticipant.publishTrack(videoTrack);
        room.localParticipant.publishTrack(audioTrack);

        if (videoRef.current) {
            videoTrack.attach(videoRef.current);
        }
        if (audioRef.current) {
            audioTrack.attach(audioRef.current);
        }
    };

    useEffect(() => {
        (async () => {
            const urlObj = new URL(window.location.href);
            const roomName = urlObj.searchParams.get('name');
            if (roomName) {
                try {
                    const resp = await fetch(`/api/get-participant-token?room=${roomName}&username=${roomName}`);
                    const data = await resp.json();
                    setToken(data.token);
                    setUpRoom(data.token);
                } catch (e) {
                    console.error(e);
                }
            }
        })();
    }, []);

    return (
        <div>
            {token === "" ? (
                <div>Getting token...</div>
            ) : (
                <div>
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%' }}></video>
                    <audio ref={audioRef} autoPlay muted></audio>
                </div>
            )}
        </div>
    );
}

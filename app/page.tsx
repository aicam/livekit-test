"use client"


import {useState} from "react";

export default function Home() {
    const [roomName, setRoomName] = useState("");

    const onSubmit = () => {
        window.location.href = `/room?name=${roomName}`
    }

    return <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col">
            <form>
                <input onChange={(e) => {
                    setRoomName(e.target.value);
                }} type="text" placeholder="room name" />
                <input onClick={onSubmit} type="button" name="submit" value="submit" />
            </form>
        </div>
    </main>;
}

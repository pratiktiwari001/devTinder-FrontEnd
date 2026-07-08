import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
    const url = BASE_URL;

    return io(url, {
        path: '/socket.io/',
    });
};
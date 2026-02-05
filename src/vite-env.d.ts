/// <reference types="vite/client" />

interface Window {
    __ENV__?: {
        VITE_API_BASE_URL?: string;
        [key: string]: any;
    };
}

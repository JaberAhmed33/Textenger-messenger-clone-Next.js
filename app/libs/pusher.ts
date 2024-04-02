import PusherServer from 'pusher';
import PusherClint from 'pusher-js';

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'eu',
    useTLS: true
})

export const pusherClient = new PusherClint(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
        cluster: 'eu',
        authEndpoint: '/pusher/auth',
    }
)
import authOptions from "@/app/libs/configs/auth/authOptions";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";


export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: session.user.email,
    };

    const auth = pusherServer.authenticate(socketId, channel, presenceData);
    res.send(auth);
  } catch (error) {
    console.error("Error in Pusher auth API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

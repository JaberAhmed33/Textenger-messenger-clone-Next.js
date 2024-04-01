import { getServerSession } from "next-auth";
import authOptions from "../libs/configs/auth/authOptions";

export default async function getSession() {
    return await getServerSession(authOptions);
}
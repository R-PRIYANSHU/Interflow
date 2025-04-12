"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apikey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apisecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not found");
  if (!apikey) throw new Error("Missing Stream API Key");
  if (!apisecret) throw new Error("Missing Stream Secret Key");

  const client = new StreamClient(apikey, apisecret);
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // expires in 1 hour
  const issued = Math.floor(Date.now() / 1000) - 60;       // issued 1 minute ago
  
  // Using createToken as a temporary workaround
  const token = client.createToken(user.id, exp, issued);
  return token;
};


import { redirect } from "next/navigation";

export default function ChannelsPage() {
  // Redirect to desafios page as channels are now challenges
  redirect("/desafios");
}


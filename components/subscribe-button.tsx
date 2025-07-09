"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  channelId: string;
  initialSubscribed?: boolean;
  initialCount?: number;
}

export default function SubscribeButton({ channelId, initialSubscribed = false, initialCount = 0 }: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(initialCount);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/channels/${channelId}/subscribe`, {
        method: 'POST',
      });
      const data = await response.json();
      
      setSubscribed(data.subscribed);
      setSubscriberCount(prev => data.subscribed ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      className={subscribed ? 'bg-gray-600' : 'bg-[#10b981]'}
    >
      {subscribed ? 'Subscribed' : 'Subscribe'} 
      <span className="ml-2">({subscriberCount})</span>
    </Button>
  );
}
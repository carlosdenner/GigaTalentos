"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  _id: string;
  content: string;
  sender_id: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver_id: {
    _id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
}

export default function MessagesPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [receiverInfo, setReceiverInfo] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please login to view messages",
        variant: "destructive",
      });
      return;
    }

    const fetchMessages = async () => {
      try {
        const [messagesRes, channelRes] = await Promise.all([
          fetch(`/api/messages?receiverId=${params.id}`),
          fetch(`/api/channels/${params.id}`),
        ]);

        if (!messagesRes.ok || !channelRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [messagesData, channelData] = await Promise.all([
          messagesRes.json(),
          channelRes.json(),
        ]);

        setMessages(messagesData);
        setReceiverInfo(channelData);
        setLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [params.id, session, status]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: params.id,
          content: newMessage,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send message");
      }

      setNewMessage("");
      // Refresh messages
      const messagesRes = await fetch(`/api/messages?receiverId=${params.id}`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
      scrollToBottom();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="bg-[#1a2942] border-gray-800">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={receiverInfo?.avatar} />
              <AvatarFallback>
                {receiverInfo?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {receiverInfo?.name}
              </h2>
              <p className="text-sm text-gray-400">
                {receiverInfo?.category || "Talent"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender_id._id === session?.user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[70%] ${
                    message.sender_id._id === session?.user?.id
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender_id.avatar} />
                    <AvatarFallback>
                      {message.sender_id.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender_id._id === session?.user?.id
                        ? "bg-[#ff1493] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              type="submit"
              className="bg-[#ff1493] hover:bg-[#ff1493]/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

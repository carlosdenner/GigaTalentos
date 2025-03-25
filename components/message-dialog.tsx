"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface MessageDialogProps {
  receiverId: string;
  receiverName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageDialog({
  receiverId,
  receiverName,
  isOpen,
  onClose,
}: MessageDialogProps) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && receiverId) {
      fetchMessages();
    }
  }, [isOpen, receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?receiverId=${receiverId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content: newMessage }),
      });

      if (!response.ok) throw new Error();

      setNewMessage("");
      fetchMessages();
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2942] border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            Message {receiverName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="h-[300px] overflow-y-auto space-y-4 p-4 bg-[#0a192f] rounded-lg">
            {messages.map((msg: any) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender_id === receiverId ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.sender_id === receiverId
                      ? "bg-gray-700 text-white"
                      : "bg-[#1e90ff] text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="bg-[#0a192f] border-gray-700 text-white"
            />
            <Button
              onClick={handleSend}
              className="bg-[#1e90ff] hover:bg-[#1e90ff]/90"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

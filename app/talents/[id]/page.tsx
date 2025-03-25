"use client";

import { useEffect, useState, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import FavoriteButton from "@/components/favorite-button";
import { getYouTubeEmbedUrl } from "@/utils";
import { useUserType } from "@/hooks/useUserType";
import SponsorRecommendations from "@/components/sponsor-recommendations";
import { useRouter } from "next/navigation";

export default function TalentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTalent() {
      try {
        const response = await fetch(`/api/talents/${resolvedParams.id}`);
        const data = await response.json();
        if (response.ok) {
          setTalent(data);
        } else {
          console.error("Error fetching talent:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTalent();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!talent) {
    return <div className="text-white">Talent not found</div>;
  }

  const embedUrl = getYouTubeEmbedUrl(talent.video_url);
  const { userType, isLoading } = useUserType();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={talent.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="mt-6 flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage
                src={
                  talent.channels?.avatar ||
                  "/placeholder.svg?height=48&width=48"
                }
                alt={talent.channels?.name}
              />
              <AvatarFallback>
                {talent.channels?.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{talent.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>
                  By{" "}
                  <Link
                    href={`/channels/${talent.channel_id}`}
                    className="text-[#9d4edd]"
                  >
                    {talent.channels?.name}
                  </Link>
                </span>
                <span className="text-[#9d4edd]">
                  {talent.views?.toLocaleString()} Views
                </span>
                <span>{new Date(talent.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            {userType === "fan" && (
              <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
                Subscribe
              </Button>
            )}

            {userType === "sponsor" && (
              <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
                Contact Talent
              </Button>
            )}

            <div className="flex items-center ml-auto gap-6">
              {(userType === "fan" || userType === "sponsor") && (
                <FavoriteButton videoId={talent.id} />
              )}

              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <MessageSquare className="h-6 w-6 mr-2" />
                <span>Comment</span>
              </Button>

              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <p className="text-gray-300">{talent.description}</p>
            <p className="mt-4 text-gray-300">
              Category:{" "}
              <Link
                href={`/categories/${talent.channels?.category.toLowerCase()}`}
                className="text-[#9d4edd]"
              >
                {talent.channels?.category}
              </Link>
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          {userType === "sponsor" ? (
            <>
              <div className="mb-8">
                <Button
                  className="w-full bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white"
                  onClick={() =>
                    router.push(`/messages/${talent.channels?.user_id}`)
                  }
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Talent
                </Button>
              </div>
              <SponsorRecommendations />
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-4">
                Related Videos
              </h3>
              <div className="space-y-4">
                {talent.relatedVideos?.map((item: any) => (
                  <Link
                    href={`/talents/${item.id}`}
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(item.video_url)}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-[#9d4edd]">
                        {item.title}
                      </h4>
                      <p className="text-[#9d4edd] text-sm">
                        {item.channels?.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />{" "}
                          {item.views?.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />{" "}
                          {item.likes?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

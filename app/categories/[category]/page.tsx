import { Button } from "@/components/ui/button";
import { Eye, Heart, Zap } from "lucide-react";
import Link from "next/link";
import Channel from "@/models/Channel";
import Video from "@/models/Video";
import { getYouTubeEmbedUrl } from "@/utils";
import Category from "@/models/Category";
import { Types } from "mongoose";

async function getVideosByCategory(category: string) {
  try {
    // Find videos directly by category
    const videos = await Video.find({
      category: category, // Use the category directly
    })
      .populate({
        path: "channel_id",
        select: "name avatar category",
      })
      .sort({ views: -1 });

    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

async function getCategoryInfo(categoryId: string) {
  try {
    const category = await Category.findOne({
      _id: categoryId,
    });

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryId = await params.category;
  const videos = await getVideosByCategory(categoryId);
  const categoryInfo = await getCategoryInfo(categoryId);

  // console.log("Category Info:", categoryInfo);
  // console.log("Videos:", videos);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f]">
      <section className="p-8">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="h-6 w-6 text-[#1e90ff]" />
          <h1 className="text-3xl font-bold text-white">
            {categoryInfo?.name}
          </h1>
        </div>

        {categoryInfo && (
          <div className="mb-8 bg-[#1a2942] p-6 rounded-lg">
            <p className="text-gray-300">{categoryInfo.description}</p>
          </div>
        )}

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              No videos found in this category
            </p>
            <Link href="/categories">
              <Button variant="outline">Explore Other Categories</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video: any) => (
              <Link
                href={`/talents/${video.id}`}
                key={video.id}
                className="group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(video.video_url)}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <Eye className="h-4 w-4 text-[#1e90ff]" />
                    <span className="text-white text-sm">
                      {video.views?.toLocaleString()}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Heart className="h-4 w-4 text-[#ff1493]" />
                    <span className="text-white text-sm">
                      {video.likes?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white font-medium group-hover:text-[#1e90ff]">
                    {video.title}
                  </h3>
                  <p className="text-[#1e90ff]">{video.channels?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="border-[#1e90ff] text-[#1e90ff]">
            Load More
          </Button>
        </div>
      </section>
    </div>
  );
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Channel from "@/models/Channel";
import Video from "@/models/Video";
import { Projeto, Desafio } from "@/models";

export async function GET() {
  try {
    await connectDB();
    
    // Get Carlos Denner user
    const user = await User.findOne({ email: "carlosdenner@gmail.com" });
    if (!user) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    // Get his channels
    const channels = await Channel.find({ user_id: user._id });
    console.log('Found channels:', channels.length);

    // Get his videos
    const channelIds = channels.map(channel => channel._id);
    const videos = await Video.find({ channel_id: { $in: channelIds } })
      .populate('channel_id', 'name')
      .sort({ created_at: -1 });
    console.log('Found videos:', videos.length);

    // Get his projetos
    const projetos = await Projeto.find({
      $or: [
        { talento_lider_id: user._id },
        { criador_id: user._id }
      ]
    })
    .populate('talento_lider_id', 'name')
    .populate('criador_id', 'name')
    .sort({ criado_em: -1 });
    console.log('Found projetos:', projetos.length);

    // Get his desafios
    const desafios = await Desafio.find({ created_by: user._id })
      .populate('category', 'name')
      .sort({ created_at: -1 });
    console.log('Found desafios:', desafios.length);

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        account_type: user.account_type,
        avatar: user.avatar
      },
      stats: {
        channels: channels.length,
        videos: videos.length,
        projetos: projetos.length,
        desafios: desafios.length
      },
      channels: channels.map(ch => ({ name: ch.name, _id: ch._id })),
      videos: videos.map(v => ({ title: v.title, channel: v.channel_id?.name })),
      projetos: projetos.map(p => ({ nome: p.nome, criador: p.criador_id?.name })),
      desafios: desafios.map(d => ({ title: d.title, category: d.category?.name }))
    });
  } catch (error) {
    console.error('Test profile error:', error);
    return NextResponse.json(
      { error: "Failed to test profile", details: error.message },
      { status: 500 }
    );
  }
}

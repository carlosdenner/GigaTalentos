import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Channel from '@/models/Channel';
import Desafio from '@/models/Desafio';
import Projeto from '@/models/Projeto';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({});
    const channels = await Channel.find({});
    const desafios = await Desafio.find({});
    const projetos = await Projeto.find({});

    const mentors = users.filter(u => u.account_type === 'mentor');
    const talents = users.filter(u => u.account_type === 'talent');

    return NextResponse.json({
      users: {
        total: users.length,
        mentors: mentors.length,
        talents: talents.length,
        sample: users.slice(0, 3).map(u => ({
          _id: u._id,
          name: u.name,
          account_type: u.account_type
        }))
      },
      channels: {
        total: channels.length,
        sample: channels.slice(0, 3).map(c => ({
          _id: c._id,
          name: c.name
        }))
      },
      desafios: {
        total: desafios.length,
        sample: desafios.slice(0, 3).map(d => ({
          _id: d._id,
          title: d.title
        }))
      },
      projetos: {
        total: projetos.length,
        sample: projetos.slice(0, 3).map(p => ({
          _id: p._id,
          nome: p.nome
        }))
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

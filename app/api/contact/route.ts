import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Get the raw body first for debugging
    const rawBody = await request.text();
    console.log('Raw body received:', rawBody);
    
    // Parse JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = parsedBody;
    console.log('Parsed data:', { name, email, subject, message });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Create transporter
    console.log('Creating transporter with user:', process.env.EMAIL_USER);
    console.log('Email pass exists:', !!process.env.EMAIL_PASS);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    // Email content
    const subjectMap = {
      general: 'Consulta Geral',
      support: 'Suporte Técnico',
      partnership: 'Oportunidades de Parceria',
      sponsorship: 'Patrocínio',
      other: 'Outro'
    };

    const emailSubject = `[Giga Talentos] ${subjectMap[subject as keyof typeof subjectMap] || 'Contato'}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Nova Mensagem de Contato</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Giga Talentos Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Detalhes do Contato:</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Nome:</strong> ${name}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Assunto:</strong> ${subjectMap[subject as keyof typeof subjectMap] || 'Outro'}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Mensagem:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef; border-top: none;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            Esta mensagem foi enviada através do formulário de contato da Giga Talentos Platform.
          </p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
            Para responder, utilize o email: ${email}
          </p>
        </div>
      </div>
    `;

    console.log('Attempting to send email...');
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Giga Talentos" <${process.env.EMAIL_USER}>`,
      to: 'carlosdenner@gmail.com',
      subject: emailSubject,
      html: htmlContent,
      replyTo: email,
    });

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      { message: 'Email enviado com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

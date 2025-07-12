import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável MONGODB_URI no arquivo .env.local');
}

async function checkUsers() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI!);
    console.log("🔗 Conectado ao MongoDB");

    // Buscar todos os usuários
    const users = await User.find({}).select("email name account_type");
    
    console.log("\n👥 Usuários encontrados no banco:");
    console.log("=====================================");
    
    if (users.length === 0) {
      console.log("❌ Nenhum usuário encontrado no banco de dados");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - ${user.name} (${user.account_type})`);
      });
    }

    console.log(`\n📊 Total: ${users.length} usuários`);

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado do MongoDB");
  }
}

checkUsers();

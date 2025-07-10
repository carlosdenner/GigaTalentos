const https = require('https');
const fs = require('fs');
const path = require('path');

// Category images mapping
const categoryImages = {
  'Habilidade Cognitiva & Técnica': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format&q=80',
  'Criatividade & Inovação': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop&auto=format&q=80',
  'Liderança & Colaboração': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&auto=format&q=80',
  'Resiliência & Adaptabilidade': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80',
  'Consciência Social & Ética': 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&h=600&fit=crop&auto=format&q=80',
  'Comunicação & Persuasão': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format&q=80'
};

// Create public/categories directory if it doesn't exist
const categoriesDir = path.join(__dirname, 'public', 'categories');
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(categoriesDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(path.join(categoriesDir, filename), () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  try {
    const downloads = Object.entries(categoryImages).map(([name, url], index) => {
      const filename = `category-${index + 1}.jpg`;
      console.log(`Downloading ${name}...`);
      return downloadImage(url, filename);
    });
    
    await Promise.all(downloads);
    console.log('All images downloaded successfully!');
    
    // Show the mapping for reference
    console.log('\nImage mapping:');
    Object.keys(categoryImages).forEach((name, index) => {
      console.log(`${name}: /categories/category-${index + 1}.jpg`);
    });
    
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages();

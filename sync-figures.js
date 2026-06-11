const fs = require('fs');
const path = require('path');

const figuresDir = path.join(__dirname, 'figures');
const manifestPath = path.join(figuresDir, 'manifest.json');

try {
  if (!fs.existsSync(figuresDir)) {
    console.error(`figures directory not found at: ${figuresDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(figuresDir);
  const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg'];
  
  const images = files.filter(file => {
    // Exclude system files starting with ._ or .
    if (file.startsWith('.')) return false;
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2), 'utf-8');
  console.log(`Successfully scanned ${images.length} images and wrote to ${manifestPath}`);
  console.log(images);
} catch (error) {
  console.error('Error scanning figures:', error);
  process.exit(1);
}

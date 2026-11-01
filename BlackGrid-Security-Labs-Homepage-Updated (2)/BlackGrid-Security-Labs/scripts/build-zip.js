import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

async function generateProjectZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();

  const filesToAdd = [
    'index.html',
    'courses.html',
    'cybersecurity.html',
    'software-development.html',
    'ai-data.html',
    'networking.html',
    'cloud-devops.html',
    'robotics-iot.html',
    'government-exams.html',
    'blogs.html',
    'workshops.html',
    'about.html',
    'contact.html',
    'css/style.css',
    'js/script.js',
    'README.md',
  ];

  for (const relPath of filesToAdd) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
      console.log(`Added: ${relPath}`);
    }
  }

  // Add images folder
  const imagesDir = path.join(rootDir, 'assets/images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    for (const img of imageFiles) {
      if (img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.svg')) {
        const imgPath = path.join(imagesDir, img);
        const data = fs.readFileSync(imgPath);
        zip.file(`assets/images/${img}`, data);
        console.log(`Added image: assets/images/${img}`);
      }
    }
  }

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const outputPath = path.join(rootDir, 'BlackGrid-Security-Labs.zip');
  fs.writeFileSync(outputPath, zipBuffer);
  console.log(`Successfully created: ${outputPath} (${(zipBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

generateProjectZip().catch((err) => {
  console.error('Error creating zip:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'assets');

function resolveImagePath(imageFile) {
  if (!imageFile) return null;

  const direct = path.join(IMAGES_DIR, imageFile);
  if (fs.existsSync(direct)) return direct;

  if (!fs.existsSync(IMAGES_DIR)) return null;

  const files = fs.readdirSync(IMAGES_DIR);
  const needle = String(imageFile).toLowerCase();
  const match = files.find(
    (file) => file.toLowerCase() === needle || file.toLowerCase().includes(needle)
  );
  return match ? path.join(IMAGES_DIR, match) : null;
}

function loadImageForSeed(product) {
  const { imageFile, image, ...rest } = product;
  const lookup = imageFile || (image ? decodeURIComponent(String(image).split('/').pop()) : null);
  const filePath = resolveImagePath(lookup);

  if (!filePath) {
    console.warn(`Missing product image for "${rest.name}": ${lookup || '(none)'}`);
    return { ...rest, imageFile: lookup || imageFile };
  }

  const resolvedName = path.basename(filePath);
  const imageData = fs.readFileSync(filePath);
  const imageContentType = /\.png$/i.test(resolvedName) ? 'image/png' : 'image/jpeg';

  return {
    ...rest,
    imageFile: resolvedName,
    imageData,
    imageContentType,
  };
}

function prepareSeedProducts(products) {
  return products.map(loadImageForSeed);
}

module.exports = { IMAGES_DIR, resolveImagePath, loadImageForSeed, prepareSeedProducts };

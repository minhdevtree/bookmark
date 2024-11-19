const fs = require('fs');
const path = require('path');

// Define paths
const outDir = path.join(__dirname, 'out');
const indexPath = path.join(outDir, 'index.html');
const scriptDir = path.join(outDir, 'next/static/js');
const manifestPath = path.join(outDir, 'manifest.json');

// Ensure the output directories exist
fs.mkdirSync(scriptDir, { recursive: true });

// Read index.html content
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Updated regular expression to match all inline scripts, including those with complex structures
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

let match;
let scriptCounter = 1;

// Array to store replacements to avoid modifying indexHtml during the loop
const replacements = [];

// Process each inline script
while ((match = scriptRegex.exec(indexHtml)) !== null) {
  const scriptContent = match[1].trim();

  // Only process non-empty scripts
  if (scriptContent) {
    const scriptFileName = `script${scriptCounter}.js`;
    const scriptFilePath = path.join(scriptDir, scriptFileName);

    // Write the script content to a new file
    fs.writeFileSync(scriptFilePath, scriptContent, 'utf-8');

    // Prepare the replacement for later to avoid modifying `indexHtml` during iteration
    replacements.push({
      original: match[0],
      replacement: `<script src="./next/static/js/${scriptFileName}"></script>`,
    });

    scriptCounter++;
  }
}

// Apply all replacements at once
replacements.forEach(({ original, replacement }) => {
  indexHtml = indexHtml.replace(original, replacement);
});

// Save the modified index.html back to the out directory
fs.writeFileSync(indexPath, indexHtml, 'utf-8');
console.log(`Extracted ${scriptCounter - 1} inline scripts to external files.`);

// Create the manifest.json file with the specified content
const manifestContent = {
  manifest_version: 3,
  name: 'Bookmark Manager',
  version: '1.0',
  description: 'A bookmark manager replacing the new tab page.',
  chrome_url_overrides: {
    newtab: 'index.html',
  },
  permissions: [],
};

// Write the manifest.json file
fs.writeFileSync(
  manifestPath,
  JSON.stringify(manifestContent, null, 2),
  'utf-8'
);
console.log('manifest.json created successfully.');

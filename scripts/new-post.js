#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createNewPost() {
  console.log('🚀 Creating a new blog post for Pixel Wisdom\n');
  
  try {
    const title = await question('📝 Post title: ');
    const description = await question('📄 Brief description: ');
    const category = await question('📂 Category (finance/tech/ai/education/policy): ') || 'tech';
    const tags = await question('🏷️  Tags (comma-separated): ');
    
    const slug = slugify(title);
    const date = formatDate(new Date());
    const filename = `${slug}.md`;
    const filepath = path.join(__dirname, '..', 'content', 'blog', filename);
    
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`❌ File already exists: ${filename}`);
      process.exit(1);
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const frontmatter = `---
title: "${title}"
date: "${date}"
description: "${description}"
category: "${category}"
tags: [${tagArray.map(tag => `"${tag}"`).join(', ')}]
author: "Benjamin Williams"
featured: false
draft: false
---

# ${title}

${description}

## Overview

Write your content here...

## Key Points

- Point 1
- Point 2
- Point 3

## Conclusion

Wrap up your thoughts here.

---

*Published on ${date} | Category: ${category}*
`;

    fs.writeFileSync(filepath, frontmatter);
    
    console.log(`\n✅ Successfully created: ${filename}`);
    console.log(`📁 Location: content/blog/${filename}`);
    console.log(`🔗 URL will be: /blog/${slug}`);
    console.log('\n🚀 Next steps:');
    console.log('1. Edit the file to add your content');
    console.log('2. Commit and push to GitHub');
    console.log('3. Site will auto-deploy via Vercel');
    
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createNewPost(); 
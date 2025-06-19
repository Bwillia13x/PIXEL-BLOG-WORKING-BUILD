#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');
const REQUIRED_FIELDS = ['title', 'date', 'description', 'category'];

function validateMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const errors = [];
  const warnings = [];
  
  // Check required frontmatter fields
  REQUIRED_FIELDS.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate date format
  if (frontmatter.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(frontmatter.date)) {
      errors.push(`Invalid date format. Use YYYY-MM-DD format.`);
    }
  }
  
  // Check content length
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 50) {
    warnings.push(`Content is quite short (${wordCount} words). Consider adding more detail.`);
  }
  
  // Check for valid category (case-insensitive)
  const validCategories = ['finance', 'tech', 'ai', 'education', 'policy'];
  if (frontmatter.category && !validCategories.includes(frontmatter.category.toLowerCase())) {
    warnings.push(`Category "${frontmatter.category}" is not in the standard list: ${validCategories.join(', ')}`);
  }
  
  // Check for tags
  if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
    warnings.push('No tags specified. Consider adding relevant tags.');
  }
  
  return { errors, warnings, wordCount };
}

function validateAllContent() {
  console.log('🔍 Validating blog content...\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalFiles = 0;
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('❌ Content directory not found:', CONTENT_DIR);
    process.exit(1);
  }
  
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('ℹ️ No blog posts found in content/blog/');
    return;
  }
  
  files.forEach(filename => {
    const filePath = path.join(CONTENT_DIR, filename);
    totalFiles++;
    
    try {
      const { errors, warnings, wordCount } = validateMarkdownFile(filePath);
      
      console.log(`📄 ${filename} (${wordCount} words)`);
      
      if (errors.length > 0) {
        console.log('  ❌ Errors:');
        errors.forEach(error => console.log(`    - ${error}`));
        totalErrors += errors.length;
      }
      
      if (warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        warnings.forEach(warning => console.log(`    - ${warning}`));
        totalWarnings += warnings.length;
      }
      
      if (errors.length === 0 && warnings.length === 0) {
        console.log('  ✅ Valid');
      }
      
      console.log('');
    } catch (error) {
      console.log(`  ❌ Failed to parse: ${error.message}\n`);
      totalErrors++;
    }
  });
  
  console.log(`📊 Summary:`);
  console.log(`  Files: ${totalFiles}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ Validation failed! Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All content validated successfully!');
  }
}

validateAllContent(); 
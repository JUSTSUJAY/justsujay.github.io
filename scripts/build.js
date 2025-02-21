const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');
const Handlebars = require('handlebars');

// Register partials
const headerTemplate = fs.readFileSync('./templates/partials/header.html', 'utf-8');
const footerTemplate = fs.readFileSync('./templates/partials/footer.html', 'utf-8');
const scriptsTemplate = fs.readFileSync('./templates/partials/scripts.html', 'utf-8');

Handlebars.registerPartial('header', headerTemplate);
Handlebars.registerPartial('footer', footerTemplate);
Handlebars.registerPartial('scripts', scriptsTemplate);

// Read blog template
const blogTemplate = Handlebars.compile(
    fs.readFileSync('./templates/blog-template.html', 'utf-8')
);

async function buildBlogs() {
    const blogsDir = './content/blogs';
    const outputDir = './blogs';
    const blogsList = [];

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Read all markdown files
    const files = await fs.readdir(blogsDir);
    
    for (const file of files) {
        if (path.extname(file) === '.md') {
            const content = await fs.readFile(path.join(blogsDir, file), 'utf-8');
            const { attributes, body } = frontMatter(content);
            
            // Add to blogs list
            blogsList.push({
                title: attributes.title,
                date: attributes.date,
                author: attributes.author,
                excerpt: body.split('\n')[0], // First paragraph as excerpt
                slug: path.basename(file, '.md')
            });

            // Convert markdown to HTML
            const htmlContent = marked(body);
            
            // Generate blog post HTML
            const finalHtml = blogTemplate({
                title: attributes.title,
                date: attributes.date,
                author: attributes.author,
                content: htmlContent
            });

            // Create blog directory and save
            const slug = path.basename(file, '.md');
            const blogDir = path.join(outputDir, slug);
            await fs.ensureDir(blogDir);
            await fs.writeFile(path.join(blogDir, 'index.html'), finalHtml);
        }
    }

    // Sort blogs by date (newest first)
    blogsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update blogs listing page
    const blogsTemplate = Handlebars.compile(
        fs.readFileSync('./templates/blogs-listing.html', 'utf-8')
    );

    const blogsListingHtml = blogsTemplate({ blogs: blogsList });
    await fs.writeFile('./blogs/index.html', blogsListingHtml);
}

buildBlogs().catch(console.error);

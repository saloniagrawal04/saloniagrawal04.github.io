# Saloni Agrawal - Academic Website

A clean, minimal, professional academic website featuring a subtle black hole + galaxy background simulation.

## 🚀 Quick Start

1. **Local Testing**: Simply open `index.html` in your browser
2. **GitHub Pages Deployment**: 
   - Create a new repository named `<your-username>.github.io`
   - Upload all files to the repository
   - Enable GitHub Pages in Settings → Pages → Source: main branch
   - Your site will be live at `https://<your-username>.github.io`

## 📁 File Structure

```
saloni-academic-site/
├── index.html          # Main website file
├── styles.css          # All styling
├── script.js           # Background simulation + interactions
├── cv.pdf              # Your CV (replace with your own)
├── blog/               # Blog posts directory
│   └── (add your posts here)
└── README.md           # This file
```

## ✏️ How to Edit Content

### Update Personal Information

**In `index.html`:**

1. **Name & Tagline** (lines 35-37):
   ```html
   <h1 class="hero-title">Your Name</h1>
   <p class="hero-tagline">Your Research Areas</p>
   ```

2. **Bio** (lines 38-43):
   Edit the paragraph in the `.hero-intro` section

3. **Contact Links** (lines 45-49):
   Update email and GitHub URLs

### Add/Edit Research Projects

**In `index.html`** (lines 60-100):
- Each research card has a `data-research` attribute
- Edit the title, summary, and advisor name

**In `script.js`** (lines 350-450):
- Update the `researchDetails` object with full project descriptions
- Add new projects by adding entries to this object

### Update CV

1. Replace `cv.pdf` with your own PDF file
2. Keep the same filename, or update the links in `index.html` (lines 110-111)

### Edit Education Timeline

**In `index.html`** (lines 125-155):
- Each `.timeline-item` represents an entry
- Add more items by copying the structure
- Update dates, degrees, and coursework

### Add Blog Posts

1. Create a new HTML file in the `blog/` directory
2. Add a new blog card in `index.html` (lines 170-210)
3. Update the date, title, tag, and excerpt
4. Link to your new blog post file

## 🎨 Customization

### Change Colors

**In `styles.css`** (lines 8-17), edit the CSS variables:
```css
:root {
    --bg-primary: #0a0e1a;        /* Main background */
    --accent-primary: #60a5fa;     /* Primary accent color */
    --accent-secondary: #818cf8;   /* Secondary accent */
    /* ... more variables */
}
```

### Adjust Background Simulation

**In `script.js`** (lines 60-80):
- `numParticles`: Number of particles in accretion disk (default: 150)
- `numStars`: Number of background stars (default: 50)
- `blackHole.mass`: Gravitational strength (default: 1000)

To make the simulation more/less visible, edit `opacity` in `styles.css` line 42:
```css
#bg-simulation {
    opacity: 0.15;  /* Adjust between 0.1 - 0.3 */
}
```

### Change Fonts

**In `styles.css`** (line 20), replace the Google Fonts import:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

Then update the font variables (lines 13-15).

## 📝 Adding Blog Posts

### Create a Blog Post Template

Create `blog/your-post.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Post Title - Saloni Agrawal</title>
    <link rel="stylesheet" href="../styles.css">
    <style>
        .blog-post {
            max-width: 800px;
            margin: 100px auto;
            padding: 2rem;
        }
        .blog-post h1 {
            font-family: var(--font-serif);
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .blog-post p {
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="blog-post">
        <a href="../index.html#blog" style="color: var(--accent-primary);">← Back to Blog</a>
        <h1>Your Post Title</h1>
        <p class="blog-date">Date</p>
        
        <p>Your content here...</p>
        
        <!-- Add more content -->
    </div>
</body>
</html>
```

## 🔧 Technical Details

- **Pure HTML/CSS/JS**: No build process required
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Performance**: Lightweight, fast loading
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📊 Background Simulation Details

The homepage features a subtle black hole + accretion disk simulation:
- **Particles**: Orbit the central black hole with realistic gravitational physics
- **Stars**: Twinkling background stars
- **AGN Jets**: Subtle outflow lines from the black hole
- **Opacity**: Set to 15% to remain non-distracting

The simulation uses HTML5 Canvas and requestAnimationFrame for smooth 60fps animation.

## 🎯 SEO & Accessibility

- Semantic HTML5 elements
- Meta descriptions included
- Alt text for images (add your own images)
- ARIA labels where needed
- Proper heading hierarchy

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet/Mobile: ≤ 768px

## 🤝 Need Help?

If you need to make changes and get stuck:
1. Check the comments in each file (marked with `<!-- -->` in HTML, `/* */` in CSS/JS)
2. Use browser DevTools (F12) to inspect elements
3. Test changes locally before deploying

## 📄 License

Feel free to use this template for your own academic website!

---

**Built with:** HTML5, CSS3, JavaScript (Canvas API)  
**Inspired by:** NASA graphics, Caltech astrophysics pages, minimal portfolio design

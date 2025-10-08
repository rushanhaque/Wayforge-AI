# 🚀 Wayforge Deployment Guide

## 📋 Quick Access
- **Live Website**: `https://[your-username].github.io/wayforge` (will be available after deployment)
- **Repository**: `https://github.com/[your-username]/wayforge`

## 🌐 Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `wayforge`
4. Description: `AI-powered learning path generator with personalized pathways`
5. Make it **Public** (required for free GitHub Pages)
6. ✅ Check "Add a README file"
7. Click "Create repository"

### Step 2: Upload Your Files
**Option A: Using GitHub Web Interface (Easiest)**
1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL your project files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `questionnaire.html`
   - `questionnaire.css`
   - `questionnaire.js`
   - `learning-paths.html`
   - `learning-paths.css`
   - `learning-paths.js`
   - `server.js`
   - `package.json`
   - `api-client.js`
   - `dashboard.html`
   - All other HTML files
3. Scroll down, add commit message: "🚀 Initial upload of Wayforge learning platform"
4. Click "Commit changes"

**Option B: Using Git Commands (Advanced)**
```bash
# Navigate to your project folder
cd "D:\New folder\Wayforge"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "🚀 Initial upload of Wayforge learning platform"

# Add remote repository (replace [your-username] with your GitHub username)
git remote add origin https://github.com/[your-username]/wayforge.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch
6. Select "/ (root)" folder
7. Click "Save"
8. 🎉 Your website will be live at: `https://[your-username].github.io/wayforge`

### Step 4: Access Your Live Website
- **Main Website**: `https://[your-username].github.io/wayforge`
- **Questionnaire**: `https://[your-username].github.io/wayforge/questionnaire.html`
- **Learning Paths**: `https://[your-username].github.io/wayforge/learning-paths.html`
- **Dashboard**: `https://[your-username].github.io/wayforge/dashboard.html`

## 📱 Mobile & Device Access
Your website is fully responsive and works on:
- 📱 **Smartphones** (iOS & Android)
- 💻 **Tablets** (iPad, Android tablets)
- 🖥️ **Desktop computers** (Windows, Mac, Linux)
- 🌐 **All modern browsers** (Chrome, Firefox, Safari, Edge)

## 🔧 Backend Deployment (Optional)
For full functionality including AI-powered pathway generation:

### Heroku Deployment
1. Create account at [Heroku.com](https://heroku.com)
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. In your project folder:
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create wayforge-backend

# Deploy
git push heroku main
```

### Netlify Deployment
1. Go to [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy automatically

## 🎯 Share Your Website
Once deployed, anyone can access your website by visiting:
`https://[your-username].github.io/wayforge`

### Share Links:
- **Direct link**: Copy and paste the URL
- **QR Code**: Generate QR code for mobile access
- **Social media**: Share on LinkedIn, Twitter, etc.
- **Email**: Send the link to friends and colleagues

## 🛠️ Updates & Maintenance
To update your website:
1. Make changes to your local files
2. Upload new files to GitHub (replace existing ones)
3. Changes will automatically appear on your live website

## 🆘 Troubleshooting
- **404 Error**: Make sure `index.html` is in the root folder
- **Styling Issues**: Ensure all CSS files are uploaded
- **JavaScript Errors**: Check that all JS files are present
- **Mobile Issues**: Test on different devices and browsers

## 🎉 Success!
Your Wayforge learning platform is now live and accessible worldwide! 🌍

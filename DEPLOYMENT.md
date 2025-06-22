# Deploy React Frontend

## Prerequisites
1. Backend deployed to Render (get your backend URL)
2. GitHub account
3. Choose one of the deployment platforms below

## Quick Setup

### 1. Update Backend URL
Before deploying, you need your backend URL from Render. Replace `https://your-backend-service-name.onrender.com` in:
- `vercel.json` (line 24)
- `netlify.toml` (line 5)

## Deployment Options

## Option A: Deploy to Vercel (Recommended)

### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://your-backend-service-name.onrender.com`
7. Click "Deploy"

### Benefits:
- Free tier with generous limits
- Automatic deployments on git push
- Global CDN
- Custom domains

---

## Option B: Deploy to Netlify

### Steps:
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git"
4. Choose your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Update `netlify.toml` with your backend URL
7. Click "Deploy site"

### Benefits:
- Simple deployment process
- Form handling capabilities
- Edge functions support

---

## Option C: Deploy to GitHub Pages

### Steps:
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

---

## Option D: Deploy to Firebase Hosting

### Steps:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Configure:
   - Public directory: `build`
   - Single-page app: `Yes`
   - Overwrite index.html: `No`

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Environment Variables

For production, you need to set:
- `REACT_APP_API_URL`: Your backend URL from Render

### Platform-specific setup:

**Vercel**: Set in dashboard under "Environment Variables"
**Netlify**: Set in dashboard under "Site settings > Environment variables"
**GitHub Pages**: Create `.env.production` file (not recommended for sensitive data)

## Post-Deployment

### 1. Test Your Deployment
- Check that the frontend loads
- Test admin interface at `/admin`
- Verify API calls work with the backend

### 2. Update Backend CORS
Update your backend's `FRONTEND_URL` environment variable in Render with your new frontend URL.

### 3. Custom Domain (Optional)
All platforms support custom domains in their dashboard settings.

## Troubleshooting

### Build Errors:
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation
- Ensure environment variables are set

### API Connection Issues:
- Verify backend URL is correct
- Check CORS settings on backend
- Ensure backend is deployed and running

### Routing Issues (404 on refresh):
- Verify SPA redirects are configured
- Check that `netlify.toml` or `vercel.json` includes redirect rules

## Production Optimization

The build includes:
- Minified JavaScript/CSS
- Optimized images
- Source map generation disabled for security
- Gzip compression support

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Web Vitals)

---

## Quick Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend code pushed to GitHub
- [ ] Backend URL updated in deployment configs
- [ ] Deployment platform chosen and configured
- [ ] Environment variables set
- [ ] Frontend deployed and tested
- [ ] Backend CORS updated with frontend URL
- [ ] All endpoints tested through deployed frontend 
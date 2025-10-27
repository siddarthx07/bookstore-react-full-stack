# Railway Deployment Guide

This guide will help you deploy the Bookstore React Full-Stack application to Railway.

## Prerequisites

- A Railway account (sign up at https://railway.app)
- GitHub account (or another git hosting service)

## Overview

This application consists of:
- **Backend**: Java WAR application running on embedded Tomcat (via Grizzly)
- **Frontend**: React SPA that will be built and served by the backend
- **Database**: MySQL (or H2 for testing)

## Deployment Steps

### 1. Push Your Code to GitHub

First, commit all the changes made for Railway deployment:

```bash
git add .
git commit -m "Add Railway deployment support"
git push origin main
```

### 2. Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your `bookstore-react-full-stack` repository
5. Railway will automatically detect the Java application and begin deployment

#### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize Railway project
railway init

# Deploy
railway up
```

### 3. Configure Database

Add a MySQL database service:

1. In Railway dashboard, click "New" → "Database" → "MySQL"
2. Railway will automatically create a MySQL database
3. Railway automatically sets the `DATABASE_URL` environment variable

### 4. Configure Environment Variables

The application will automatically use environment variables when available. No additional configuration is needed!

However, you can verify that Railway has set:
- `DATABASE_URL`: Connection string to the MySQL database
- `PORT`: Port on which the application runs (automatically set by Railway)

### 5. Configure the Application URL

The application uses `proxy` in `package.json` pointing to `http://localhost:8080`. For production, you'll need to update the React app to use the Railway URL.

**Option A: Update API calls to use absolute URLs**

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=https://your-app.railway.app/api
```

And update the API calls in the React app to use `process.env.REACT_APP_API_URL`.

**Option B: Configure frontend to be built with the backend (Current Implementation)**

The current setup has the React app configured to be served by the Java backend at the context path `/SiddarthBookstoreReactTransact`.

### 6. Build the Frontend

Before deploying, you need to build the React frontend:

```bash
cd bookstore-react-full-stack/client
npm install
npm run build
```

This creates the `build` folder with the production-ready React app.

### 7. Copy Frontend Build to Backend

The build output needs to be copied to the backend's webapp directory:

```bash
cd bookstore-react-full-stack
cp -r client/build/* server/src/main/webapp/
```

## How the Application Works on Railway

### Database Initialization

The `DatabaseInitializer` servlet listener automatically:
- Creates database tables on first startup
- Inserts initial book and category data
- Handles both MySQL and H2 databases

### Database Connection

The `JdbcUtils` class automatically:
- Checks for `DATABASE_URL` environment variable
- Falls back to JNDI for traditional deployments
- Falls back to H2 in-memory database if nothing is configured
- Parses Railway's MySQL connection strings

### Port Configuration

Railway automatically sets the `PORT` environment variable. The application should use this port. You may need to configure your Java app to read from the `PORT` environment variable.

## Build Configuration

The `railway.json` file configures:
- **Builder**: NIXPACKS (automatically detects Java projects)
- **Build Command**: Runs Gradle build
- **Start Command**: Runs the WAR file with an embedded servlet container

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Database service added
- [ ] Environment variables configured (automatic)
- [ ] Frontend built with `npm run build`
- [ ] Build artifacts committed
- [ ] Deployment successful on Railway
- [ ] Application accessible via Railway URL

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Check that `DATABASE_URL` is set in Railway dashboard
2. Check Railway logs for connection errors
3. Verify MySQL service is running

### Port Issues

If the app doesn't start:
1. Check Railway logs for port binding errors
2. Ensure the app reads the `PORT` environment variable
3. Check if port 8080 is hardcoded somewhere

### Frontend Not Loading

If the React app doesn't load:
1. Verify the `client/build` folder is copied to `server/src/main/webapp`
2. Check if the context path matches (`/SiddarthBookstoreReactTransact`)
3. Check browser console for 404 errors

## Railway-Specific Features

### Automatic Deployments

Railway automatically deploys on every git push to the main branch.

### Health Checks

Railway checks `/health` endpoint by default. Consider adding one:

```java
@GET
@Path("/health")
@Produces(MediaType.TEXT_PLAIN)
public String health() {
    return "OK";
}
```

### Logs

View real-time logs in Railway dashboard:
- Application logs
- Build logs
- Database logs

## Environment Variables

The application supports these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | In-memory H2 |
| `DATABASE_USER` | Database username | `root` (MySQL) or `sa` (H2) |
| `DATABASE_PASSWORD` | Database password | Empty |
| `PORT` | Application port | 8080 |

## Cost Considerations

Railway offers:
- **Free tier**: $5 monthly credit
- **Hobby plan**: $20/month
- **Developer plan**: $20/month

The bookstore app typically fits within the free tier for development/testing.

## Production Considerations

For production deployments:

1. **Use MySQL**: Don't use H2 in production
2. **Configure SSL**: Use HTTPS with Railway's SSL certificates
3. **Monitor**: Set up monitoring and alerts
4. **Backup**: Configure database backups
5. **Scaling**: Configure scaling policies if needed

## Next Steps

1. Deploy the application to Railway
2. Test all features (browsing, cart, checkout)
3. Configure custom domain (optional)
4. Set up monitoring
5. Configure CI/CD for automatic deployments

## Support

- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/help
- GitHub Issues: Open an issue in the repository


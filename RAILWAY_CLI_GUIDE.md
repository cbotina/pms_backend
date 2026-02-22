# Railway CLI Guide - Database Connection Issues

## Problem: `ENOTFOUND mysql-k0ac.railway.internal`

When using `railway run` locally, Railway injects environment variables that include internal hostnames like `mysql-k0ac.railway.internal`. These hostnames only work within Railway's network, not from your local machine.

## Solutions

### Option 1: Use Railway Shell (Recommended)

Instead of running commands locally with `railway run`, connect to Railway's shell where the internal hostnames work:

```bash
# Connect to Railway shell
railway shell

# Once inside the shell, run your commands:
npm run seed:compiled
npm run reset:db:compiled
```

This runs the commands directly in Railway's environment where the database is accessible.

### Option 2: Use Railway Connect (Database Tunnel)

Tunnel the database connection to your local machine:

```bash
# In one terminal, create a tunnel to the database
railway connect mysql

# This will output connection details like:
# mysql://user:pass@localhost:3306/dbname

# In another terminal, set the connection variables and run your command
export DB_HOST=localhost
export DB_PORT=3306
# (Get DB_USERNAME, DB_PASSWORD, DB_NAME from Railway dashboard)
railway run npm run seed:compiled
```

### Option 3: Use Railway's Public Database URL

If Railway provides a public database connection string:

1. Go to Railway dashboard → Your database service → Connect
2. Copy the public connection string (if available)
3. Parse it and set environment variables:
   ```bash
   # Example if Railway provides: mysql://user:pass@public-host:3306/dbname
   export DB_HOST=public-host.railway.app
   export DB_PORT=3306
   railway run npm run seed:compiled
   ```

### Option 4: Run Commands via Railway Dashboard

1. Go to Railway dashboard → Your backend service
2. Click "Deployments" → Latest deployment
3. Use the "Shell" or "Terminal" option
4. Run commands directly there:
   ```bash
   npm run seed:compiled
   npm run reset:db:compiled
   ```

## Recommended Workflow

For seeding/resetting your staging database:

```bash
# 1. Connect to Railway shell (easiest method)
railway shell

# 2. Run your commands inside the shell
npm run seed:compiled
# or
npm run reset:db:compiled && npm run seed:compiled

# 3. Exit when done
exit
```

This avoids all connection issues because you're running commands directly in Railway's environment.

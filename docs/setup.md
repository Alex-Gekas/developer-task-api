# Set up Task API on a server

This guide explains how to install and run Task API on a Linux server.


## Prerequisites

Before installing Task API, make sure your environment includes:

* Node.js v18 or later
* npm v9 or later
* A Linux server or cloud instance (Ubuntu 20.04 or later recommended)
* SSH access to the server
* Git
* A domain name or static IP address (for production access)


# Step 1: Prepare the server

SSH into your server:

```
ssh your-user@your-server-ip
```

If Node.js is not installed, install it using your preferred method. Many server administrators use **nvm** to manage Node versions.

Verify the installation:

```
node -v
```

```
npm -v
```

Both commands should return version numbers.

# Step 2: Clone the repository

Clone the Task API repository:

```
git clone https://github.com/<your-repo>/developer-task-api.git
```

Navigate to the project directory:

```
cd developer-task-api
```

# Step 3: Install dependencies

Install the required Node.js packages:

```
npm install
```

`npm install` reads the `package.json` file and installs the dependencies required for the API to run.

The installation is successful if:

- the command completes without npm errors
- npm prints a summary such as `added 85 packages`
- a `node_modules` directory appears in the project folder

# Step 4: Configure environment variables

> [!NOTE]
> Environment variables allow configuration values to change between development
> and production environments without modifying the application code.

Task API uses environment variables for configuration.

Create a copy of the example configuration file:

```
cp .env.example .env
```

Open the file in an editor:

```
nano .env
```

Update the configuration values.

| Variable | Description |
|---------|-------------|
| PORT | Port the API listens on |
| JWT_SECRET | Secret used to sign JSON Web Tokens |
| JWT_EXPIRES_IN | Token expiration time |
| DB_PATH | Path to the SQLite database file |

## Generate a secure JWT secret

> [!IMPORTANT]
> In production, generate a strong random value for `JWT_SECRET`.
> Do not commit this value to version control.

Run:

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated string and paste it into the `.env` file.

Save the file and exit the editor.

# Step 5: Start the API

Start the server:

```
npm start
```

If the startup is successful, the server logs show that the API is listening on the configured port.

# Step 6: Verify the API

Use `curl` to confirm the API is running:


```
curl http://localhost:3000/health
```

Expected response:

```
{"status":"ok"}
```

This confirms the API is running and responding to requests.

# Step 7: Run the API with PM2 (recommended)
[!TIP]
For production environments, use a **process manager** to keep the API running if the application crashes or the server restarts.

**PM2** manages the Node.js process in the background. It automatically restarts the application if it stops unexpectedly.

In many production deployments, a Node.js application typically runs behind a reverse proxy, like Nginx. PM2 is responsible for keeping the Node process alive and ensuring it runs smoothly.

Install PM2 globally:

```
npm install -g pm2
```
Start the application with PM2:

```
pm2 start npm --name task-api -- start
```
Verify that the process is running:

```
pm2 status
```
To ensure the API starts automatically after a reboot:

```
pm2 startup
```
```
pm2 save
```
# Next steps

You can now begin using the API.

- See [**Authentication Guide**](authentication-guide.md) to generate a token
- See [**API Reference**](api-reference.md) for endpoint details
- Use Postman or another REST client to test requests
---
title: Environment Setup for Windows
authors: Phuc Khang
contributors: Hoang Nguyen
description: Guide to setup environment that is ready for group project for Windows (Git, Github, VSCode, Node.js, React.js, MongoDB).
date: 03-02-2025
tags: setup, tools
banner: https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Unofficial_Windows_logo_variant_-_2002%E2%80%932012_%28Multicolored%29.svg/170px-Unofficial_Windows_logo_variant_-_2002%E2%80%932012_%28Multicolored%29.svg.png
---

## Git and Github setup

### Git setup

1. **Downloading and installing the latest version of Git:**

   Link: https://git-scm.com/downloads

2. **Checking to see if Git is installed:**

   1. Go to your command prompt.
   2. Use the command: `git -v` or `git version`.
   3. On your display:

      1. If the currently installed version of Git is displayed, Git is installed!

         ![Git is installed!](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin1_nl3etp.png)

         Git is installed!

      2. Else if the error “'git' is not recognized as an internal or external command, operable program or batch file.” is met, go to step 3.

         ![Error, go to step 3!](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin2_opvjp3.png)

         Error, go to step 3!

3. **Setting up system environment variables for git**

   1. In the Start Menu or taskbar search, search for "environment variable".
   2. Select "Edit the system environment variables".

      ![Click on this!](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin3_ubuut7.png)

      Click on this!

   3. Click the "Environment Variables" button at the bottom.

      ![How it should look like](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin4_egsihy.png)

      How it should look like

   4. Double-click the "Path" entry under "System variables".
   5. With the "New" button in the PATH editor, add:
      1. C:\Program Files\Git\bin\
      2. C:\Program Files\Git\cmd\
   6. Close and re-open your console.
   7. Re-do step 2 to check if Git has been installed.

### GitHub Setup

You can find GitHub at https://github.com/

1. **Create an account and sign in**
2. **Creating basic repository:**

   1. Click on the “New” button on the top left corner of the screen.
   2. Provide a name and description to your repository, and you could either make it public or private.
   3. In your newly created repository, click on the green “Code” button to retrieve the repository’s URL.

      ![Copy this HTTPS URL](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin5_lspi3d.png)

      Copy this HTTPS URL

3. **Setting up your repository on your local device:**

   1. Go into your preferred IDE (VSCode, Eclipse,...)
   2. Launch a terminal, preferably Git Bash
   3. Use the command `git-credential-manager.exe github login` to connect your git to GitHub.

      ![Log in through this pop-up](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981789/gitwin6_nreog3.png)

      Log in through this pop-up

   4. Use the command `git clone [your repository’s URL]` to create a local version of your repository.

      ![image.png](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981788/gitwin7_nbetpe.png)

Use the command `cd [your working directory]` (example: “cd Bondscape” if your directory is named Bondscape) to start working.

## VScode

### Downloading and installing the lastest version of VSCode

1. Link: https://code.visualstudio.com/download
2. Installation reminder: When prompted, tick off all of these configuration options during the installation:
   - Create a desktop icon
   - Add “Open with Code” action
   - Register Code as an editor for supported file types
   - Add to PATH

### Recommended extension

- **Git Blame** – Shows who last modified each line of code in real time.
- **GitHub Copilot** – AI-powered coding assistant that suggests code completions and snippets.
- **Material Icon Theme** – Adds modern and visually appealing icons for files and folders in VS Code.
- **Tailwind CSS IntelliSense** – Provides autocompletion, syntax highlighting, and linting for Tailwind CSS.
- **Babel JavaScript** – Enhances JavaScript and JSX syntax highlighting with Babel support.
- **Bracket Pair Color / Bracket Pair Colorization** – Colors matching brackets to improve readability in nested code.
- **ES7+ React/Redux/GraphQL/React-Native Snippets** – Adds useful snippets for React, Redux, and GraphQL development.
- **Git Graph** – Visualizes Git history and branches in an interactive graph view.
- **Live Server** – Launches a local development server with live reloading for HTML, CSS, and JavaScript files.
- **Live Share** – Enables real-time collaboration by allowing developers to share their code environment.
- **Prettier Code Formatter** – Automatically formats code for consistent styling across projects.

## Node.js and Express.js

### Node.js Setup

1. **Downloading and installing the latest version of Node.js:**

   Link: https://nodejs.org/en/download

2. **Checking to see if Node is installed:**

   1. Go to your command prompt.
   2. Use the command: `node -v`.

      ![Node is installed!](https://res.cloudinary.com/dnbjqryir/image/upload/v1740981488/node_clcjzy.png)

      Node is installed!

   3. If the currently installed version of Node is displayed, Node is installed!

### Express.js Setup

1. **Creating a package.json file for your application:**

   `npm init`

2. **Installing Express**

   `npm install express`

   Express should be installed!

## Creating a React Project

1. **Make sure all the prerequisites are installed**

   1. Node.js: `node -v`
   2. npm: `npm -v`

   If either of these 2 or both of the prerequisites are not met, go back to previous guides.

2. **Create the React project**
   1. Run the command: `npm create vite@latest [project's name] -- --template react`
   2. Navigage to project folder: `cd [project's name]`
   3. Install all dependencies: `npm install`
   4. Start the project: `npm run dev`

## MongoDB Backend Setup

1. **Downloading and setup MongoDB**

   1. Create an account and log in through: https://www.mongodb.com/cloud/atlas/register
   2. Click on “Build a Database” and create a cluster using the free tier.
   3. Set up a username and a password for our connection.

      ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978796/mongo1_jssfmq.png)

   4. Provide our current IP Address, or use the IP `0.0.0.0/0` to connect to the database.

      ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978796/mongo2_g9h9iv.png)

      ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978796/mongo3_sjwuvo.png)

   5. Once the IPs have in input, click “connect” and connect using Drivers.

      ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978797/mongo4_gap4mb.png)

   6. Once you have clicked on “Drivers”, you can get the MongoDB connection URL from below:

      ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978797/mongo5_nkfkog.png)

      Copy the URL and follow the next few steps!

2. **Setting up working directory for application’s backend:**

   1. Create a folder for the backend: `mkdir backend`
   2. Navigate to backend folder: `cd backend`
   3. Create configure file: `npm init -y`
   4. Install mongoose MongoDB and other dependencies:

      `npm install dotenv express mongoose mongodb`

   5. Create an index.js file in your backend directory.

3. **Setting up the server:**

   Within your `index.js` file, input the following code:

   ```jsx
   import express from 'express';
   import mongoose from 'mongoose';
   import dotenv from 'dotenv';

   dotenv.config();
   const app = express();

   app.use(express.json());

   // PORT should be chosen and stored as an environment variable.
   const PORT = process.env.PORT || 8080;

   // process.env.MONGO_URL should be retrieved from your MongoDB console
   // and stored as an environment variable.
   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGO_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       });
       console.log(`MongoDB Connected`);
     } catch (error) {
       console.error(`Error: ${error.message}`);
       process.exit(1);
     }
   };

   connectDB();

   app.listen(PORT, console.log(`Successfully connect to port ${PORT}`));
   ```

   Your Express and MongoDB server is up!

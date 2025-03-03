---
title: Environment Setup for MacOS
author: Hoang Nguyen
contributors: Phuc Khang
description: Guide to setup environment that is ready for group project for MacOS (Git, Github, VSCode, Node.js, React.js, MongoDB).
date: 03-02-2025
tags: technical
banner: https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mac-logo-design-template-8fe7b3dedb88be5575e790e208c17b25_screen.jpg?ts=1662442689
---

## Homebrew

> [Homebrew](https://workbrew.com/blog/what-is-homebrew#) is a popular open-source package manager, primarily used on macOS (but also on Linux).

To easy to understand,

> Homebrew installs [**the stuff you need**](https://formulae.brew.sh/formula/) that Apple (or your Linux system) didn’t.

To install:

- Go to https://brew.sh/
- Copy the command and paste to terminal, then run it to install Homebrew. It will require to enter your password and hit `enter` to resume the process, keep your eyes in the terminal.

![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740976377/Screenshot_2025-03-02_at_11.32.54_PM_okva4g.png)

- Once finished, you can test if the Homebrew successfully install by the command: `brew --version`
  - If the version is shown, it mean the Homebrew is successfully install
    ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978026/Screenshot_2025-03-03_at_12.00.17_AM_yjiamz.png)
  - otherwise, it failed.

## Git and Github setup

### Setup local git

⚠️ prequisite: Homebrew install

**To install git:**

- run this in terminal: `brew install git`
- Once finished, check if it’s installed successfully: `git --version`
  - If the version is shown, it mean the git is successfully install
    ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978026/Screenshot_2025-03-03_at_12.00.17_AM_yjiamz.png)
  - otherwise, it failed

Set up git config

- Setting the commit author, which records who made changes in the repository.
- To config local git, you run those command:
  - set name: `git config --global user.name "Your Name"`
  - set email: `git config --global user.email "yourEmail@example.com”`
- if you wanna check your current name and email
  - check name: `git config --global user.name`
  - check email: `git config --global user.email`

### Setup github account

⚠️ prequisite: Create a github account if you don’t have in https://github.com/

1. Create personal token:

   GitHub offers two authentication options, HTTPS and SSH, to keep your work secure. This is a security measure that prevents anyone who isn’t authorized from making changes to your GitHub repository. In this guide, we will use HTTPS.

   - To authenticate yourself in the terminal (local machine), you will need to generate a *Personal Access Token* on GitHub. Navigate to GitHub’s article on [creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) and follow the instructions for creating a classic token. Be sure to check the box that grants the token `repo` scope — this will allow you to write to the repository from the terminal on your machine.

   💡 Once you get the token, make sure to copy it or keep the page open — you will not be able to view the token again once you navigate away from the page and you’ll need it later in the instructions!

2. Create a repository on GitHub and then link it to a local repository on your computer:

   On GitHub (github.com), create a new repository by clicking the **`New repository`** button on the home page.

   ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978795/gitmac1_zuzo0v.svg)

   On the new repository page, give your repository a name. It’s not necessary, but it would be convenient to name it the same as the directory, **git_practice**. After naming the repository, click **Create repository**.

   ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978795/gitmac2_vwmjnk.png)

   After creating a repository, GitHub displays the repository page. At the top of the page, make sure “HTTPS” is selected

   ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978795/gitmac3_ffwn4k.png)

   The repository is empty, so it’s time to connect it to your existing work.

   Copy the Git commands on the GitHub page, under the title “…or create a new repository on the command line”, and paste them into your Command Line Interface.

   Running these commands will add the remote repo to your local machine and make a first change to the remote repository.

   When asked for a username and password, type in your GitHub `username` as the username and paste your `personal access token` as the password, pressing Enter (or return) after each. Don’t be alarmed if you can’t see the characters you are typing, they are intentionally hidden as a security measure.

   ![](https://res.cloudinary.com/dnbjqryir/image/upload/v1740978796/gitmac4_b2zfzn.png)

## VScode

### Download and setup VScode

- To install VScode, follow this guide: [install VScode for mac](https://code.visualstudio.com/docs/setup/mac#_install-vs-code-on-macos)
- to enable `code .` : [Configure the path with VSCode](https://code.visualstudio.com/docs/setup/mac#_configure-the-path-with-vs-code)

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

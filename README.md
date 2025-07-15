# Viet Tech Mentorship Program

## Project Description

Viet Tech Mentorship Program (VTMP) is initiative that seeks to build a sustainable pipeline of early career talent and empower Vietnamese students to break into the tech industry. This codebase serves as a platform that provides resources, tools, and a supportive community to facilitate effective mentorship and professional development.

## Architecture

This project is a monorepo consisting of two main components:

- **web:** A backend server built with Node.js, TypeScript, and Express. It provides APIs for user authentication, data management, and other server-side functionalities.
- **web-client:** A frontend application built with React. It provides a user interface for accessing the platform's features, including browsing mentors, scheduling sessions, and accessing learning resources.

## Setup Instructions

1.  **Install Node.js:** Make sure you have Node.js (version 16 or higher) installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2.  **Install Yarn:** This project uses Yarn as the package manager. You can install it following the instruction [here](https://yarnpkg.com/getting-started/install)

3.  **Clone the repository:** Clone this repository to your local machine using Git

```bash
git clone git@github.com:khoa165/vtmp.git
```

4.  **Configure environment variables:**

- For the web application, create a `.env` file in the `web` directory and configure the necessary environment variables, such as database connection details and API keys. You can refer to `.env.example` in the `web` directory.
- For the web-client application, create a `.env` file in the `web-client` directory and configure the necessary environment variables, such as API endpoints and authentication settings. You can refer to `.env.example` in the `web-client` directory.

5.  **(Optional) Configure Git default push**: For convenient Git usage, do the following steps

    5.1. Open .git/config file

    ```
    code .git/config
    ```

    5.2. Add the following config at file's root level (don't touch anything else)

    ```
    [push]
        default = current
    ```

    5.3. After git add and git commit, simply run

    ```
    git push
    ```

    This will push your local branch to a remote branch with the same name

## Running the Application

### Without Docker

```bash
yarn pp
yarn dev
```

### With Docker

- Make sure you have Docker Desktop installed and running.
- From repo root. After the first time, you won't need the `--build` flag:

#### To run without local Mongo container (use the cloud Mongo):

```
docker compose up --build
```

- This will start the application on `http://localhost:3000` and the server on `http://localhost:8000`.
- Note that for this command to work, ensure web/.env have a valid MONGO_URI string (a valid cloud Mongo Atlas URI).

#### To run with local Mongo container (instead of the cloud Mongo):

```
docker compose --profile local_mongo up
```

- This will start the application on `http://localhost:3000`, the server on `http://localhost:8000` and Mongo database on `http://localhost:27017`
- Note that for this command to work, ensure web/.env have:
  `MONGO_URI=mongodb://mongo:27017/vtmp-db?replicaSet=rs0`

##### Inspecting local Mongo container:

- To connect to the local mongo container and inspect data, first download MongoDB Compass: https://www.mongodb.com/try/download/compass
- After installation, in the GUI, create a connection to `mongodb://localhost:27017`
- To stop the containers, `Ctrl + C` from the terminal. If you want to delete the containers, use:

```
docker compose down
```

### Seeding Mongo Database:

To seed the database:

- If using the cloud MongoDB (Mongo Atlas), ensure web/.env have a valid MONGO_URI string (a valid cloud Mongo Atlas URI).
- If running the local Mongo container, ensure web/.env have:
  `MONGO_URI=mongodb://mongo:27017/vtmp-db?replicaSet=rs0`

Then, from root, run:

```
yarn seed
```

## Contributing

We welcome contributions to the VTMP project! To contribute, please follow these guidelines:

1. **Find an issue**: check with Khoa or browse [here](https://github.com/khoa165/vtmp/issues)
2. **Create a branch:** Create a new branch for your feature or bug fix.
3. **Make changes:** Make your changes and commit them with clear, concise commit messages.
4. **Test your changes:** Make sure your changes are working correctly and that you have added appropriate tests.
5. **Submit a pull request:** Submit a pull request to the `main` branch of this repository.

Please adhere to the project's coding standards and follow the pull request process.

## Blog

1. **Create a new blog**: Use the following command to generate a boilerplate for your new blog

```
yarn cc
```

2. **Enter title and date**: You will be prompted to input title and date for blog

3. **Add blog content**: Once the file is generated, add blog content and modify the metadata header

4. **Update metadata**: Run the following command when you first create a blog or whenever you make change to the metadata header of an existing blog

```
yarn run generate-data
```

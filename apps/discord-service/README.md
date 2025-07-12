# discord-service

## Production deployment

- It is currently deployed on Render at https://vtmp-discord-service.onrender.com/

- The secrets for production is in `.env.prod` file

## Local development

- Create an .env file, copy and paste everything from the `.env.example` file.
- Run `docker compose up --build`
- The test/local dev bot is live on localhost:4000 or at https://expert-evolving-bengal.ngrok-free.app/ (which is a permanent static domain given by Ngrok).
- How it works: for this local test bot to work with Discord webhook and our local dev environment, Discord needs to be able to send webhook to a public domain URL. Because of that, registering `http://localhost:4000` won't work. Using reverse tunneling with Ngrok is the solution for that. With Ngrok (the container for it is alreadys setup in docker-compose.yml), everytime the local container for discord-service is up, a tunnel is established between `http://localhost:4000` and the permanent domain https://expert-evolving-bengal.ngrok-free.app/ . When a webhook event is sent by Discord server, it first hits the subcribed URL https://expert-evolving-bengal.ngrok-free.app/ . Then, with the help of Ngrok reverse tunnelling, the event is forwarded to dev's machine `http://localhost:4000` . This would help developers on the team to be able to debug and extend features more efficiently.

### Steps to add the bot to your server/channel for testing:

- Create your own Discord server
- Click on this link to invite this `VTMP DevTest` bot: https://discord.com/oauth2/authorize?client_id=1378499044154019922&permissions=0&integration_type=0&scope=bot+applications.commands
- Try using slash commands like `/ping` or `/s` (will autocomplete).

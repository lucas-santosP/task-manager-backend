#  Lucid Task - Personal Task Manager (Backend)

<img src="https://raw.githubusercontent.com/lucas-santosP/task-manager/main/src/assets/images/logo.png" alt="Lucid Task Logo"/>

This is the backend of the app, the frontend can be found on [this repository](https://github.com/lucas-santosP/task-manager-frontend). 


# Built with

- Node.js
- Express
- Typescript
- Docker
- MongoDB (Mongoose)

# Setup

Create a file in the root folder named .env and type:
```
ACCESS_TOKEN_SECRET=<your-token-secret>
```

docker compose command:

```
make up
make down
docker logs -f api
```

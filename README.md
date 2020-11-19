# Roam (Server)

This is the backend code for Roam, an app to help disabled people find locations that are accesible for their needs..

- [Link to live app](https://roam.vercel.app/)
- [Link to repo](https://github.com/conorkenahan/roam)

## API Documentation

### Recipes Endpoints

#### Auth Endpoints

- ##### /api/auth/login

- POST - login user

#### User Endpoints

- ##### /api/user/

- POST - create new user

##### /api/user/userid

- GET - get user ID

#### Reviews Endpoints

- ##### /api/reviews

- POST - create new review
- DELETE - delete review

- ##### /api/reviews/by_user

- GET - get all reviews by user ID

- ##### /api/reviews/:placeid

- GET - get all reviews by place ID

## Technology Stack

### Backend

- Express for handling API requests
- Node for interacting with the file system
- Knex.js for interfacing with the PostgreSQL database
- Postgrator for database migration
- Mocha, Chai, Supertest for endpoints testing
- JSON Web Token, bcryptjs for user authentication / authorization

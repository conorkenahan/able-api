const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

const { requireAuth } = require("../middleware/jwt-auth");

usersRouter
  .get("/", requireAuth, (req, res, next) => res.json(req.user))
  .post("/", jsonBodyParser, (req, res, next) => {
    const { password, username, name, email } = req.body;

    for (const field of ["name", "username", "password", "email"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    // TODO: check username doesn't start with spaces

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(req.app.get("db"), username)
      .then((hasUserWithUserName) => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            username,
            password: hashedPassword,
            name,
            email,
            date_created: "now()",
          };

          return UsersService.insertUser(req.app.get("db"), newUser).then(
            (user) => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  });

// possible to get username from backend using auth token?
// usersRouter.get("/username", jsonBodyParser, requireAuth, (req, res) => {
//   res.send("test");
// });

module.exports = usersRouter;

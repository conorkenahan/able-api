const express = require("express");
const ReviewsService = require("./reviews-service");

const { requireAuth } = require("../middleware/jwt-auth");

const reviewsRouter = express.Router();
const jsonBodyParser = express.json();

reviewsRouter.route("/by_user").get(requireAuth, (req, res, next) => {
  ReviewsService.getAllReviewsByUser(
    req.app.get("db"),
    req.user.id
  ).then((reviews) => res.json(reviews));
});

reviewsRouter.route("/:placeid").get((req, res, next) => {
  ReviewsService.getReviewsByPlaceId(
    req.app.get("db"),
    req.params.placeid
  ).then((reviews) => res.status(201).json(reviews));
});

// reviewsRouter.route("/:username").get((req, res, next) => {
//   ReviewsService.getUserId(req.app.get("db"), req.params.username).then(
//     (id) => {
//       userid = id.id;
//       ReviewsService.getAllReviewsByUser(req.app.get("db"), userid).then(
//         (reviews) => {
//           // res.json(reviews);
//           res.status(201).json(reviews);
//         }
//       );
//     }
//   );
// });

reviewsRouter.route("/").post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { placeid, season, timeofday, reviewbody, rating } = req.body;
  const userid = req.user.id;
  const username = req.user.username;
  let newReview = {
    placeid,
    userid,
    username,
    season,
    timeofday,
    reviewbody,
    rating,
  };
  ReviewsService.insertReview(req.app.get("db"), newReview).then((review) => {
    res.status(200);
  });
  for (const [key, value] of Object.entries(newReview))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
});

module.exports = reviewsRouter;

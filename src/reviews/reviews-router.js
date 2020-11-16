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

reviewsRouter.route("/").post(requireAuth, jsonBodyParser, (req, res, next) => {
  const {
    placeid,
    placename,
    season,
    timeofday,
    reviewbody,
    rating,
  } = req.body;
  const userid = req.user.id;
  const username = req.user.username;
  let newReview = {
    placeid,
    placename,
    userid,
    username,
    season,
    timeofday,
    reviewbody,
    rating,
  };
  ReviewsService.insertReview(req.app.get("db"), newReview).then((review) => {
    res.json(review);
    res.status(200);
  });
  for (const [key, value] of Object.entries(newReview))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
});

reviewsRouter
  .route("/")
  .delete(requireAuth, jsonBodyParser, (req, res, next) => {
    const { reviewid } = req.body;
    const userid = req.user.id;
    let reviewToDelete = { reviewid, userid };
    ReviewsService.deleteReview(req.app.get("db"), reviewToDelete).then(() => {
      res.status(204).end();
    });
    for (const [key, value] of Object.entries(reviewToDelete))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
  });

module.exports = reviewsRouter;

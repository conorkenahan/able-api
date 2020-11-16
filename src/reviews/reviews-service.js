const ReviewsService = {
  getReviewsByPlaceId(knex, placeid) {
    return knex.select("*").from("reviews").where({ placeid });
  },
  getReviews(knex, placeid) {
    return knex.select("*").from("reviews").where({ placeid });
  },
  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into("reviews")
      .returning("*")
      .then((review) => {
        return review[0];
      });
  },
  getAllReviewsByUser(knex, userid) {
    return knex.select("*").from("reviews").where({ userid });
  },
  deleteReview(knex, reviewToDelete) {
    return knex("reviews")
      .where("id", reviewToDelete.reviewid)
      .andWhere("userid", reviewToDelete.userid)
      .delete();
  },
};

module.exports = ReviewsService;

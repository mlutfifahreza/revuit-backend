const router = require('express').Router();
const Review = require('../models/review.model');

router.route('/').get((req, res) => {
  Review.find()
    .then(reviews => res.json(reviews))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.image;
  const likes = Number(req.body.likes);
  const date = Date.parse(req.body.date);

  const newReview = new Review({
    username,
    title,
    description,
    image,
    likes,
    date,
  });

  newReview.save()
  .then(() => res.json('Review added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Review.findById(req.params.id)
    .then(review => {

      res.json(review);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/like').post((req,res) =>{
  Review.findOneAndUpdate({_id : req.params.id},{$inc: {likes: 1}},{new : true})
    .then(review => {
      res.json("Liked!");
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res) => {
  Review.findByIdAndDelete(req.params.id)
    .then(() => res.json('Review deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Review.findById(req.params.id)
    .then(review => {
      review.username = req.body.username;
      review.title = req.body.title;
      review.description = req.body.description;
      review.image = req.body.image;
      review.likes = Number(req.body.likes);
      review.date = Date.parse(req.body.date);

      review.save()
        .then(() => res.json('Review updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
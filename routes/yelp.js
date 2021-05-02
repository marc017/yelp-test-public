const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const config = require('config');
const yelp = require('yelp-fusion');
const vision = require('@google-cloud/vision');
const googleCredentials = require('../api-credentials/google.json');

const yelpClient = yelp.client(config.get('API_KEY'));


const searchBusiness = async (searchParams) => {
  return new Promise((resolve, reject) => {
    
    yelpClient.businessMatch({
      name: searchParams.name,
      address1: searchParams.address1 || "6955 Mission St",
      address2: searchParams.address2 || "",
      address3: searchParams.address3 || "",
      city: searchParams.city || "Daly City",
      country: searchParams.country || "US",
      state: searchParams.state || "CA",
    })
      .then(res => {
        console.log('succes', res.body);
        resolve(res.jsonBody.businesses[0]);
      })
      .catch(err => {
        console.log('error', err);
        reject(err)
      })
  });
};

const getReviews = (businessId) => {
  return new Promise((resolve, reject) => {
    yelpClient.reviews(businessId)
      .then(res => {resolve(res.jsonBody)})
      .catch(err => reject(err));
  });
}

const getVision = async (review) => {
  const visionClient = new vision.ImageAnnotatorClient();
  const result = await visionClient.faceDetection(review.user.image_url);
  if (result.length > 0) {
    return {
      joyLikelihood: result[0].faceAnnotations[0].joyLikelihood, 
      sorrowLikelihood: result[0].faceAnnotations[0].sorrowLikelihood, 
      angerLikelihood: result[0].faceAnnotations[0].angerLikelihood,
      surpriseLikelihood: result[0].faceAnnotations[0].surpriseLikelihood
    };
  } else {
    return null;
  }
}

const mapVisions = async (reviews) => {
  for (let i = 0; i < reviews.length; i++) {
    const vision = await getVision(reviews[i]);

    reviews[i].user.emotions = vision;
  } 

  return reviews;
}

router.post('/business/reviews', async (req, res) => {
  try {
    const params = {
      ...req.body
    }
    const searchResult = await searchBusiness(params);
    let reviews = await getReviews(searchResult.id);
    if (reviews) {
      reviews = reviews.reviews;
    }
    reviews = await mapVisions(reviews);

    res
      .status(200)
      .json({ status: 'success', data: reviews, statusCode: 200});
  } catch (error) {
    logger.error('YELP SEARCH [POST]: ' + error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;

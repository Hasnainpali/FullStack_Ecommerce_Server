const { ProductReview } = require("../model/ProductReview");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    let Review =[]
  try {
      if(req.query.productId !==undefined && req.query.productId !== null && req.query.productId !== ""){
         Review = await ProductReview.find({productId: req.query.productId})
      }else{
        Review = await ProductReview.find()
      }

    if (!Review) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(Review);

  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get('/:id', async (req, res) =>{
    const review =  await ProductReview.findById(req.params.id);

    if(!review){
        res.status(500).json({msg:"The Review with the given ID was not found"})
    }
    return res.status(200).send(review)
});

router.post("/add", async (req, res) => {
  try {
    let review = new ProductReview({
      productId: req.body.productId,
      customerName: req.body.customerName,
      customerId: req.body.customerId,
      Review: req.body.Review,
      customerRating: req.body.customerRating,
    });
 
    if(!review){
        res.status(500).json({error:err, success:false})
    }

    review = await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;

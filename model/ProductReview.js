const mongoose = require('mongoose');

const ProductReviewSchema = mongoose.Schema({
    productId:{
        type:String,
        required:true,
    },
    customerName: {
          type:String,
          required:true
    },
    customerId:{
        type:String,
        required:true,
    },
    Review:{ 
       type:String,
       required:true
    }, 
    customerRating:{
        type:Number,
        required:true,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    },

})

ProductReviewSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
ProductReviewSchema.set('toJSON',{
    virtuals : true,
});

exports.ProductReview = mongoose.model("ProductReview",ProductReviewSchema)
exports.ProductReviewSchema = ProductReviewSchema;
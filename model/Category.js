const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    images:[
        {
          type:String,
          required:true
        }
    ],
})

CategorySchema.virtual('id').get(function (){
    return this._id.toHexString();
});
CategorySchema.set('toJSON',{
    virtuals : true,
});

exports.Category = mongoose.model("Category",CategorySchema)
exports.CategorySchema = CategorySchema;
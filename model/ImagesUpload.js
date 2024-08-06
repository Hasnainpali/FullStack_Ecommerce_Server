const mongoose = require('mongoose');

const ImagesUploadSchema = mongoose.Schema({
    
    images:[
        {
          type:String,
          required:true
        }
    ],
    
})

ImagesUploadSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
ImagesUploadSchema.set('toJSON',{
    virtuals : true,
});

exports.ImageUpload = mongoose.model("ImageUpload",ImagesUploadSchema)
exports.ImagesUploadSchema = ImagesUploadSchema;
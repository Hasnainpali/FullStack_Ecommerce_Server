const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
    customerName: { type: String, default: "" },
    productDetail: { type: Array, default: [] },
    email:{type:String, default:""},
    userId: { type: String, default: "" },
     paymentDetails:{
        paymentId: { type: String, default: "" },
        paymentStatus: { type: String, default: "" },
        payment_method_type:{type: Array},
     },
     shippingAddress: {
        fullName: { type: String, default: "" },
        addressLine1: { type: String, default: "" },
        addressLine2: { type: String },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" }, 
      },
    status:{type:String, default:"Pending"},
    totalAmount: { type: Number, default: "" },
    createdAt: { type: Date, default: Date.now },
})

OrdersSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
OrdersSchema.set('toJSON',{
    virtuals : true, 
});

exports.Orders = mongoose.model("Orders",OrdersSchema)
exports.OrdersSchema = OrdersSchema;
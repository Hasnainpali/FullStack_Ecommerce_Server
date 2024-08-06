const { Carts } = require("../model/Carts.js");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const cartList = await Carts.find(req.body)

    if (!cartList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(cartList);

  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/add", async (req, res) => {
  try {
    const existingCart = await Carts.find({
      productId: req.body.productId,
      userId: req.body.userId
    });

    if (existingCart.length > 0) {
      return res.status(409).json({ error: true, msg: "This product is already in the cart for this user" });
    }

    let cartItem = new Carts({
      productTitle: req.body.productTitle,
      images: req.body.images,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
      size: req.body.size,
      ram: req.body.ram
    });

    cartItem = await cartItem.save();
    res.status(201).json(cartItem);

  } catch (error) {

    res.status(500).json({ error: error.message, success: false });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Carts.findById(req.params.id);
    if(!cartItem){
        res.status(404).json({msg:"The cart item given is is not found"})
    }
    
    const deleteItem = await Carts.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res
        .status(404)
        .json({ message: "Cart Item not Found", status: false });
    }

    res.status(200).send({ status: true, message: "Cart Item Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cartList = await Carts.findByIdAndUpdate(
      req.params.id,
      {
      productTitle: req.body.productTitle,
      images: req.body.images,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
      size: req.body.size,
      ram:req.body.ram
      },
      { new: true }
    );

    if (!cartList) {
      return res
        .status(500)
        .json({ message: "Cart Item cannot be updated", success: false });
    }

    res.send(cartList);
  } catch (error) {
    res.status(500).json({ message: "Error while updating category" });
  }
});



module.exports = router;

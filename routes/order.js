const { Orders } = require("../model/Orders.js");
const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 7;
    const totalPosts = await Orders.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return res.status(404).json({ message: "Page Not Found" });
    }

    const orderList = await Orders.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!orderList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({
      orderList,
      totalPage,
      page,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res
        .status(500)
        .json({ message: "This Order with the given ID was not Found" });
    }
    return res.status(200).send(order);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
  
    const deleteOrder = await Orders.findByIdAndDelete(req.params.id);
    if (!deleteOrder) {
      return res
        .status(404)
        .json({ message: "Order not Found", status: false });
    }

    res.status(200).send({ status: true, message: "Order Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting Order" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const order = await Orders.findByIdAndUpdate(
      req.params.id,
      {
        status:req.body.status
      },
      { new: true } 
    );

    if (!order) {
      return res
        .status(500)
        .json({ message: "Order cannot be updated", success: false });
    }

    res.send(order);
  } catch (error) {
    res.status(500).json({ message: "Error while updating category" });
  }
});
module.exports = router;

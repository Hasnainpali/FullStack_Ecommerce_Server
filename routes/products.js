const { Product } = require("../model/Products.js");
const { Category } = require("../model/Category.js");
const express = require("express");
const router = express.Router();
const pLimit = require("p-limit");
const multer = require("multer");
const fs = require("fs");
const { ImageUpload } = require("../model/ImagesUpload.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_name,
  api_key: process.env.cloudinary_Config_API_key,
  api_secret: process.env.cloudinary_Config_API_secret,
  secure: true,
});
let imagesArr = [];
let categoryEditId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = [];
  try {
    for (let i = 0; i < req.files.length; i++) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };
      const result = await cloudinary.uploader.upload(
        req.files[i].path,
        options
      );
      imagesArr.push(result.secure_url);
      fs.unlinkSync(`uploads/${req.files[i].filename}`);
    }
    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error uploading images" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await Product.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return res.status(404).json({ message: "Product not Found" });
    }
    let productList = [];
    if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined) {
      productList = await Product.find({ catID: req.query.catID }).populate(
        "category"
      );

      const filterProducts = productList.filter((product) => {
        if (
          req.query.minPrice &&
          product.price < parseInt(+req.query.minPrice)
        ) {
          return false;
        }
        if (
          req.query.maxPrice &&
          product.price > parseInt(+req.query.maxPrice)
        ) {
          return false;
        }
        return true;
      });
      if (!productList) {
        res.status(500).json({
          success: false,
        });
      }
      return res.status(200).json({
        productList: filterProducts,
        totalPage: totalPage,
        page: page,
      });
    } else { 
        productList = await Product.find(req.query).populate("category")

        if (!productList) {
          res.status(500).json({
            success: false,
          });
        }
        return res.status(200).json({
          productList: productList,
          totalPage: totalPage,
          page: page,
          totalPosts: totalPosts,
        });
      
    }

   
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get("/featured", async (req, res) => {
  const productList = await Product.find({ isFeatured: true });
  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  return res.status(200).json(productList);
});

router.get("/:id", async (req, res) => {
  ProductEditId = req.params.id;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({
      message: "This Category with the givens ID was not Found",
    });
  }

  return res.status(200).send(product);
});
router.post("/create", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).send("inValid Category");
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    images: imagesArr,
    brand: req.body.brand,
    catID: req.body.catID,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    oldPrice: req.body.oldPrice,
    isFeatured: req.body.isFeatured,
    discount: req.body.discount,
    productRAMS: req.body.productRAMS,
    productSize: req.body.productSize,
  });

  product = await product.save();

  if (!product) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.status(201).json(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const images = product.images;

  if (images.length !== 0) {
    for (image of images) {
      fs.unlinkSync(`uploads/${image}`);
      const public_id = image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(public_id);
    }
  }

  const deleteProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deleteProduct) {
    return res.status(404).json({
      message: "Product not Found",
      status: false,
    });
  }
  res.status(200).send({
    message: "Product Deleted",
    status: true,
  });
});

router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      images: imagesArr,
      brand: req.body.brand,
      catID: req.body.catID,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      oldPrice: req.body.oldPrice,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRAMS: req.body.productRAMS,
      productSize: req.body.productSize,
    },
    { new: true }
  );
  if (!product) {
    return res.status(500).json({
      message: "Product cannot be updated",
      status: false,
    });
  }
  res.status(200).json({
    message: "Product is updated",
    status: true,
  });

  // res.send(product)
});

module.exports = router;

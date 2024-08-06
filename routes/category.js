const { Category } = require("../model/Category.js");
const express = require("express");
const router = express.Router();
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
        const result = await cloudinary.uploader.upload(req.files[i].path, options);
        imagesArr.push(result.secure_url);
        fs.unlinkSync(`uploads/${req.files[i].filename}`);
      }
      const imagesUploaded = new ImageUpload({ images: imagesArr });
      await imagesUploaded.save();
      return res.status(200).json(imagesArr);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading images' });
    }
  });
  

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await Category.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return res.status(404).json({ message: "Page Not Found" });
    }

    const categoryList = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!categoryList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({
      categoryList,
      totalPage,
      page,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/:id", async (req, res) => {
  categoryEditId = req.params.id;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(500)
        .json({ message: "This Category with the given ID was not Found" });
    }
    return res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching category" });
  }
});

router.post("/create", async (req, res) => {
  
    let category = new Category({
      name: req.body.name,
      images: imagesArr,
      // subCat: req.body.subCat,
    });
    if(!category){
       res.status(500).json({ error: err, success: false });
    }
    category = await category.save();
    imagesArr = []

    res.status(201).json(category);

});

router.delete('/deleteImage', async (req, res) =>{
   const imgUrl = req.body.img;

   const urlArr = imgUrl.split('/')
   const image = urlArr[urlArr.length-1]

   const imageName = image.split('.')[0]

   const response = cloudinary.uploader.destroy(imageName , (error, result)=>{

   })

   if(response){
     res.status(200).send(response)
   }
  })

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      const images = category.images;
      if (images.length !== 0) {
        for (let image of images) {
          const filePath = `uploads/${image}`;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deleteCategory) {
      return res
        .status(404)
        .json({ message: "Category not Found", status: false });
    }

    res.status(200).send({ status: true, message: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: imagesArr,
        // subCat: req.body.subCat,
      },
      { new: true }
    );

    if (!category) {
      return res
        .status(500)
        .json({ message: "Category cannot be updated", success: false });
    }

    res.send(category);
  } catch (error) {
    res.status(500).json({ message: "Error while updating category" });
  }
});



module.exports = router;

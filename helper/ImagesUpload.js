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
  
module.exports = router;
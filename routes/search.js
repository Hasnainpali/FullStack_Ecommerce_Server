const { Product } = require("../model/Products.js");
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Extract the query parameter from the request
        const query = req.query.q; // Use req.query for query parameters

        // Check if the query parameter is provided
        if (!query) {
            return res.status(400).json({ msg: "Query is Required" });
        }

        // Perform the search operation
        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
            ]
        });

        // Send the results as a JSON response
        res.json(items);
    } catch (error) {
        // Handle any errors that occur during the search
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;

const express = require("express");
const { ApifyClient } = require("apify-client"); // Correctly using require for ApifyClient
const axios = require("axios");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

dotenv.config(); // Load env variables before using them
connectDB();
const app = express();

// Allow all origins
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


// Define the GET endpoint
app.get("/search", async (req, res) => {
  try {
    // Get search term from query params
    const searchTerm = req.query.search_term || "memory cards";

    // Set up the request parameters
    const params = {
      api_key: API_KEY,
      type: "search",
      amazon_domain: AMAZON_DOMAIN,
      search_term: searchTerm,
    };

    // Make the HTTP GET request to Rainforest API
    const response = await axios.get("https://api.rainforestapi.com/request", {
      params,
    });

    // Send the JSON response from Rainforest API
    res.json(response.data);
  } catch (error) {
    // Catch and send the error
    console.error(error);
    res.status(500).send("Error fetching data from Rainforest API");
  }
});

// Initialize the ApifyClient with your provided API token
const client = new ApifyClient({
  token: "apify_api_ZtlNoGL4ReO42x0iDx4xwNjR3nt75Q2HKem6", // Your API token
});

app.get("/youtube-videos", async (req, res) => {
  try {
    const input = {
      searchQuery: "iPhone", // Replace with your search query
      maxResults: 10, // Maximum number of results to fetch
    };

    const run = await client.actor("apify/YouTubeScraper").call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    res.json(items);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
});

/// for open ai

// OpenAI integration
const { OpenAI } = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateText(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    console.log(response.choices[0].message.content.trim());
  } catch (error) {
    console.error(
      "Error with OpenAI API:",
      error.response ? error.response.data : error.message
    );
  }
}

// generateText("Write a poem about India");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

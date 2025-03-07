const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

async function getHoroscope(sign) {
  try {
    const url = `https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign=${sign}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const horoscope = $("div.main-horoscope p").first().text().trim();
    return horoscope || "Horoscope not found.";
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "Failed to fetch horoscope. Please try again later.";
  }
}

app.get("/horoscope/:sign", async (req, res) => {
  const sign = parseInt(req.params.sign, 10);
  if (sign < 1 || sign > 12) {
    return res.status(400).send("Invalid sign. Please use a number between 1 and 12.");
  }
  const horoscope = await getHoroscope(sign);
  res.send(horoscope); // Send only the horoscope text
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

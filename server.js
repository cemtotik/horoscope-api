const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// Map zodiac sign names to their corresponding numbers
const zodiacSigns = {
  aries: 1,
  taurus: 2,
  gemini: 3,
  cancer: 4,
  leo: 5,
  virgo: 6,
  libra: 7,
  scorpio: 8,
  sagittarius: 9,
  capricorn: 10,
  aquarius: 11,
  pisces: 12,
};

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
  const signName = req.params.sign.toLowerCase(); // Convert input to lowercase
  const signNumber = zodiacSigns[signName]; // Get the corresponding number

  if (!signNumber) {
    return res.status(400).send("Invalid sign. Please enter a valid zodiac sign (e.g., Aries, Taurus).");
  }

  const horoscope = await getHoroscope(signNumber);
  res.send(horoscope); // Send only the horoscope text
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

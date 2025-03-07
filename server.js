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

// Function to truncate text at the last sentence within the character limit
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text; // If the text is already within the limit, return it

  // Truncate the text to the max length
  let truncatedText = text.slice(0, maxLength);

  // Find the last sentence-ending punctuation (., !, ?) within the truncated text
  const lastPunctuationIndex = Math.max(
    truncatedText.lastIndexOf("."),
    truncatedText.lastIndexOf("!"),
    truncatedText.lastIndexOf("?")
  );

  // If a sentence-ending punctuation is found, truncate at that point
  if (lastPunctuationIndex >= 0) {
    truncatedText = truncatedText.slice(0, lastPunctuationIndex + 1);
  }

  return truncatedText;
}

async function getHoroscope(sign) {
  try {
    const url = `https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-today.aspx?sign=${sign}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let horoscope = $("div.main-horoscope p").first().text().trim();

    // Remove the year (e.g., "2025") from the horoscope text
    horoscope = horoscope.replace(/, \d{4} - /, " - ");

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

  // Truncate the horoscope text to fit within Twitch's 500-character limit
  const maxLength = 500;
  const truncatedHoroscope = truncateText(horoscope, maxLength);

  // Send the truncated horoscope text
  res.send(truncatedHoroscope);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

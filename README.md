# Horoscope API

This is a simple API to fetch daily horoscopes from [Horoscope.com](https://www.horoscope.com).

## Usage

1. Deploy the API to a platform like Render or Heroku.
2. Use the endpoint `/horoscope/<sign>` to fetch the horoscope for a specific zodiac sign (1-12).

Example:
- `/horoscope/1` for Aries.
- `/horoscope/12` for Pisces.

## Deployment

### Render
1. Connect this repository to Render.
2. Set the build command to `npm install`.
3. Set the start command to `node server.js`.

### Heroku
1. Push the repository to Heroku.
2. Heroku will automatically detect the Node.js app and deploy it.

const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const { client, findKeyByValue } = require("../config/redis");
const { getUrlAnalytics, urlVisits } = require("../models/Analytics");
const axios = require("axios");

exports.shortenUrl = async (req, res) => {
  const { longUrl, customUrl, topic } = req.body;
  const shortUrl = customUrl || nanoid(6);
  const cachedurl = await findKeyByValue(longUrl);
  if (cachedurl) {
    console.log(cachedurl, "cachedUrl");
    return res.json({
      message: `${longUrl}: is already present in the database, here is the short url : ${cachedurl}`,
    });
  }

  const urlPresent = await Url.findLongUrl(longUrl);
  console.log(urlPresent, "urlpresent");
  // const urlPresent = await findKeyByValue(longUrl);
  console.log(req.user.id, "userID");
  if (urlPresent) {
    return res.json({
      message: `${longUrl} : already present in the database, here is the short url : ${urlPresent.short_url}`,
    });
  }

  const url = await Url.createUrl(longUrl, shortUrl, req.user.Id, topic);
  await client.set(shortUrl, longUrl);
  res.json({
    shortUrl: `${process.env.BASE_URL}/url/${shortUrl}`,
    createdAt: url.created_at,
  });
};

exports.redirectUrl = async (req, res) => {
  const url = req.params.alias;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();
  const ipResponse = await axios.get("https://api.ipify.org?format=json");
  const ip = ipResponse.data.ip;
  const longUrl = await client.get(url);
  if (!longUrl) {
    return res.status(404).json({ message: "Url not found" });
  }
  // return res.status(200).json({ redirectUrl: longUrl });
  const urlDetails = await Url.findUrl(url);
  const geoResponse = await axios.get(
    `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`
  );
  console.log(geoResponse, "geoResponse");
  const { city, region, country } = geoResponse.data || {};
  const Geolocation = { city, region, country };
  urlVisits(urlDetails.id, userAgent, ip, Geolocation);
  res.setHeader(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  res.setHeader("Referer", "https://www.google.com");
  res.setHeader("Accept", "text/html");
  return res.redirect(longUrl);
};

const redis = require("redis");
require("dotenv").config();
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", (err) => {
  if (err) console.log(`Redis Error: ${err}`);
  else console.log("Connected to Redis");
});

// client.set("cache", "Hello, Redis!", redis.print); 
// client.get("cache", redis.print); 
client.connect();

async function findKeyByValue(targetValue) {
  const keys = await client.keys("*");
  for (const key of keys) {
    const value = await client.get(key);
    if (value === targetValue) {
      return key;
    }
  }
  return null;
}

module.exports = { client, findKeyByValue };

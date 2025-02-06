const Analytics = require("../models/Analytics");
const Url = require("../models/Url");
const uap = require("ua-parser-js");

exports.getUrlAnalytics = async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findUrl(shortUrl);

  if (!url) {
    return res.status(404).json({ message: "Url not found" });
  }

  const analytics = await Analytics.getUrlAnalytics(url.id);

  const totalClicks = analytics.length;
  const uniqueUsers = new Set(analytics.map((a) => a.ip_address)).size;
  const uniqueClicks = new Set(analytics.map((a) => a.url_id)).size;
  const clickByDate = analytics.reduce((res, a) => {
    const date = a.timestamp.toISOString().split("T")[0];
    res[date] = res[date] ? res[date] + 1 : 1;
    return res;
  }, {});

  let ua = uap(req.headers["user-agent"]);
  const osType = analytics.reduce((res, a) => {
    const os = uap(req.headers["user-agent"]).os || "Unknown";
    const userId = a.userId;

    if (res && typeof res === "object" && !res[os]) {
      res[os] = {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
    }

    res[os].uniqueClicks += 1;
    res[os].uniqueUsers.add(userId);

    return res;
  }, {});

  const osCounts = Object.entries(osType).map(([os, data]) => ({
    osName: os,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers.size,
  }));

  const deviceType = analytics.reduce((res, a) => {
    const device = uap(req.headers["user-agent"]).device.type || "Desktop";
    console.log(device, "device");
    const userId = a.userId;
    if (res && typeof res === "object" && !res[device]) {
      res[device] = {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
    }
    console.log(res, "res");
    res[device].uniqueClicks += 1;
    res[device]?.uniqueUsers?.add(userId);
    return res;
  }, {});

  const deviceCounts = Object.entries(deviceType).map(([device, data]) => ({
    deviceName: device,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers?.size,
  }));

  res.json({
    totalClicks,
    uniqueUsers,
    clickByDate: Object.entries(clickByDate).map(([date, count]) => ({
      date,
      count,
    })),
    osCounts,
    deviceCounts,
  });
};

exports.getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;
  const analytics = await Analytics.getTopicAnalytics(topic);
  const totalClicks = analytics.reduce(
    (total, a) => total + parseInt(a.total_clicks),
    0
  );
  const uniqueUsers = new Set(analytics.map((a) => a.ip_address)).size;

  const clickByDate = analytics.reduce((res, a) => {
    const date = a?.created_at?.toISOString()?.split("T")[0];
    res[date] = res[date] ? res[date] + 1 : 1;
    return res;
  }, {});
  const urls = Object.values(
    analytics.reduce((res, { short_url, ip_address, total_clicks }) => {
      if (!res[short_url]) {
        res[short_url] = {
          short_url,
          total_clicks: 0,
          uniqueUsers: new Set(),
        };
      }

      res[short_url].total_clicks += parseInt(total_clicks); // Aggregate total clicks
      res[short_url].uniqueUsers.add(ip_address); // Store unique users by IP

      return res;
    }, {})
  ).map(({ short_url, total_clicks, uniqueUsers }) => ({
    short_url,
    total_clicks,
    unique_users: uniqueUsers.size, // Convert Set to count
  }));

  res.json({
    totalClicks,
    uniqueUsers,
    clickByDate,
    urls,
  });
};

exports.getOverAllAnalytics = async (req, res) => {
  const analytics = await Analytics.getUserAnalytics(req.user.id);
  const totalUrls = await Url.totalUrl();

  const totalClicks = analytics.reduce(
    (total, a) => total + parseInt(a.total_clicks),
    0
  );
  const uniqueUsers = new Set(analytics.map((a) => a.ip_address)).size;
  const clickByDate = analytics.reduce((res, a) => {
    const date = a?.created_at?.toISOString()?.split("T")[0];
    res[date] = res[date] ? res[date] + 1 : 1;
    return res;
  }, {});

  let ua = uap(req.headers["user-agent"]);
  const osType = analytics.reduce((res, a) => {
    const os = uap(req.headers["user-agent"]).os || "Unknown";
    const userId = a.userId;

    if (res && typeof res === "object" && !res[os]) {
      res[os] = {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
    }

    res[os].uniqueClicks += 1;
    res[os].uniqueUsers.add(userId);

    return res;
  }, {});

  const osCounts = Object.entries(osType).map(([os, data]) => ({
    osName: os,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers.size,
  }));

  const deviceType = analytics.reduce((res, a) => {
    const device = uap(req.headers["user-agent"]).device.type || "Desktop";
    const userId = a.userId;
    if (res && typeof res === "object" && !res[device]) {
      res[device] = {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
    }
    res[device].uniqueClicks += 1;
    res[device]?.uniqueUsers?.add(userId);
    return res;
  }, {});

  const deviceCounts = Object.entries(deviceType).map(([device, data]) => ({
    deviceName: device,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers?.size,
  }));

  res.json({
    totalUrls,
    totalClicks,
    uniqueUsers,
    clickByDate,
    osCounts,
    deviceCounts,
  });
};

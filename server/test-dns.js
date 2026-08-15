const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.promises
  .resolveSrv("_mongodb._tcp.eventracluster.wzhgvpm.mongodb.net")
  .then((result) => {
    console.log("SRV lookup successful:");
    console.log(result);
  })
  .catch((err) => {
    console.error("SRV lookup failed:", err);
  });
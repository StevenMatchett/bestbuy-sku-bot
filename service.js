"use strict";

var player = require("play-sound")();
const open = require("open");
const fetch = require("node-fetch");

const skus = [6620367, 6614744, 6619458, 6620605, 6620368];

const found = (sku) => {
  open("https://www.bestbuy.com/site/searchpage.jsp?st=" + sku);
  player.play("alarm.mp3", { timeout: 300 }, function (err) {
    console.log("Error playing sound:", err);
    if (err) throw err;
  });
};

let resolved = 0;

const speed = () => {
  setTimeout(() => {
    console.log(`Resolved ${resolved} in 1 min`);
    resolved = 0;
    speed();
  }, 60000);
};
speed();

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const parseBestbuy = async (sku) => {
  let res = await bestbuy(sku);
  resolved++;
  if (res) {
    found(sku);
    return 69;
  }
  await sleep(10000);
  return 0;
};

const bestbuy = async (sku) => {
  const res = await fetch(
    `https://www.bestbuy.com/fulfillment/shipping/api/v1/fulfillment/sku;skuId=${sku};profileCode=10130;postalCode=15717;deliveryDateOption=EARLIEST_AVAILABLE_DATE;selectedDeliveryServiceSkuIds=?paidMembership=false&planPaidMemberType=NULL`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Priority: "u=1, i",
        "Sec-Ch-Ua": '"Chromium";v="133", "Not(A:Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "X-Client-Id": "FRV",
        "X-Request-Id": "BROWSE",
      },
      referrer:
        "https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-5070-ti-gaming-oc-16g-gddr7-pci-express-5-0-graphics-card-black/6618884.p?skuId=6618884",
      referrerPolicy: "strict-origin-when-cross-origin",
      method: "GET",
      mode: "cors", // Only needed for client-side requests
      credentials: "include", // Only needed for client-side requests
    },
  );

  const data = await res.json();
  if (!data || !data.responseInfos || !data.responseInfos[0]) {
    console.error("Error fetching data");
    return false;
  }
  return data.responseInfos[0].shippingEligible;
};
const run = async () => {
  for (let i = 0; i < skus.length; i++) {
    let returnd = 0;

    if (Number.isInteger(skus[i])) {
      returnd = await parseBestbuy(skus[i]);
    } else {
      // returnd = await parseSams(skus[i]);
    }

    if (returnd === 69) return;
  }

  return await run();
};

const main = async () => {
  run();
};

main();

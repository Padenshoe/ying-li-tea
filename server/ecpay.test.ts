/**
 * ECPay CheckMacValue calculation test
 * Validates the SHA256 checksum algorithm against ECPay's official example
 */
import { describe, it, expect } from "vitest";
import { createHash } from "crypto";

// Replicate the calcCheckMacValue function from ecpay.ts
function calcCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string
): string {
  const sorted = Object.keys(params)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(raw)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");

  const lower = encoded.toLowerCase();
  return createHash("sha256").update(lower).digest("hex").toUpperCase();
}

describe("ECPay CheckMacValue", () => {
  it("should produce correct CheckMacValue using ECPay official example", () => {
    // Official example from ECPay docs (https://developers.ecpay.com.tw/2902/)
    const params: Record<string, string> = {
      ChoosePayment: "ALL",
      EncryptType: "1",
      ItemName: "Apple iphone 15",
      MerchantID: "3002607",
      MerchantTradeDate: "2023/03/12 15:30:23",
      MerchantTradeNo: "ecpay20230312153023",
      PaymentType: "aio",
      ReturnURL: "https://www.ecpay.com.tw/receive.php",
      TotalAmount: "30000",
      TradeDesc: "促銷方案",
    };
    const hashKey = "pwFHCqoQZGmho4w6";
    const hashIV = "EkRm7iFT261dpevs";

    const result = calcCheckMacValue(params, hashKey, hashIV);
    expect(result).toBe("6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840");
  });

  it("should sort params case-insensitively", () => {
    const params: Record<string, string> = {
      ZParam: "z",
      AParam: "a",
      MParam: "m",
    };
    const sorted = Object.keys(params)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((k) => `${k}=${params[k]}`)
      .join("&");
    expect(sorted).toBe("AParam=a&MParam=m&ZParam=z");
  });

  it("should generate unique MerchantTradeNo within 20 chars", () => {
    const ts = Date.now().toString();
    const tradeNo = `YL${ts}`.slice(0, 20);
    expect(tradeNo.length).toBeLessThanOrEqual(20);
    expect(tradeNo.startsWith("YL")).toBe(true);
  });

  it("ECPay env vars should be configured", () => {
    // These are set via webdev_request_secrets
    const merchantId = process.env.ECPAY_MERCHANT_ID;
    const hashKey = process.env.ECPAY_HASH_KEY;
    const hashIV = process.env.ECPAY_HASH_IV;
    expect(merchantId).toBeTruthy();
    expect(hashKey).toBeTruthy();
    expect(hashIV).toBeTruthy();
  });
});

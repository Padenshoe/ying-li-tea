/**
 * Local Inventory Feed for Google Merchant Center
 *
 * Serves a CSV file at /yingli_local_inventory_feed.csv that Google can
 * automatically fetch daily. This replaces the manual CSV upload approach.
 *
 * Required fields per Google spec:
 *   store_code  — must match Google Business Profile store code
 *   item_id     — must match the id in the main product feed (yingli_merchant_feed.xml)
 *   quantity    — current in-store stock count
 *   availability — "in stock" | "out of stock" | "limited availability"
 */

import type { Request, Response } from "express";

const STORE_CODE = "06525933496174888174";

// All 28 product IDs matching yingli_merchant_feed.xml
const PRODUCT_IDS = [
  "S03", "S02",
  "A03", "A02",
  "R03", "R02",
  "L03", "L02",
  "D01", "D02",
  "RO1", "J01", "TB01",
  "GB01", "GB02", "GB03",
  "GB04", "GB05", "GB06", "GB07",
  "DYL01",
  "LST01", "LSBT01", "LSPB01",
  "CT01", "CT02", "CT03",
  "SXT01",
];

// Default quantity for all products.
// TODO: replace with real-time DB query when inventory management is implemented.
const DEFAULT_QUANTITY = 10;

export function handleLocalInventoryFeed(_req: Request, res: Response): void {
  const rows: string[] = [
    // Header row — Google requires exactly these column names
    "store_code\titem_id\tquantity\tavailability",
  ];

  for (const itemId of PRODUCT_IDS) {
    const quantity = DEFAULT_QUANTITY;
    const availability = quantity > 0 ? "in stock" : "out of stock";
    rows.push(`${STORE_CODE}\t${itemId}\t${quantity}\t${availability}`);
  }

  const tsv = rows.join("\n") + "\n";

  // Google accepts TSV (tab-separated) as a valid CSV variant.
  // Set Cache-Control to no-cache so Google always fetches fresh data.
  res.set({
    "Content-Type": "text/tab-separated-values; charset=utf-8",
    "Content-Disposition": 'inline; filename="yingli_local_inventory_feed.csv"',
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });

  res.send(tsv);
}

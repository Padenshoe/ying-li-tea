import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("中秋禮盒商品目錄", () => {
  it("經典迎利茶葉禮盒會同時出現在商品目錄與獨立商品詳情頁", () => {
    const catalog = readSource("client/src/pages/Products.tsx");
    const detail = readSource("client/src/pages/ProductDetail.tsx");

    expect(catalog).toContain('id: "MA04"');
    expect(catalog).toContain('name: "經典迎利茶葉禮盒"');
    expect(catalog).toContain("price: 2500");
    expect(catalog).toContain("featured: true");
    expect(detail).toContain('id: "MA04"');
    expect(detail).toContain('images: [IMG.classicYingli1, IMG.classicYingli2, IMG.classicYingli3]');
  });

  it("聯名禮盒頁使用指定首圖並包含經典禮盒的三張照片", () => {
    const page = readSource("client/src/pages/MidAutumnCollab.tsx");

    expect(page).toContain('p1_1: "/manus-storage/midautumn-alishan-main_0a69028a.jpg"');
    expect(page).toContain('p2_1: "/manus-storage/midautumn-alishan-main_0a69028a.jpg"');
    expect(page).toContain('p3_1: "/manus-storage/midautumn-dayuling-main_99655129.jpg"');
    expect(page).toContain('id: "MA04"');
    expect(page).toContain('images: [IMG.classic1, IMG.classic2, IMG.classic3]');
  });
});

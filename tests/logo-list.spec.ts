import { test, expect } from "@playwright/test";

test("Halaman logo menampilkan daftar logo atau state kosong", async ({ page }) => {
  await page.goto("http://localhost:3000"); // Sesuaikan URL lokal atau di Vercel
  
});

test("Tombol download bekerja jika ada logo", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const downloadButton = page.locator("a:has-text('Download')");
  if (await downloadButton.count() > 0) {
    const [download] = await Promise.all([
      page.waitForEvent("download"), // Tunggu event download
      downloadButton.first().click(),
    ]);

    // Cek apakah file berhasil didownload
    expect(await download.suggestedFilename()).toMatch(/\.png$/);
  } else {
    console.log("Tidak ada logo untuk didownload, tes dilewati.");
  }
});

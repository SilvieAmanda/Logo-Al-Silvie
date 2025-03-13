import { test, expect } from "@playwright/test";

test("Halaman utama memiliki judul yang benar", async ({ page }) => {
  await page.goto("http://localhost:3000"); // Ganti dengan URL lokal atau Vercel
  await expect(page).toHaveTitle(/Logo Al/i);
});

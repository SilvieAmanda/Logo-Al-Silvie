import { test, expect } from '@playwright/test';

test('Cek waktu load halaman utama', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://logo-al-silvie.vercel.app/');
    const end = Date.now();

    const loadTime = end - start;
    console.log(`Waktu load halaman: ${loadTime} ms`);

    expect(loadTime).toBeLessThan(3000); // Harus kurang dari 3 detik
});

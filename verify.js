import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
        else console.log('PAGE LOG:', msg.text());
    });
    page.on('pageerror', error => console.log('UNCAUGHT EXCEPTION:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log("Navigating to http://localhost:5173/");
    try {
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        console.log("Page loaded.");

        // Wait for 3D elements to initialize
        await new Promise(r => setTimeout(r, 4000));

        console.log("Taking initial screenshot...");
        await page.screenshot({ path: 'landing.png' });

        console.log("Attempting to click deeply to trigger booking view...");
        await page.evaluate(() => {
            // try to find the "Interstellar" card or similar and click it
            const elements = Array.from(document.querySelectorAll('*'));
            const interstellar = elements.find(el => el.textContent && el.textContent.includes('Interstellar') && el.tagName === 'H3');
            if (interstellar) {
                interstellar.click();
                console.log("Clicked Interstellar.");
            } else {
                // click somewhere in the middle to trigger the 3d cards
                document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)?.click();
                console.log("Clicked center of screen.");
            }
        });

        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'booking.png' });

        console.log("Verification complete.");
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
})();

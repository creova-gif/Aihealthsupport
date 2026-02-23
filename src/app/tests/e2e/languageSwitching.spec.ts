/**
 * E2E LANGUAGE SWITCHING TEST
 * AfyaCare Tanzania
 * 
 * Validates:
 * - Complete language switch (no residual text)
 * - Layout not broken
 * - No key strings visible
 * - No mixed languages
 * - Clinical terminology consistent
 * - Persistence across reload
 */

import { test, expect, Page } from '@playwright/test';

/**
 * LANGUAGE SWITCH REGRESSION TEST SUITE
 */
test.describe('Language Switching E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear storage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * TEST 1: Complete Language Switch
   */
  test('should switch all UI text from Swahili to English', async ({ page }) => {
    await page.goto('/');

    // Start in Swahili
    await page.waitForSelector('[data-testid="language-toggle"]');
    
    // Capture Swahili snapshot
    const swahiliText = await captureVisibleText(page);
    
    // Verify Swahili text present
    expect(swahiliText).toContain('Karibu'); // Welcome
    expect(swahiliText).toContain('Dashibodi'); // Dashboard
    expect(swahiliText).not.toContain('Welcome');
    expect(swahiliText).not.toContain('Dashboard');

    // Switch to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-language="en"]');
    
    // Wait for re-render
    await page.waitForTimeout(500);

    // Capture English snapshot
    const englishText = await captureVisibleText(page);

    // Verify complete switch
    expect(englishText).toContain('Welcome');
    expect(englishText).toContain('Dashboard');
    expect(englishText).not.toContain('Karibu');
    expect(englishText).not.toContain('Dashibodi');
  });

  /**
   * TEST 2: No Mixed Languages
   */
  test('should never show mixed Swahili/English', async ({ page }) => {
    await page.goto('/');

    // Test Swahili mode
    const swahiliElements = await page.$$('text=/Symptom|Doctor|Emergency|Patient/');
    expect(swahiliElements.length).toBe(0); // No English clinical terms

    // Switch to English
    await switchLanguage(page, 'en');

    // Test English mode
    const englishElements = await page.$$('text=/Dalili|Daktari|Dharura|Mgonjwa/');
    expect(englishElements.length).toBe(0); // No Swahili clinical terms
  });

  /**
   * TEST 3: Critical Clinical Terms Consistency
   */
  test('should translate all clinical terms consistently', async ({ page }) => {
    await page.goto('/symptom-checker');

    // Swahili mode
    await expect(page.locator('text=Dharura')).toBeVisible(); // Emergency
    await expect(page.locator('text=Dalili')).toBeVisible(); // Symptoms
    
    // Switch to English
    await switchLanguage(page, 'en');
    
    await expect(page.locator('text=Emergency')).toBeVisible();
    await expect(page.locator('text=Symptoms')).toBeVisible();
    
    // Verify Swahili terms gone
    await expect(page.locator('text=Dharura')).not.toBeVisible();
    await expect(page.locator('text=Dalili')).not.toBeVisible();
  });

  /**
   * TEST 4: No Translation Keys Visible
   */
  test('should not show raw translation keys', async ({ page }) => {
    await page.goto('/');

    // Check for key patterns like "common.submit" or "symptomChecker.title"
    const bodyText = await page.textContent('body');
    
    const keyPatterns = [
      /\w+\.\w+/,  // namespace.key
      /\[object Object\]/,
      /undefined/,
      /null/
    ];

    keyPatterns.forEach(pattern => {
      expect(bodyText).not.toMatch(pattern);
    });
  });

  /**
   * TEST 5: Language Persists After Reload
   */
  test('should persist language across page reload', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await switchLanguage(page, 'en');
    
    // Verify English
    await expect(page.locator('text=Welcome')).toBeVisible();

    // Reload page
    await page.reload();

    // Should still be English
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('text=Karibu')).not.toBeVisible();
  });

  /**
   * TEST 6: All Screens Switch Language
   */
  test('should switch language on all major screens', async ({ page }) => {
    const screens = [
      { route: '/', swText: 'Dashibodi', enText: 'Dashboard' },
      { route: '/symptom-checker', swText: 'Dalili', enText: 'Symptoms' },
      { route: '/appointments', swText: 'Miadi', enText: 'Appointments' },
      { route: '/profile', swText: 'Wasifu', enText: 'Profile' }
    ];

    for (const screen of screens) {
      await page.goto(screen.route);

      // Check Swahili
      await expect(page.locator(`text=${screen.swText}`)).toBeVisible();

      // Switch to English
      await switchLanguage(page, 'en');

      // Check English
      await expect(page.locator(`text=${screen.enText}`)).toBeVisible();
      await expect(page.locator(`text=${screen.swText}`)).not.toBeVisible();

      // Switch back to Swahili
      await switchLanguage(page, 'sw');
    }
  });

  /**
   * TEST 7: Modals and Dialogs Switch Language
   */
  test('should switch language in modals/dialogs', async ({ page }) => {
    await page.goto('/');

    // Open a modal (e.g., safety disclaimer)
    await page.click('[data-testid="open-disclaimer"]');

    // Check Swahili in modal
    await expect(page.locator('.modal text=Onyo la Usalama')).toBeVisible();

    // Switch language
    await switchLanguage(page, 'en');

    // Modal should update
    await expect(page.locator('.modal text=Safety Disclaimer')).toBeVisible();
    await expect(page.locator('.modal text=Onyo la Usalama')).not.toBeVisible();
  });

  /**
   * TEST 8: Error Messages Switch Language
   */
  test('should show error messages in correct language', async ({ page }) => {
    await page.goto('/');

    // Trigger an error (e.g., submit invalid form)
    await page.click('[data-testid="submit-button"]');

    // Check Swahili error
    await expect(page.locator('text=/Hitilafu|Taarifa si sahihi/')).toBeVisible();

    // Switch to English
    await switchLanguage(page, 'en');

    // Re-trigger error
    await page.click('[data-testid="submit-button"]');

    // Check English error
    await expect(page.locator('text=/Error|Invalid input/')).toBeVisible();
  });

  /**
   * TEST 9: Layout Not Broken by Translation Length
   */
  test('should not break layout when switching languages', async ({ page }) => {
    await page.goto('/');

    // Measure layout in Swahili
    const swahiliLayout = await page.evaluate(() => {
      return {
        bodyHeight: document.body.scrollHeight,
        hasOverflow: document.body.scrollWidth > window.innerWidth
      };
    });

    // Switch to English
    await switchLanguage(page, 'en');

    // Measure layout in English
    const englishLayout = await page.evaluate(() => {
      return {
        bodyHeight: document.body.scrollHeight,
        hasOverflow: document.body.scrollWidth > window.innerWidth
      };
    });

    // Height difference should be reasonable (<20%)
    const heightDiff = Math.abs(englishLayout.bodyHeight - swahiliLayout.bodyHeight);
    const percentDiff = (heightDiff / swahiliLayout.bodyHeight) * 100;

    expect(percentDiff).toBeLessThan(20);

    // No horizontal overflow
    expect(englishLayout.hasOverflow).toBe(false);
  });

  /**
   * TEST 10: Rapid Language Switching (Stress Test)
   */
  test('should handle rapid language switches', async ({ page }) => {
    await page.goto('/');

    // Switch 20 times rapidly
    for (let i = 0; i < 20; i++) {
      await switchLanguage(page, i % 2 === 0 ? 'en' : 'sw');
    }

    // Should end on 'sw'
    await expect(page.locator('text=Karibu')).toBeVisible();
    await expect(page.locator('text=Welcome')).not.toBeVisible();
  });

  /**
   * TEST 11: API Responses in Correct Language
   */
  test('should receive API responses in selected language', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await switchLanguage(page, 'en');

    // Make API request
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/appointments', {
        headers: {
          'Accept-Language': 'en'
        }
      });
      return res.json();
    });

    // Verify response language
    expect(response.message_key).toBeDefined();
    // Should not contain hardcoded Swahili
    const jsonString = JSON.stringify(response);
    expect(jsonString).not.toMatch(/Miadi|Daktari|Mgonjwa/);
  });

  /**
   * TEST 12: AI Responses in Correct Language
   */
  test('should show AI responses in selected language', async ({ page }) => {
    await page.goto('/symptom-checker');

    // Fill symptom checker
    await page.click('[data-symptom="fever"]');
    await page.click('[data-testid="check-symptoms"]');

    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-response"]');

    // Check Swahili AI response
    const swahiliResponse = await page.textContent('[data-testid="ai-response"]');
    expect(swahiliResponse).toMatch(/homa|maumivu|dalili/i);

    // Switch to English
    await switchLanguage(page, 'en');

    // Re-run symptom checker
    await page.click('[data-testid="check-symptoms"]');
    await page.waitForSelector('[data-testid="ai-response"]');

    // Check English AI response
    const englishResponse = await page.textContent('[data-testid="ai-response"]');
    expect(englishResponse).toMatch(/fever|pain|symptom/i);
    expect(englishResponse).not.toMatch(/homa|maumivu|dalili/i);
  });
});

/**
 * HELPER FUNCTIONS
 */

async function switchLanguage(page: Page, language: 'sw' | 'en') {
  await page.click('[data-testid="language-toggle"]');
  await page.click(`[data-language="${language}"]`);
  await page.waitForTimeout(500); // Wait for re-render
}

async function captureVisibleText(page: Page): Promise<string> {
  return await page.evaluate(() => {
    return document.body.innerText;
  });
}

/**
 * VISUAL REGRESSION TEST
 */
test.describe('Language Visual Regression', () => {
  test('should match Swahili screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('dashboard-swahili.png');
  });

  test('should match English screenshot', async ({ page }) => {
    await page.goto('/');
    await switchLanguage(page, 'en');
    await expect(page).toHaveScreenshot('dashboard-english.png');
  });
});

/**
 * ACCESSIBILITY TEST
 */
test.describe('Language Accessibility', () => {
  test('should announce language change to screen readers', async ({ page }) => {
    await page.goto('/');

    // Check for aria-live region
    const ariaLive = await page.locator('[aria-live="polite"]');
    await expect(ariaLive).toBeAttached();

    // Switch language
    await switchLanguage(page, 'en');

    // Verify announcement
    const announcement = await ariaLive.textContent();
    expect(announcement).toMatch(/Language changed|Lugha imebadilishwa/);
  });

  test('should set correct lang attribute', async ({ page }) => {
    await page.goto('/');

    // Check Swahili
    let htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('sw');

    // Switch to English
    await switchLanguage(page, 'en');

    htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');
  });
});

export { switchLanguage, captureVisibleText };

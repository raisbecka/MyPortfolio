import { expect, test } from '@playwright/test'

test('hero links lead with About, then Projects, then Articles, without a resume', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('main > section').first()
  const links = hero.getByRole('link', { name: /^(About me|Projects|Articles|Resume)$/ })
  await expect(links).toHaveText(['About me', 'Projects', 'Articles'])
  await expect(hero.getByRole('link', { name: 'Resume', exact: true })).toHaveCount(0)
  await expect(links.nth(0)).toHaveAttribute('href', '/about')
  await expect(links.nth(1)).toHaveAttribute('href', '/projects')
  await expect(links.nth(2)).toHaveAttribute('href', '/blog')
})

import { expect, test } from '@playwright/test'
import { approvedAboutParagraphs, approvedExperience } from './fixtures/approved-copy'

for (const width of [1440, 390]) {
  for (const destination of [
    { link: 'Maximo / MAS experience', id: 'maximo-experience', heading: 'IBM Maximo' },
    { link: 'Development experience', id: 'developer-experience', heading: 'Enterprise Developer' },
  ]) {
    test(`About navigates to ${destination.id} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/about')
      await page.getByRole('main').getByRole('link', { name: destination.link, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/#${destination.id}$`))
      const section = page.locator(`#${destination.id}`)
      await expect(section).toHaveAttribute('data-active', 'true')
      await expect(section.getByRole('heading', { name: destination.heading, exact: true })).toBeInViewport()
    })
  }
}

for (const width of [1440, 390, 320]) {
  test(`About presents the approved profile at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/about')
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { level: 1, name: 'About me' })).toBeVisible()
    await expect(main.locator('section[aria-labelledby="about-heading"] p')).toHaveText(approvedAboutParagraphs)
    await expect(main.getByRole('link', { name: 'Email me', exact: true })).toHaveAttribute('href', /^mailto:/)
    await expect(main.locator('img, code, del, #container')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`original carousel controls switch tracks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    const carousel = page.locator('[data-experience-carousel]')
    const maximo = page.locator('#maximo-experience')
    const developer = page.locator('#developer-experience')
    await expect(carousel).toBeVisible()
    await carousel.hover()
    await expect(maximo).toHaveAttribute('data-active', 'true')
    await expect(developer).toHaveAttribute('data-active', 'false')
    await carousel.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(developer).toHaveAttribute('data-active', 'true')
    await expect(maximo).toHaveAttribute('data-active', 'false')
    await carousel.getByRole('button', { name: 'Previous', exact: true }).click()
    await expect(maximo).toHaveAttribute('data-active', 'true')
    await carousel.getByRole('button', { name: 'Go to slide 2', exact: true }).click()
    await expect(developer).toHaveAttribute('data-active', 'true')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}

test('carousel retains the selected track on resize', async ({ page }) => {
  await page.goto('/')
  const carousel = page.locator('[data-experience-carousel]')
  await carousel.getByRole('button', { name: 'Go to slide 2', exact: true }).click()
  await page.setViewportSize({ width: 390, height: 1000 })
  await expect(page.locator('#developer-experience')).toHaveAttribute('data-active', 'true')
})

test('experience text is rendered without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4321/')
  for (const expected of approvedExperience) {
    for (const text of expected.bullets) {
      await expect(page.locator('#experience')).toContainText(text)
    }
  }
  await context.close()
})

test('experience preserves the approved copy in the original timeline format', async ({ page }) => {
  await page.goto('/')
  const experience = page.locator('#experience')
  const items = experience.locator('[data-experience-item]')
  await expect(items).toHaveCount(approvedExperience.length)
  for (let index = 0; index < approvedExperience.length; index++) {
    const expected = approvedExperience[index]
    const item = items.nth(index)
    await expect(item.getByRole('heading', { level: 3 })).toContainText(expected.role)
    await expect(item.locator('p').last()).toHaveText(expected.bullets.join(' • '))
  }
  await expect(experience).not.toContainText(/ActiveNET|Historian|LOGINTRACKING|OAuth/)
})

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

import { expect, test } from '@playwright/test'
import {
  approvedAboutParagraphs,
  approvedExperience,
} from './fixtures/approved-copy'

for (const width of [1440, 390]) {
  for (const destination of [
    {
      link: 'Maximo / MAS experience',
      id: 'maximo-experience',
      heading: 'IBM Maximo / MAS',
    },
    {
      link: 'Development experience',
      id: 'developer-experience',
      heading: 'Enterprise development',
    },
  ]) {
    test(`About navigates to ${destination.id} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/about')
      await page
        .getByRole('main')
        .getByRole('link', { name: destination.link, exact: true })
        .click()
      await expect(page).toHaveURL(new RegExp(`/#${destination.id}$`))
      const section = page.getByRole('region', {
        name: destination.heading,
        exact: true,
      })
      await expect(section).toBeVisible()
      await expect(
        section.getByRole('heading', {
          name: destination.heading,
          exact: true,
        }),
      ).toBeInViewport()
    })
  }
}

for (const width of [1440, 390, 320]) {
  test(`About presents a professional employer-focused profile at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/about')
    const main = page.getByRole('main')
    await expect(
      main.getByRole('heading', { level: 1, name: 'About me' }),
    ).toBeVisible()
    await expect(
      main.locator('section[aria-labelledby="about-heading"] p'),
    ).toHaveText(approvedAboutParagraphs)
    await expect(
      main.getByRole('link', { name: 'Maximo / MAS experience', exact: true }),
    ).toHaveAttribute('href', '/#maximo-experience')
    await expect(
      main.getByRole('link', { name: 'Development experience', exact: true }),
    ).toHaveAttribute('href', '/#developer-experience')
    await expect(
      main.getByRole('link', { name: 'Email me', exact: true }),
    ).toHaveAttribute('href', /^mailto:/)
    await expect(main.locator('img')).toHaveCount(0)
    await expect(main.locator('code, del, #container')).toHaveCount(0)
    await expect(main).not.toContainText('Drewman')
    await expect(main).not.toContainText('**')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`carousel shows Maximo first and development second at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    const carousel = page.locator('experience-carousel')
    const maximo = page.locator('#maximo-experience')
    const developer = page.locator('#developer-experience')
    await expect(carousel).toBeVisible()
    await carousel.evaluate((element) =>
      element.scrollIntoView({ block: 'start' }),
    )
    await expect(maximo).toHaveAttribute('aria-hidden', 'false')
    await expect(developer).toHaveAttribute('aria-hidden', 'true')
    await expect(maximo.getByRole('heading', { level: 3 })).toBeInViewport()
    await expect(developer).not.toBeInViewport()
    await carousel
      .getByRole('button', { name: 'Next experience', exact: true })
      .click()
    await expect(developer).toHaveAttribute('aria-hidden', 'false')
    await expect(maximo).toHaveAttribute('aria-hidden', 'true')
    await expect(developer.getByRole('heading', { level: 3 })).toBeInViewport()
    await expect(
      carousel.getByRole('button', {
        name: 'Show Enterprise development experience',
        exact: true,
      }),
    ).toHaveAttribute('aria-current', 'true')
    await carousel
      .getByRole('button', { name: 'Previous experience', exact: true })
      .click()
    await expect(maximo).toHaveAttribute('aria-hidden', 'false')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

test('carousel supports keyboard controls and retains the selected track on resize', async ({
  page,
}) => {
  await page.goto('/')
  const viewport = page.locator('[data-experience-viewport]')
  await viewport.focus()
  await viewport.press('ArrowRight')
  await expect(page.locator('#developer-experience')).toHaveAttribute(
    'aria-hidden',
    'false',
  )
  await page.setViewportSize({ width: 390, height: 1000 })
  await expect(
    page.locator('#developer-experience').getByRole('heading', { level: 3 }),
  ).toBeInViewport()
  await viewport.press('Home')
  await expect(page.locator('#maximo-experience')).toHaveAttribute(
    'aria-hidden',
    'false',
  )
  await viewport.press('End')
  await expect(page.locator('#developer-experience')).toHaveAttribute(
    'aria-hidden',
    'false',
  )
})

test('experience remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4321/')
  await expect(
    page.getByRole('region', { name: 'IBM Maximo / MAS', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Enterprise development', exact: true }),
  ).toBeVisible()
  await context.close()
})

test('experience uses the approved concise copy for every role', async ({
  page,
}) => {
  await page.goto('/')
  const experience = page.locator('#experience')
  const articles = experience.locator('article')
  await expect(articles).toHaveCount(approvedExperience.length)
  for (let index = 0; index < approvedExperience.length; index++) {
    const expected = approvedExperience[index]
    const article = articles.nth(index)
    await expect(article.locator('h4')).toHaveText(expected.role)
    await expect(article.locator('li')).toHaveText(expected.bullets)
  }
  await expect(experience).not.toContainText(
    /ActiveNET|Historian|LOGINTRACKING|OAuth/,
  )
  await expect(page.getByText(/overlapping.*York Region/)).toBeVisible()
  await expect(experience.getByText(/concurrent assignment/i)).toBeVisible()
})

test('hero links lead with About, then Projects, then Articles, without a resume', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('main > section').first()
  const links = hero.getByRole('link', {
    name: /^(About me|Projects|Articles|Resume)$/,
  })
  await expect(links).toHaveText(['About me', 'Projects', 'Articles'])
  await expect(
    hero.getByRole('link', { name: 'Resume', exact: true }),
  ).toHaveCount(0)
  await expect(links.nth(0)).toHaveAttribute('href', '/about')
  await expect(links.nth(1)).toHaveAttribute('href', '/projects')
  await expect(links.nth(2)).toHaveAttribute('href', '/blog')
})

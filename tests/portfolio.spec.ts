import { expect, test } from '@playwright/test'

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`experience tracks are visible and correctly ordered at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    const maximo = page.getByRole('region', { name: 'IBM Maximo / MAS', exact: true })
    const developer = page.getByRole('region', { name: 'Enterprise development', exact: true })
    await expect(maximo).toBeVisible()
    await expect(developer).toBeVisible()
    const left = (await maximo.boundingBox())!
    const right = (await developer.boundingBox())!
    if (width >= 768) {
      expect(Math.abs(left.y - right.y)).toBeLessThan(2)
      expect(right.x).toBeGreaterThanOrEqual(left.x + left.width)
    } else {
      expect(right.y).toBeGreaterThanOrEqual(left.y + left.height)
      expect(Math.abs(left.x - right.x)).toBeLessThan(2)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await expect(maximo.getByRole('listitem')).not.toHaveCount(0)
    await expect(developer.getByRole('listitem')).not.toHaveCount(0)
    await expect(page.getByRole('button', { name: /Go to slide|Previous|Next/ })).toHaveCount(0)
  })
}

test('experience remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4321/')
  await expect(page.getByRole('region', { name: 'IBM Maximo / MAS', exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Enterprise development', exact: true })).toBeVisible()
  await context.close()
})

test('experience bullets describe actual applications, outcomes, integrations and pilot scope', async ({ page }) => {
  await page.goto('/')
  const maximo = page.getByRole('region', { name: 'IBM Maximo / MAS', exact: true })
  const developer = page.getByRole('region', { name: 'Enterprise development', exact: true })
  for (const claim of [
    /80–90%.*time.*building and maintaining staff schedules/,
    /CAD.*1\.2 million.*projected.*10 years/,
    /LOGINTRACKING.*concurrent.*application usage.*security groups.*App Points/,
    /eLogbook.*EZMaxMobile.*React/,
    /ORO\/OIC.*Absence Request.*self-service/,
    /Graphical Resource View.*Oracle APEX/,
    /water sample.*unit conversion.*anomaly detection.*invalid/,
    /SSIS.*interface tables.*operator licen/,
    /Denodo.*object structure REST APIs.*data warehouse.*Power BI/,
    /PeopleSoft.*Denodo.*Entra.*OAuth 2\.0.*labor records.*enterprise service/,
    /bidirectional.*GIS.*GPS/,
    /pilot.*Historian API.*runtime meters.*preventive.*predictive/,
    /Led.*Maximo 7\.6\.x.*MAS.*9\.1.*WebSphere.*Red Hat OpenShift.*cloud.*six months/,
  ]) {
    await expect(maximo.getByRole('listitem').filter({ hasText: claim })).toHaveCount(1)
  }
  for (const claim of [
    /eLogbook.*Java.*Struts.*Spring.*water and wastewater.*centrally.*field/,
    /Azure DevOps.*manual.*several hours.*30–40 minutes/,
    /Prometheus.*Grafana.*WebSphere.*Maximo.*EZMaxMobile.*memory.*CPU.*page-load/,
    /JUnit.*hundreds.*authenticated.*core dumps.*crashes/,
    /monitoring.*load testing.*crash.*downtime/,
  ]) {
    await expect(developer.getByRole('listitem').filter({ hasText: claim })).toHaveCount(1)
  }
  await expect(page.getByText(/overlapping.*York Region/)).toBeVisible()
  await expect(maximo.getByText(/concurrent assignment/i)).toBeVisible()
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

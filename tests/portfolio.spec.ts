import { expect, test } from '@playwright/test'

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
    await expect(main).toContainText(
      'enterprise developer and IBM Maximo/MAS specialist',
    )
    await expect(main).toContainText('water and wastewater')
    await expect(main).toContainText('Struts/Spring')
    await expect(main).toContainText(
      'projected licensing savings over 10 years',
    )
    await expect(main).toContainText('JUnit')
    await expect(main).toContainText('Canadian Maximo User Group')
    await expect(main).toContainText('developer and Maximo specialist roles')
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
  test(`experience tracks are visible and correctly ordered at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    const maximo = page.getByRole('region', {
      name: 'IBM Maximo / MAS',
      exact: true,
    })
    const developer = page.getByRole('region', {
      name: 'Enterprise development',
      exact: true,
    })
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
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
    await expect(maximo.getByRole('listitem')).not.toHaveCount(0)
    await expect(developer.getByRole('listitem')).not.toHaveCount(0)
    await expect(
      page.getByRole('button', { name: /Go to slide|Previous|Next/ }),
    ).toHaveCount(0)
  })
}

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

test('experience bullets describe actual applications, outcomes, integrations and pilot scope', async ({
  page,
}) => {
  await page.goto('/')
  const maximo = page.getByRole('region', {
    name: 'IBM Maximo / MAS',
    exact: true,
  })
  const developer = page.getByRole('region', {
    name: 'Enterprise development',
    exact: true,
  })
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
    await expect(
      maximo.getByRole('listitem').filter({ hasText: claim }),
    ).toHaveCount(1)
  }
  for (const claim of [
    /eLogbook.*Java.*Struts.*Spring.*water and wastewater.*centrally.*field/,
    /Azure DevOps.*manual.*several hours.*30–40 minutes/,
    /Prometheus.*Grafana.*WebSphere.*Maximo.*EZMaxMobile.*memory.*CPU.*page-load/,
    /JUnit.*hundreds.*authenticated.*core dumps.*crashes/,
    /monitoring.*load testing.*crash.*downtime/,
  ]) {
    await expect(
      developer.getByRole('listitem').filter({ hasText: claim }),
    ).toHaveCount(1)
  }
  await expect(page.getByText(/overlapping.*York Region/)).toBeVisible()
  await expect(maximo.getByText(/concurrent assignment/i)).toBeVisible()
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

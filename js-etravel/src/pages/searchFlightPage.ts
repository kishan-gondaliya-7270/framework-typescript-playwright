import { Page } from 'playwright'

export class SearchFlightPage {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigateToFlightSearchURL(URL: string) {
    await this.page.goto(URL)
  }

  async selectOneWay() {
    await this.page
      .getByTestId('searchForm-oneWay-radio-label')
      .locator('div')
      .filter({ hasText: 'One-Way' })
      .click()
  }

  selectReturn() {
    // Placeholder for Return flight selection
  }

  selectMultiCity() {
    // Placeholder for Multi-City flight selection
  }

  async setOrigin(from: string) {
    await this.page.waitForSelector("input[aria-label='From']")
    await this.page.getByLabel('From').fill(from)
    await this.page.waitForTimeout(1500) // Adding delay to ensure data is available
    await this.page.getByLabel('From').press('Enter')
  }

  async setDestination(to: string) {
    await this.page.waitForSelector("input[aria-label='To']")
    await this.page.getByLabel('To').fill(to)
    await this.page.waitForTimeout(1500) // Adding delay to ensure data is available
    await this.page.getByLabel('To').press('Enter')
  }

  async setDepartureDate(departureDate: string) {
    await this.page.getByTestId('singleBound.departureDate-input').click()
    await this.page.getByRole('gridcell', { name: departureDate, exact: true }).click()

    return this.page.getByTestId('singleBound.departureDate-input').inputValue()
  }

  async setPassengers(count: number) {
    await this.page.getByTestId('searchForm-passengers-dropdown').click()
    if (count > 1) {
      for (let i = 0; i < count - 1; i++)
        await this.page.getByTestId('adults-passengers-add').click()
    }
  }

  async searchFlights() {
    await this.page.getByTestId('searchForm-searchFlights-button').click()
  }

  async waitForLoader() {
    await this.page.waitForSelector('[data-testid="progressSpinner-image"]', {
      state: 'visible'
    })
  }

  validateLoaderHeading(from: string, to: string) {
    return this.page.getByRole('heading', { name: `${from} – ${to}` })
  }
}

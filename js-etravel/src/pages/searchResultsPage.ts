import { Page } from 'playwright'

export class SearchResultPage {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async clickFilter() {
    await this.page.getByTestId('resultPage-toggleFiltersButton-button').click()
  }

  getFilterElements(from: string, to: string) {
    const elements = {
      numberOfStops: this.page.getByText('Number of stops'),
      priceHeader: this.page.getByTestId('resultPage-PRICE-header').getByText('Price'),
      airlinesHeader: this.page.getByTestId('resultPage-AIRLINES-header').getByText('Airlines'),
      departureFromHeader: this.page
        .getByTestId('resultPage-departureArrival0-header')
        .getByText(from),
      departureToHeader: this.page.getByTestId('resultPage-departureArrival0-header').getByText(to),
      travelTime: this.page.getByText('Travel time'),
      applyFiltersButton: this.page.getByTestId('filtersForm-applyFilters-button')
    }
    return elements
  }

  async clearAndApplyAirlinesFilter(flightAirlineOption: string) {
    await this.page.getByRole('button', { name: 'Clear all' }).click()
    await this.page
      .getByTestId('resultPage-AIRLINESFilter-content')
      .getByText(flightAirlineOption)
      .click()
    await this.page.getByTestId('filtersForm-applyFilters-button').click()
    await this.page.waitForTimeout(1000) // Adding delay to ensure data is available
  }

  async selectNonStopFlights() {
    await this.page.getByTestId('MAX_STOPS-direct').click()
    await this.page.getByTestId('filtersForm-applyFilters-button').click()
    await this.page.waitForTimeout(1000) // Adding delay to ensure data is available
  }

  async selectMaxOneStopFlights() {
    await this.page.getByTestId('MAX_STOPS-max1').click()
    await this.page.getByTestId('filtersForm-applyFilters-button').click()
    await this.page.waitForTimeout(1000) // Adding delay to ensure data is available
  }

  async scrollAndCheckAllResultsLoaded() {
    const scrollStep = 1000 // Pixels to scroll by each step

    while (
      !(await this.page
        .locator('p', { hasText: "That's it!" })
        .isVisible()
        .catch(() => false))
    ) {
      await this.page.mouse.wheel(0, scrollStep)
      await this.page.waitForTimeout(scrollStep)
    }
  }

  async countResults() {
    await this.scrollAndCheckAllResultsLoaded()
    return this.page.getByTestId('tripDetails-segment').count()
  }

  validateResultsContainAirline(airline: string) {
    return this.page.getByTestId('tripDetails-segment').getByText(airline).count()
  }

  validateResultsContainsNonStopFlights() {
    return this.page.getByTestId('tripDetails-segment').getByText('stop').count()
  }

  async validateResultsContainsMaxOneStopFlights() {
    const stopRecords = await this.page
      .locator('[data-testid="searchResults-segment-stops"]')
      .allInnerTexts()
    for (const record of stopRecords) {
      if (record.trim() !== '1 stop') return false
    }
    return true
  }

  async getFilterByText(page: Page): Promise<string | void> {
    const selector =
      'header[data-testid="resultPage-filters-header"] span[data-testid="resultPage-filters-text"] + span'
    await page.waitForSelector(selector, { timeout: 5000 })
    const element = await page.$(selector)
    if (element) {
      const text = await element.textContent()
      if (text) return text.trim()
    }
  }

  async getCountOfFilteredFlights(text: string): Promise<number | void> {
    const regex = /(?<=: )\d+(?= of)/
    const match = text.match(regex)
    if (match && match[0]) return parseInt(match[0], 10)
  }

  async getTravelTimeValue(): Promise<string | void> {
    const travelTimeValueSelector =
      '//*[@id="main"]/div[1]/div[2]/div/div/div[2]/section[2]/div/div/div/div/div[4]'
    const travelTimeElement = this.page.locator(travelTimeValueSelector)
    const textContent = await travelTimeElement.textContent()
    if (textContent) return textContent
  }

  async moveSliderToPosition(sliderPosition: number) {
    const sliderHandle = this.page
      .getByTestId('resultPage-TRAVEL_TIMEFilter-content')
      .getByTestId('handle-0')
    const trackPad = this.page.getByTestId('track-0').nth(2)

    const sliderHandleBox = await sliderHandle.boundingBox()
    const trackPadBox = await trackPad.boundingBox()

    if (sliderHandleBox && trackPadBox) {
      const startX = sliderHandleBox.x + sliderHandleBox.width / 2
      const startY = sliderHandleBox.y + sliderHandleBox.height / 2
      const endX = trackPadBox.x + trackPadBox.width * (sliderPosition / 600)

      await this.page.mouse.move(startX, startY)
      await this.page.mouse.down()
      await this.page.mouse.move(endX, startY, { steps: 10 })
      await this.page.mouse.up()
    }
  }
}

import { test, expect } from '@playwright/test'
import { SearchFlightPage } from '../../pages/searchFlightPage'
import { flightSearchData } from '../../utils/test-data'
import { URLS } from '../../utils/constants'

test.describe('Flight Search Tests', () => {
  test('should search for a one-way flight successfully', async ({ page }) => {
    const searchPage = new SearchFlightPage(page)

    await searchPage.navigateToFlightSearchURL(URLS.FLIGHT_NETWORK)
    await searchPage.selectOneWay()
    await searchPage.setOrigin(flightSearchData.from)
    await searchPage.setDestination(flightSearchData.to)

    const selectedDepartureDate = await searchPage.setDepartureDate(flightSearchData.date)
    expect(selectedDepartureDate).toContain(flightSearchData.full_date)

    await searchPage.setPassengers(1)
    await searchPage.searchFlights()
    await searchPage.waitForLoader()
    expect(searchPage.validateLoaderHeading(flightSearchData.from, flightSearchData.to)).toBeDefined()

    await expect(page).toHaveURL(URLS.FLIGHT_NETWORK_RESULT)  
  })
})

import { test, expect } from '@playwright/test'
import { SearchFlightPage } from '../../pages/searchFlightPage'
import { SearchResultPage } from '../../pages/searchResultsPage'
import { flightSearchData } from '../../utils/test-data'
import { flightAirlineOption } from '../../utils/test-data'
import { URLS } from '../../utils/constants'
import { isTravelTimeUpdated } from '../../utils/helper'

test.describe('Search Flight, applies filters and validates results', () => {
  test.beforeEach('This fixture will search for one-way flights', async ({ page }) => {
    const searchPage = new SearchFlightPage(page)

    await searchPage.navigateToFlightSearchURL(URLS.FLIGHT_NETWORK)
    await searchPage.selectOneWay()
    await searchPage.setOrigin(flightSearchData.from)
    await searchPage.setDestination(flightSearchData.to)
    await searchPage.setDepartureDate(flightSearchData.date)
    await searchPage.setPassengers(1)
    await searchPage.searchFlights()
  })

  test('should assert elements in filter', async ({ page }) => {
    const searchResultPage = new SearchResultPage(page)

    await searchResultPage.clickFilter()
    await page.waitForTimeout(1000) // Adding delay to ensure data is available
    const filterElements = searchResultPage.getFilterElements(
      flightSearchData.from,
      flightSearchData.to
    )
    expect(filterElements.numberOfStops).toBeDefined()
    expect(filterElements.priceHeader).toBeDefined()
    expect(filterElements.airlinesHeader).toBeDefined()
    expect(filterElements.departureFromHeader).toBeDefined()
    expect(filterElements.departureToHeader).toBeDefined()
    expect(filterElements.travelTime).toBeDefined()
    expect(filterElements.applyFiltersButton).toBeDefined()
  })

  test('Apply Indigo Airlines filter, scroll to load all results, and validate results', async ({
    page
  }) => {
    const searchResultPage = new SearchResultPage(page)

    await searchResultPage.clickFilter()
    await page.waitForTimeout(1000)
    await searchResultPage.clearAndApplyAirlinesFilter(flightAirlineOption.indigo)

    // Check Filter By Result Text
    const filterText = await searchResultPage.getFilterByText(page) as string
    // Get the number after "::"
    const numberAfterColon =  await searchResultPage.getCountOfFilteredFlights(filterText)

    // Scroll to load all results and validate result Count for specified Airlines
    const totalResults = await searchResultPage.countResults()
    const count = await searchResultPage.validateResultsContainAirline(flightAirlineOption.indigo)

    expect(count).toBe(totalResults)
    expect(count).toBe(numberAfterColon)
  })

  test('Filter Non Stop Flights, scroll to load all results, and validate results', async ({
    page
  }) => {
    const searchResultPage = new SearchResultPage(page)

    await searchResultPage.clickFilter()
    await page.waitForTimeout(1000)
    await searchResultPage.selectNonStopFlights()

    const filterText = await searchResultPage.getFilterByText(page) as string
    const numberAfterColon = await searchResultPage.getCountOfFilteredFlights(filterText)

    const totalResults = await searchResultPage.countResults()
    const count = await searchResultPage.validateResultsContainsNonStopFlights()

    expect(count).toBe(0) // Ensures no flights with stop are displayed
    expect(totalResults).toBe(numberAfterColon)
  })

  test('Filter Flights with Maximum 1 Stop, scroll to load all results, and validate results', async ({
    page
  }) => {
    const searchResultPage = new SearchResultPage(page)

    await searchResultPage.clickFilter()
    await page.waitForTimeout(1000)
    await searchResultPage.selectMaxOneStopFlights()

    const filterText = await searchResultPage.getFilterByText(page) as string
    const numberAfterColon = await searchResultPage.getCountOfFilteredFlights(filterText)

    test.setTimeout(100000)
    const totalResults = await searchResultPage.countResults()
    const countOfStopNotMoreThenOne =
      await searchResultPage.validateResultsContainsMaxOneStopFlights()

    expect(countOfStopNotMoreThenOne).toBe(true) // Ensures no flights with stop are displayed
    expect(totalResults).toBe(numberAfterColon)
  })

  test('Filter Flights with reduced Travel Time, scroll to load all results, and validate results', async ({
    page
  }) => {
    const searchResultPage = new SearchResultPage(page)

    await searchResultPage.clickFilter()
    await page.waitForTimeout(1000)

    const defaultTravelTimeValue = await searchResultPage.getTravelTimeValue() as string

    // Move the slider to a new position (e.g., 100 pixels to the right)
    searchResultPage.moveSliderToPosition(100)
    await page.waitForTimeout(2000)

    // Fetch and print the updated travel time value
    const filteredTravelTimeValue = await searchResultPage.getTravelTimeValue() as string

    const isOldGreaterThanNew = isTravelTimeUpdated(
      defaultTravelTimeValue,
      filteredTravelTimeValue
    )
    expect(isOldGreaterThanNew).toBe(true)
  })
})

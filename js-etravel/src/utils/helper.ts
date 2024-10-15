// Function to convert time string to total minutes
export const convertTimeToMinutes = (timeStr: string): number => {
    const regex = /(\d+)\s*h\s*(\d+)\s*min/
    const match = timeStr.match(regex)
    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0
}

// Function to check if old time is greater than new time
export const isTravelTimeUpdated = (defaultTravelTimeValue: string, filteredTravelTimeValue: string): boolean => {
    const defaultTravelTimeInMinutes = convertTimeToMinutes(defaultTravelTimeValue)
    const newTravelTimeInMinutes = convertTimeToMinutes(filteredTravelTimeValue)
    return defaultTravelTimeInMinutes > newTravelTimeInMinutes
}

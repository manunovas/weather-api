export type TimelineDayHour = {
    datetime: string,
    temp: number,
    humidity: number,
    dew: number,
    windspeed: number,
    pressure: number,
    cloudcover: number,
    conditions: string,
    icon: string,
};

export type TimelineDay = {
    datetime: string,
    tempmax: number,
    tempmin: number,
    temp: number,
    humidity: number,
    precip: number,
    windspeed: number,
    pressure: number,
    cloudcover: number,
    sunrise: string,
    sunset: string,
    conditions: string,
    icon: string,
    stations: string[],
    hours: TimelineDayHour[],
};

export type TimelineStation = {
    name: string,
    latitude: number,
    longitude: number,
    distance: number,
}

export type Timeline = {
    queryCost: number,
    latitude: number,
    longitude: number,
    resolvedAddress: string,
    address: string,
    timezone: string,
    tzoffset: number,
    days: TimelineDay[],
    stations: Record<string, TimelineStation>,
}
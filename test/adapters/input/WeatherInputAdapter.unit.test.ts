import { APIGatewayProxyEventV2 } from "aws-lambda";
import { WeatherInputAdapter } from "../../../src/adapters/input/WeatherInputAdapter";
import { WeatherOutputAdapter } from "../../../src/adapters/output/WeatherOutputAdapter";
import { WeatherUseCases } from "../../../src/application/use-cases/WeatherUseCases";
import { Timeline } from "../../../src/domain/dtos/Timeline";
import { HttpError } from "../../../src/adapters/errors/HttpError";

describe("WeatherInputAdapter", () => {
    let service: WeatherOutputAdapter;
    let useCases: WeatherUseCases;
    let adapter: WeatherInputAdapter;

    beforeEach(() => {
        service = new WeatherOutputAdapter();
        useCases = new WeatherUseCases(service);
        adapter = new WeatherInputAdapter(useCases);
    });

    describe("getTimeline", () => {

        it("should return the timeline from given location", async () => {
            const timeline: Timeline = {
                "queryCost": 168,
                "latitude": 38.9598,
                "longitude": -77.3545,
                "resolvedAddress": "Reston, VA, United States",
                "address": "Reston,VA",
                "timezone": "America/New_York",
                "tzoffset": -4.0,
                "days": [
                    {
                        "datetime": "2025-06-01",
                        "tempmax": 68.0,
                        "tempmin": 44.9,
                        "temp": 58.6,
                        "humidity": 56.4,
                        "precip": 0.0,
                        "windspeed": 14.4,
                        "pressure": 1009.5,
                        "cloudcover": 61.6,
                        "sunrise": "05:45:46",
                        "sunset": "20:29:24",
                        "conditions": "Partially cloudy",
                        "icon": "partly-cloudy-day",
                        "stations": ["KIAD", "KJYO"],
                        "hours": [
                            {
                                "datetime": "00:00:00",
                                "temp": 52.9,
                                "humidity": 59.3,
                                "dew": 39.1,
                                "windspeed": 5.3,
                                "pressure": 1006.3,
                                "cloudcover": 0.0,
                                "conditions": "Clear",
                                "icon": "clear-night"
                            },
                            {
                                "datetime": "12:00:00",
                                "temp": 65.8,
                                "humidity": 43.1,
                                "windspeed": 13.0,
                                "pressure": 1010.5,
                                "conditions": "Partially cloudy",
                                "icon": "partly-cloudy-day"
                            }
                        ]
                    },
                    {
                        "datetime": "2025-06-02",
                        "tempmax": 74.0,
                        "tempmin": 47.0,
                        "temp": 61.7,
                        "humidity": 53.5,
                        "precip": 0.0,
                        "windspeed": 10.0,
                        "pressure": 1016.7,
                        "cloudcover": 32.1,
                        "sunrise": "05:45:24",
                        "sunset": "20:30:04",
                        "conditions": "Partially cloudy",
                        "icon": "partly-cloudy-day"
                    }
                ],
                "stations": {
                    "KIAD": {
                        "name": "Washington Dulles Intl AP",
                        "latitude": 38.95,
                        "longitude": -77.45,
                        "distance": 8339.0
                    },
                    "KJYO": {
                        "name": "Leesburg Executive Airport",
                        "latitude": 39.08,
                        "longitude": -77.56,
                        "distance": 22247.0
                    }
                }
            }
            jest.spyOn(useCases, "getTimeline").mockResolvedValueOnce(timeline);
            const result = await adapter.getTimeline({
                pathParameters: {
                    location: "Reston,VA",
                },
            } as unknown as APIGatewayProxyEventV2);
            expect(result).toEqual({
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(timeline),
            });
        });

        it("should return an http error with invalid location", async () => {
            const statusCode = 404;
            const message = "Location not found";
            jest.spyOn(useCases, "getTimeline").mockRejectedValueOnce(new HttpError(statusCode, message));
            const result = await adapter.getTimeline({
                pathParameters: {
                    location: "Forbidden City",
                },
            } as unknown as APIGatewayProxyEventV2);
            expect(result).toEqual({
                statusCode,
                body: message,
            });
        });

        it("should return an http client error without pathParameters", async () => {
            const result = await adapter.getTimeline({} as unknown as APIGatewayProxyEventV2);
            expect(result).toEqual({
                statusCode: 400,
                body: "Location is required",
            });
        });

        it("should return an http client error without pathParameters location", async () => {
            const result = await adapter.getTimeline({
                pathParameters: {},
            } as unknown as APIGatewayProxyEventV2);
            expect(result).toEqual({
                statusCode: 400,
                body: "Location is required",
            });
        });

        it("should return a generic error with internal error", async () => {
            jest.spyOn(useCases, "getTimeline").mockRejectedValueOnce(new Error("Division by 0"));
            const result = await adapter.getTimeline({
                pathParameters: {
                    location: "Forbidden City",
                },
            } as unknown as APIGatewayProxyEventV2);
            expect(result).toEqual({
                statusCode: 500,
                body: "Internal server error",
            });
        });

    });

});
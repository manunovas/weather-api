import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { WeatherInputPort } from "../../application/ports/input/WeatherInputPort";
import { GetTimelineDto } from "../../domain/dtos/GetTimelineDto";
import { HttpError } from "../errors/HttpError";

export class WeatherInputAdapter {
    private readonly inputPort: WeatherInputPort;

    constructor(inputPort: WeatherInputPort) {
        this.inputPort = inputPort;
    }

    async getTimeline(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
        let response: APIGatewayProxyResultV2;
        if (!event.pathParameters || !event.pathParameters.location) {
            return {
                statusCode: 400,
                body: "Location is required",
            };
        }
        const dto: GetTimelineDto = {
            location: event.pathParameters.location,
        };
        try {
            const timeline = await this.inputPort.getTimeline(dto);
            response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(timeline),
            }
        } catch (error) {
            if (error instanceof HttpError) {
                response = {
                    statusCode: error.status,
                    body: error.message,
                };
            } else {
                response = {
                    statusCode: 500,
                    body: "Internal server error",
                };
            }
        }
        return response;
    }
}

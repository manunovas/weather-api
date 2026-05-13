import "dotenv/config"
import { WeatherOutputPort } from "../../application/ports/output/WeatherOutputPort";
import { Timeline } from "../../domain/dtos/Timeline";
import axios from "axios";
import { HttpError } from "../errors/HttpError";

export class WeatherOutputAdapter implements WeatherOutputPort {
    private readonly BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

    async getTimeline(location: string): Promise<Timeline> {
        const key = process.env.VISUAL_CROSSING_KEY;
        const url = `${this.BASE_URL}/${location}?key=${key}`;
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new HttpError(response.status, response.statusText);
        }
        return response.data as unknown as Timeline;
    }
}

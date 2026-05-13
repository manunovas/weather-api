import { Timeline } from "../../../domain/dtos/Timeline";

export interface WeatherOutputPort {
    getTimeline(location: string): Promise<Timeline>;
}

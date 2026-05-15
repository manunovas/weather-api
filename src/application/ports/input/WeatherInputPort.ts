import { GetTimelineDto } from "../../../domain/dtos/GetTimelineDto";
import { Timeline } from "../../../domain/dtos/Timeline";

export interface WeatherInputPort {
    getTimeline(dto: GetTimelineDto): Promise<Timeline>;
}

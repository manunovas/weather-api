import { GetTimelineDto } from "../../domain/dtos/GetTimelineDto";
import { Timeline } from "../../domain/dtos/Timeline";
import { WeatherInputPort } from "../ports/input/WeatherInputPort";
import { WeatherOutputPort } from "../ports/output/WeatherOutputPort";

export class WeatherUseCases implements WeatherInputPort {
    private readonly outputPort: WeatherOutputPort;

    constructor(outputPort: WeatherOutputPort){
        this.outputPort = outputPort;
    }

    async getTimeline(dto: GetTimelineDto): Promise<Timeline> {
        return this.outputPort.getTimeline(dto.location);
    }
}

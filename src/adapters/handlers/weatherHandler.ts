import { WeatherUseCases } from "../../application/use-cases/WeatherUseCases";
import { WeatherInputAdapter } from "../input/WeatherInputAdapter";
import { WeatherOutputAdapter } from "../output/WeatherOutputAdapter";

const service = new WeatherOutputAdapter();
const useCases = new WeatherUseCases(service);
const adapter = new WeatherInputAdapter(useCases);

export const getTimeline = adapter.getTimeline.bind(adapter);

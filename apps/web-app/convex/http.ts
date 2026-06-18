import { httpRouter } from "convex/server";
import { registerClerkRoutes } from "./http/clerk";
import { registerPromptRoutes } from "./http/prompts";

const http = httpRouter();

registerClerkRoutes(http);
registerPromptRoutes(http);

export default http;

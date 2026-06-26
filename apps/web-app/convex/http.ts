import { httpRouter } from "convex/server";
import { registerClerkRoutes } from "./http/clerk";
import { registerPromptRoutes } from "./http/prompts";
import { registerRestRoutes } from "./http/rest";

const http = httpRouter();

registerClerkRoutes(http);
registerPromptRoutes(http);
registerRestRoutes(http);

export default http;

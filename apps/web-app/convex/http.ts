import { httpRouter } from "convex/server";
import { registerClerkRoutes } from "./http/clerk";
import { registerManagementRoutes } from "./http/management";
import { registerPromptRoutes } from "./http/prompts";

const http = httpRouter();

registerClerkRoutes(http);
registerPromptRoutes(http);
registerManagementRoutes(http);

export default http;

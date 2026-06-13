import { ApiKeyRecord } from '@promptx/shared';
// Canonical cross-service shapes now live in @promptx/shared. Re-export the
// ones used across the edge for convenience.
export type {
	DeploymentEnv,
	KVPromptVariant,
	KVPromptConfig,
	ApiKeyRecord,
	PromptKVKey,
	ApiKeyKVKey,
	GetPromptResponse,
	RoutingInfo,
} from '@promptx/shared';

export type Variables = {
	teamId: string;
	apiKey: ApiKeyRecord;
	sessionId?: string;
};

export type AppEnv = {
	Bindings: Env;
	Variables: Variables;
};

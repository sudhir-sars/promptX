/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_apiKey from "../actions/apiKey.js";
import type * as actions_deployments from "../actions/deployments.js";
import type * as actions_email from "../actions/email.js";
import type * as activities from "../activities.js";
import type * as apiKeys from "../apiKeys.js";
import type * as deployments from "../deployments.js";
import type * as emails_invite from "../emails/invite.js";
import type * as emails_inviteAccepted from "../emails/inviteAccepted.js";
import type * as emails_layout from "../emails/layout.js";
import type * as emails_memberRemoved from "../emails/memberRemoved.js";
import type * as emails_roleChanged from "../emails/roleChanged.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_cascade from "../lib/cascade.js";
import type * as lib_defaults from "../lib/defaults.js";
import type * as lib_deployments from "../lib/deployments.js";
import type * as lib_email from "../lib/email.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_invites from "../lib/invites.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as prompts from "../prompts.js";
import type * as search from "../search.js";
import type * as teams_invite from "../teams/invite.js";
import type * as teams_member from "../teams/member.js";
import type * as teams_team from "../teams/team.js";
import type * as types_index from "../types/index.js";
import type * as users from "../users.js";
import type * as versions from "../versions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/apiKey": typeof actions_apiKey;
  "actions/deployments": typeof actions_deployments;
  "actions/email": typeof actions_email;
  activities: typeof activities;
  apiKeys: typeof apiKeys;
  deployments: typeof deployments;
  "emails/invite": typeof emails_invite;
  "emails/inviteAccepted": typeof emails_inviteAccepted;
  "emails/layout": typeof emails_layout;
  "emails/memberRemoved": typeof emails_memberRemoved;
  "emails/roleChanged": typeof emails_roleChanged;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/cascade": typeof lib_cascade;
  "lib/defaults": typeof lib_defaults;
  "lib/deployments": typeof lib_deployments;
  "lib/email": typeof lib_email;
  "lib/errors": typeof lib_errors;
  "lib/invites": typeof lib_invites;
  "lib/permissions": typeof lib_permissions;
  prompts: typeof prompts;
  search: typeof search;
  "teams/invite": typeof teams_invite;
  "teams/member": typeof teams_member;
  "teams/team": typeof teams_team;
  "types/index": typeof types_index;
  users: typeof users;
  versions: typeof versions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

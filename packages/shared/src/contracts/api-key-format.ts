/**
 * The API key token grammar, shared between the Web App (which *generates* tokens) and the Edge Worker (which *parses* them).
 *
 *   Format:  xe_live_<keyId>_<teamId>.<secret>
 *            └────── metadata ──────┘ └secret┘
 *
 * Parsing/validation lives in `utils/parse-api-key`.
 */
export const API_KEY_PREFIX = "xe";
export const API_KEY_MODE_LIVE = "live";
export const API_KEY_METADATA_SEPARATOR = "_";
export const API_KEY_SECRET_DELIMITER = ".";

/** Number of underscore-separated parts in the metadata segment. */
export const API_KEY_METADATA_PARTS = 4;

export interface ParsedApiKey {
  keyId: string;
  teamId: string;
  secret: string;
}

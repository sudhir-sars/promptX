import {
  API_KEY_METADATA_PARTS,
  API_KEY_METADATA_SEPARATOR,
  API_KEY_MODE_LIVE,
  API_KEY_PREFIX,
  API_KEY_SECRET_DELIMITER,
  type ParsedApiKey,
} from "../contracts/api-key-format";

/**
 * Parse and validate an API key token of the form
 * `xe_live_<keyId>_<teamId>.<secret>`. Returns `null` for any malformed token.
 * Pure — does not verify the secret against a stored hash.
 */
export function parseApiKey(token: string): ParsedApiKey | null {
  const delimiterIndex = token.lastIndexOf(API_KEY_SECRET_DELIMITER);
  if (delimiterIndex === -1) return null;

  const metadata = token.slice(0, delimiterIndex);
  const secret = token.slice(delimiterIndex + 1);
  if (!secret) return null;

  const parts = metadata.split(API_KEY_METADATA_SEPARATOR);
  if (parts.length !== API_KEY_METADATA_PARTS) return null;

  const [prefix, mode, keyId, teamId] = parts;
  if (prefix !== API_KEY_PREFIX || mode !== API_KEY_MODE_LIVE) return null;
  if (!keyId || !teamId) return null;

  return { keyId, teamId, secret };
}

import AES from 'crypto-js/aes';
import EncUtf8 from 'crypto-js/enc-utf8';
import stringify from 'json-stringify-safe';
import LZ from 'lz-string';
import {
  createTransform,
  Transform,
  TransformIn,
  TransformOut
} from 'redux-persist';
export type TransformConfigType = {
  whitelist?: Array<string>, // data to hash like: auth, pin code,.....
  blacklist?: Array<string>,
  secretKey: string, // salt to hash data
  onError?: (e: Error) => void
};

/**
 * hash data to save to localStoregate
 * @param {TransformConfigType} config
 */
export default function createCompressEncryptTransform(
  config: TransformConfigType
) {
  if (!config) throw new Error(createErrorMessage('missing config object'));
  const { secretKey, onError } = config;
  if (!secretKey || typeof secretKey !== 'string')
    throw new Error(createErrorMessage('missing secret key from config'));
  if (onError && typeof onError !== 'function')
    throw new Error(createErrorMessage('onError has to be a function'));

  return createTransform(
    createInboundTransform(config),
    createOutboundTransform(config),
    config
  );
}

const createInboundTransform = (config: TransformConfigType) => state => {
  const { secretKey, onError } = config;
  try {
    if (state == undefined) {
      return state;
    }
    const stringifiedState = stringify(state);
    const compressedState = LZ.compressToBase64(stringifiedState);
    return AES.encrypt(compressedState, secretKey).toString();
  } catch (e) {
    e.message = createErrorMessage(
      'error during persist transformation: ' + e.message
    );
    onError ? onError(e) : console.error(e);
    return state;
  }
};

const createOutboundTransform = (config: TransformConfigType) => (
  state: any
) => {
  const { secretKey, onError } = config;
  if (typeof state !== 'string') {
    const e = new Error(
      createErrorMessage('expected outbound state to be a string')
    );
    onError ? onError(e) : console.error(e);
    return state;
  }

  try {
    const decryptedStateString = AES.decrypt(state, secretKey).toString(
      EncUtf8
    );
    const decompressedState = LZ.decompressFromBase64(decryptedStateString);
    return JSON.parse(decompressedState);
  } catch (e) {
    e.message = createErrorMessage(
      'error during state reconstruction: ' + e.message
    );
    onError ? onError(e) : console.error(e);
    return state;
  }
};

const createErrorMessage = (msg: string) => `transform sercurity ==>:: ${msg}`;

import { Buffer } from "buffer";


const START_PATTERN: Uint8Array = new Uint8Array([0x01,0x2b]);
const END_PATTERN: Uint8Array = new Uint8Array([0x86, 0x84]);

// Error types
enum StreamTypedError {
  NoStartPattern = 'NoStartPattern',
  NoEndPattern = 'NoEndPattern',
  InvalidPrefix = 'InvalidPrefix'
}

// Function to parse the body text from a typed stream
export function parse(stream: Uint8Array): Result<string, StreamTypedError> {
  // Find the start index and drain
  let startIndex = -1;
  for (let idx = 0; idx <= stream.length - START_PATTERN.length; idx++) {
    if (compareUint8Arrays(stream.slice(idx, idx + START_PATTERN.length), START_PATTERN)) {
      startIndex = idx + START_PATTERN.length;
      break;
    }
  }
  if (startIndex === -1) {
    return { error: StreamTypedError.NoStartPattern };
  }

  // Find the end index and truncate
  let endIndex = -1;
  for (let idx = startIndex; idx <= stream.length - END_PATTERN.length; idx++) {
    if (compareUint8Arrays(stream.slice(idx, idx + END_PATTERN.length), END_PATTERN)) {
      endIndex = idx;
      break;
    }
  }
  if (endIndex === -1) {
    return { error: StreamTypedError.NoEndPattern };
  }

  // Extract the relevant part of the stream
  const relevantBytes = stream.slice(startIndex, endIndex);

  // Convert to string and handle potential prefix
  const decodedString = new TextDecoder().decode(relevantBytes);
  const result = dropChars(decodedString);

  return result;
}

// Helper function to compare Uint8Arrays
function compareUint8Arrays(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Function to drop prefix characters from a string
function dropChars(string: string): Result<string, StreamTypedError> {
  // Define the number of chars to drop based on analysis of the byte data
  const prefixLength = string.charCodeAt(0) === 0x6 ? 1 : 3;

  // Check if the prefix is valid
  if (string.length < prefixLength) {
    return { error: StreamTypedError.InvalidPrefix };
  }

  // Remove the prefix and return the result
  const result = string.slice(prefixLength);
  return { value: result };
}

// Result type
type Result<T, E> = { value: T } | { error: E };
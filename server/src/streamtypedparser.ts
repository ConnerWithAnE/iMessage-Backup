const START_PATTERN = "012B"; // HEX representation of [0x01, 0x2b]
const END_PATTERN = "8684";   // HEX representation of [0x86, 0x84]

// Error types
enum StreamTypedError {
  NoStartPattern = 'NoStartPattern',
  NoEndPattern = 'NoEndPattern',
  InvalidPrefix = 'InvalidPrefix',
}

// Helper function to format HEX string with spaces
function formatHexWithSpaces(hex: string): string {
  return hex.match(/.{1,2}/g)?.join(' ') || '';
}

// Function to parse the body text from a HEX string
export function parse(hexStream: string): Result<string, StreamTypedError> {
  // Find the start pattern
  console.log(formatHexWithSpaces(hexStream));
  const startIndex = hexStream.indexOf(START_PATTERN);
  if (startIndex === -1) {
    return { error: StreamTypedError.NoStartPattern };
  }

  // Find the end pattern
  const endIndex = hexStream.indexOf(END_PATTERN);
  if (endIndex === -1) {
    return { error: StreamTypedError.NoEndPattern };
  }

  // Extract the relevant part of the hex stream (between the patterns)
  const relevantHex = hexStream.slice(startIndex, endIndex);

  // Convert the relevant HEX part to a string
  const decodedString = hexToUTF8String(relevantHex);

  // Handle potential prefix
  const result = dropChars(decodedString);

  return result;
}

function hexToUTF8String(hex: string): string {
  // Convert HEX to a byte array
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  // Decode byte array into UTF-8 string
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
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



export function test1() {
  const exampleHexStream = "012b546865206d6573736167658684"; // Represents the stream with start/end patterns

const result = parse(exampleHexStream);
if ('error' in result) {
  console.error('Error:', result.error);
} else {
  console.log('Parsed message:', result.value); // Should output "The message"
}
}

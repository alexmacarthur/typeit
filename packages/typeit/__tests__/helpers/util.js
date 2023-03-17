import getParsedBody from "../../src/helpers/getParsedBody";
import { DEFAULT_OPTIONS } from "../../src/constants";
import getAllChars from "../../src/helpers/getAllChars";
import expandTextNodes from "../../src/helpers/expandTextNodes";
import {
  chunkStringAsHtml,
  maybeChunkStringAsHtml,
} from "../../src/helpers/chunkStrings";

export const emojiFiveDigitString = "1️⃣2️⃣3️⃣4️⃣5️⃣";

export const defaultGetParsedBody = (content) => {
  return getParsedBody(content, DEFAULT_OPTIONS.stringSpliterator);
};

export const defaultGetAllChars = (el) => {
  return getAllChars(el, DEFAULT_OPTIONS.stringSpliterator);
};

export const defaultChunkStringAsHtml = (string) => {
  return chunkStringAsHtml(string, DEFAULT_OPTIONS.stringSpliterator);
};

export const defaultMaybeChunkStringAsHtml = (string, asHtml = true) => {
  return maybeChunkStringAsHtml(
    string,
    asHtml,
    DEFAULT_OPTIONS.stringSpliterator
  );
};

export const defaultExpandTextNodes = (el) => {
  return expandTextNodes(el, DEFAULT_OPTIONS.stringSpliterator);
};

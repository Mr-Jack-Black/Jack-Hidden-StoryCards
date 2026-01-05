// Put this in your Library

/*
 * JackHiddenStoryCards(text)
 * Iterates through all AI Dungeon story cards.
 * Applies JackHideText to each story card entry field.
 * Updates a story card only if its entry content changes.
 * Returns the main text with all hidden blocks decoded.
 */
function JackHiddenStoryCards(text) {
  for (let i = 0; i < storyCards.length; i++) {
    let card = storyCards[i];
    if (!card || typeof card.entry !== "string") continue;

    const originalEntry = card.entry;
    const processedEntry = JackHideText(originalEntry);

    if (processedEntry === originalEntry) continue;

    updateStoryCard(
      i,
      card.keys,
      processedEntry,
      card.type,
      card.title,
      card.description
    );
  }
  return JackUnhideText(text);
}

/*
 * JackHideText(text)
 * Scans text line by line for control labels.
 * ##hide starts a block where all following lines are encoded.
 * ##unhide ChangeMe starts a block where all following lines are decoded.
 * Encoding/decoding uses a reversible character offset and supports all symbols.
 * Processing continues until ##end or end of text is reached.
 * Outputs normalized blocks using ##hidden … ##end markers.
 */
function JackHideText(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let mode = null; // null | "hide" | "unhide"
  const OFFSET = 17;
  const PASSWORD = "ChangeMe";

  const shift = ch =>
    String.fromCharCode((ch.charCodeAt(0) + OFFSET) & 0xffff);

  const unshift = ch =>
    String.fromCharCode((ch.charCodeAt(0) - OFFSET + 0x10000) & 0xffff);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!mode && /^##hide$/i.test(trimmed)) {
      mode = "hide";
      out.push("##hidden");
      continue;
    }

    if (!mode) {
      const m = /^##unhide\s+(\S+)$/.exec(trimmed);
      if (m && m[1] === PASSWORD) {
        mode = "unhide";
        out.push("##unhidden");
        continue;
      }
    }

    if (mode && /^##end$/i.test(trimmed)) {
      mode = null;
      out.push("##end");
      continue;
    }

    if (mode === "hide") {
      let coded = "";
      for (let j = 0; j < line.length; j++) coded += shift(line[j]);
      out.push(coded);
    } else if (mode === "unhide") {
      let decoded = "";
      for (let j = 0; j < line.length; j++) decoded += unshift(line[j]);
      out.push(decoded);
    } else {
      out.push(line);
    }
  }

  if (mode) out.push("##end");
  return out.join("\n");
}

/*
 * JackUnhideText(text)
 * Scans text for ##hidden … ##end blocks.
 * Decodes the contents of each block using the inverse character offset.
 * Multiple hidden blocks are supported in a single text.
 * Control labels are removed and only the restored text is returned.
 */
function JackUnhideText(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let unhiding = false;
  const OFFSET = 17;

  const unshift = ch =>
    String.fromCharCode((ch.charCodeAt(0) - OFFSET + 0x10000) & 0xffff);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!unhiding && /^\s*##\s*hidden\s*$/i.test(line)) {
      unhiding = true;
      continue;
    }

    if (unhiding && /^\s*##\s*end\s*$/i.test(line)) {
      unhiding = false;
      continue;
    }

    if (unhiding) {
      let decoded = "";
      for (let j = 0; j < line.length; j++) decoded += unshift(line[j]);
      out.push(decoded);
    } else {
      out.push(line);
    }
  }

  return out.join("\n");
}

# Jack-Hidden-StoryCards
This script adds reversible hidden text support to AI Dungeon Story Card entries. It allows you to hide or reveal content using simple control labels, while keeping everything fully recoverable and compatible with symbols and special characters.

---

## Purpose

The script solves three problems:

1. Hide sensitive or meta content inside Story Cards.
2. Restore hidden content deterministically when needed.
3. Ensure the context seen by AI shows the readable version.

Hidden content is encoded using a reversible character offset, not encryption. This is intentional and designed for tooling, not security.

---

## Features

* Line-based parsing, stable in AI Dungeon JS
* Works with all Unicode symbols
* Supports multiple hide/unhide blocks
* Password-protected unhide command
* Story Cards are only updated when changes occur
* Safe fallback if `##end` is missing

---

## Control Labels

The script reacts to the following labels. Labels must start exactly with `##` and contain no space between `##` and the command.

### Hide block

```
##hide
text to hide
##end
```

The hidden text is encoded and stored in the Story Card as:

```
##hidden
<encoded text>
##end
```

### Unhide block (password protected)

```
##unhide <password>
encoded text
##end
```

Unhiding only occurs if the password matches exactly.
Password can be easily changed in the top of the library code.
Default password = "ChangeMe"

---

## Installation

### Step 1: Install library code

1. Open **Edit Scenario → Details → Edit Scripts**
2. Paste the full script code into the **Library file** 
4. Save the file

This file must contain:

* `JackHideText`
* `JackUnhideText`
* `JackHiddenStoryCards`

---

### Step 2: Modify the context file

Add a single function call in your **context file** modifier.

Example context setup:

```javascript
const modifier = (text) => {

  // JackHiddenStoryCards(text) does 2 things:
  // 1. Story Card Processing:
  //    - Hides text in StoryCards that is between ##hide ... ##end -labels.
  //    - Unhides text in StoryCards that is between ##unhide <password> ... ##end -labels.
  // 2. Processes input text so that all hidden text blocks are visible,
  //    and ##hide/##end -labels are removed.
  text = JackHiddenStoryCards(text);

  // WARNING: Compatibility issues may arise with other story card processing scripts
  //          if they modify hidden blocks.
  
  return { text }
}
```

No other integration is required.

---

## How It Works Internally

* Story Cards are scanned one by one
* The `entry` field is processed with `JackHideText`
* Cards are updated only if their content changes
* Hidden text is encoded using a fixed character offset
* Decoding uses the exact inverse operation
* The main story text is always returned fully readable

---

## MIT License

Free to use, modify, and embed in AI Dungeon scripts.

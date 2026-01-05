// Only one function call needed in Context-hook.
const modifier = (text) => {

  // JackHiddenStoryCards(text) does 2 things:
  // 1. Story Card Processing:
  //    - Hides text in StoryCards that is between ##hide ... ##end -labels.
  //    - Unhides text in StoryCards that is between ##unhide <password> ... ##end -labels.
  // 2. Processes input text so that all hidden text blocks are visible, 
  //    and ##hide/##end -labels are removed.
  text = JackHiddenStoryCards(text);

  // WARNING: Compatibility issues may arise with other story card processing scripts if the
  //          other script modify the hidden-blocks.
  
  return { text }
}

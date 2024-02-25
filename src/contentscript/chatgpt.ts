import type { summarySourceText } from "../lib/utils";
let promptTemplate =
  "Condense the provided text into concise bulletpoints, selecting a fitting emoji for each, and respond in {{SELECTED_LANGUAGE}} using the content: {{CONTENT}}";
let prompt = promptTemplate;
let lang = "japanese";
function replaceTemplateVariables(
  template: string,
  variables: { [key: string]: string },
): string {
  return Object.keys(variables).reduce((currentTemplate, key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    return currentTemplate.replace(regex, variables[key]);
  }, template);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case "prompt":
        prompt = newValue as string;
        break;
      case "lang":
        lang = newValue as string;
        break;
    }
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`,
    );
  }
});

if (window !== window.top) {
  window.addEventListener("message", (response) => {
    const data = response.data as summarySourceText;
    if (data.title && data.text) {
      const variables = {
        TITLE: data.title,
        CONTENT: data.text,
        URL: data.url,
        SELECTED_LANGUAGE: lang,
      };
      const filledPrompt = replaceTemplateVariables(promptTemplate, variables);
      const textarea = document.getElementById(
        "prompt-textarea",
      ) as HTMLTextAreaElement;
      if (!textarea) {
        console.log("textarea not found");
        return;
      }
      textarea.value = filledPrompt;
      textarea.focus();
      textarea.setSelectionRange(filledPrompt.length, filledPrompt.length);
    } else {
      console.log("messsage response.data not found");
    }
  });
}

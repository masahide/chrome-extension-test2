export type ArticleSnapshot = {
  title: string;
  url: string;
  type: ArticleSnapshotType;
  content: string;
  //textContent: string;
  id: string;
};

export enum ArticleSnapshotType {
  Youtube = "Youtube",
  FullText = "FullText",
  Selection = "Selection",
  Unknown = "Unknown",
}

export enum TextType {
  Selection = "Selection",
  Transcription = "Transcription",
  FullText = "FullText",
}

const wrap = <T>(task: Promise<Response>): Promise<T> => {
  return new Promise((resolve, reject) => {
    task
      .then((response) => {
        if (!response.ok) {
          response
            .text()
            .then((text) => {
              reject(text);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          response
            .json()
            .then((json) => {
              // jsonが取得できた場合だけresolve
              resolve(<Promise<T>>json);
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const fetcher = <T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  return wrap<T>(fetch(input, init));
};

export type OpenAIRequest = {
  model: string;
  messages: Message[];
};
export type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  prompt_filter_results: PromptFilterResult[];
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
};
type PromptFilterResult = {
  prompt_index: number;
  content_filter_results: ContentFilterResults;
};
type ContentFilterResults = {
  hate: FilterResult;
  self_harm: FilterResult;
  sexual: FilterResult;
  violence: FilterResult;
};
type FilterResult = {
  filtered: boolean;
  severity: string;
};
type Choice = {
  finish_reason: string;
  index: number;
  message: Message;
  content_filter_results: ContentFilterResults;
};
type Message = {
  role: string;
  content: string;
};
type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

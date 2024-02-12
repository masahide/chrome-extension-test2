export type Article = {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
} | null;

type Transcription = {
  text: string;
  videoID: string;
};

export type ExtractContent = {
  url: string;
  selectText: string;
  transcription: Transcription | null;
  data: Article;
};

export const NewExtractContentFromString = (s: string): ExtractContent => {
  return {
    url: "https://example.com",
    selectText: "",
    transcription: null,
    data: {
      title: "",
      content: s,
      textContent: "",
      length: s.length,
      excerpt: "",
      byline: "",
      dir: "",
      siteName: "",
      lang: "",
      publishedTime: "",
    },
  };
};

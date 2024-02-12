import { Readability } from "@mozilla/readability";
import type { Article } from "../lib/utils";

// @mozilla/readability を使用して本文を抽出する関数
function extractContent(): Article {
  let article: Article = null;
  try {
    const documentClone = document.cloneNode(true) as Document;
    article = new Readability(documentClone).parse();
  } catch (e) {
    console.log("readability error", e);
    const s =
      window.document.body.querySelector("main") || window.document.body;
    if (s) {
      article = {
        title: window.document.title,
        content: s.innerHTML,
        textContent: s.innerText,
        length: s.innerHTML.length,
        excerpt: "",
        byline: "",
        dir: "",
        siteName: "",
        lang: "",
        publishedTime: "",
      };
    }
  }
  return article;
}

chrome.runtime.onMessage.addListener(async (request, options, sendResponse) => {
  //console.log("request.name:", request.name);
  let url = new URL(window.location.href);
  if (request.name == "getSelection") {
    let str = window.getSelection()?.toString();
    // selection text
    if (str && str.length > 0) {
      sendResponse({
        url: url,
        selectText: str,
        transcription: null,
        data: null,
      });
      return;
    }
  }
  // youtube
  let vid = getVideoID(window.location.href);
  console.log("vid:", vid);
  if (vid) {
    let res = await getTranscription();
    sendResponse({
      url: url,
      selectText: "",
      transcription: res,
      data: null,
    });
    console.log("getTranscription ", res);
    return;
  }
  // full text
  sendResponse({
    url: url,
    transcription: null,
    selectText: "",
    data: extractContent(),
  }); // snub them.
});

function getVideoID(url: string) {
  let t =
      /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i,
    r = url.match(t);
  return r ? r[9] : null;
}
async function getTranscription() {
  var i;
  let videoID = getVideoID(window.location.href);
  if (!videoID) return;
  let youtubeRes = await fetch(
    `https://www.youtube.com/watch?v=${videoID}`,
  ).then((res) => res.text());
  if (!youtubeRes) return;
  let jsonStrs = youtubeRes.match(/ytInitialPlayerResponse\s*=\s*({.+?});/s);
  if (jsonStrs)
    try {
      let data = JSON.parse(jsonStrs[1]);
      if (!data) return;
      let n =
        (i = data.captions.playerCaptionsTracklistRenderer.captionTracks) ==
        null
          ? void 0
          : i[0];
      return { text: await (await fetch(n.baseUrl)).text(), videoId: videoID };
    } catch (data) {
      return;
    }
}

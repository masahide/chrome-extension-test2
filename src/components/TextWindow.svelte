<script lang="ts">
  import type { OpenAIRequest, ArticleSnapshot } from "../lib/utils";
  import { fetcher, TextType, ArticleSnapshotType } from "../lib/utils";
  export let windowID: number;
  export let snapshot: ArticleSnapshot;

  function getSelection(windowID: number) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        let tabid = tabs[i].id;
        //console.log("tabID:", tabid);
        if (tabid) {
          chrome.tabs.sendMessage(tabid, {
            name: TextType.Selection,
            windowID: windowID,
          });
        }
      }
    });
  }
  let title = "";
  let text = "";
  let transcripts: Transcript[] = [];
  $: snapshot, updateText();

  type Transcript = {
    start: string;
    text: string;
  };
  function secondsToHMS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return [hours, minutes, sec]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  }
  function parseXmlToTranscript(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const texts = xmlDoc.getElementsByTagName("text");

    transcripts = [];
    for (let i = 0; i < texts.length; i++) {
      const textElement = texts[i];
      const start = textElement.getAttribute("start");
      const text = textElement.textContent;
      if (start && text) {
        transcripts.push({
          start: secondsToHMS(parseFloat(start)),
          text: text,
        });
      }
    }
  }
  function updateText() {
    if (!snapshot) {
      return;
    }
    switch (snapshot.type) {
      case ArticleSnapshotType.Youtube:
        parseXmlToTranscript(snapshot.content);
        break;
      case ArticleSnapshotType.FullText:
        title = snapshot.title;
        text = snapshot.content;
        break;
      case ArticleSnapshotType.Selection:
        title = snapshot.title;
        text = snapshot.content;
        break;
      case ArticleSnapshotType.Unknown:
        title = snapshot.title;
        text = "unknown type";
        break;
    }
  }
</script>

<div class="chat-message user-message bg-secondary-subtle">
  {#if text.length > 0}
    <span>tile:{title}</span>
    <span>{text}</span>
    <button
      type="button"
      class="btn btn-primary"
      on:click={() => {
        getSelection(windowID);
      }}>要約</button
    >
  {:else if transcripts.length > 0}
    {#each transcripts as t}
      <div class="flex gap2">
        <span>{t.start}</span>
        <span>{t.text}</span>
      </div>
    {/each}
  {:else}
    <button
      type="button"
      class="btn btn-primary"
      on:click={() => {
        getSelection(windowID);
      }}>文章抽出</button
    >
  {/if}
</div>

<style>
</style>

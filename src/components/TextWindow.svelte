<script lang="ts">
  import type { OpenAIRequest, ArticleSnapshot } from "../lib/utils";
  import { fetcher, TextType } from "../lib/utils";
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
</script>

<div class="chat-message user-message bg-secondary-subtle">
  {#if snapshot}
    <span>tile:{snapshot.title}</span>
    <span>{snapshot.content}</span>
    <button
      type="button"
      class="btn btn-primary"
      on:click={() => {
        getSelection(windowID);
      }}>要約</button
    >
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

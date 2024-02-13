<script lang="ts">
  import type { Article, Transcription } from "../lib/utils";
  let text = "";

  function getSelection() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        let tabid = tabs[i].id;
        //console.log("tabID:", tabid);
        if (tabid) {
          chrome.tabs.sendMessage(tabid, { name: "getSelection" });
        }
      }
    });
  }
  chrome.runtime.onMessage.addListener(async function (message, sender) {
    switch (message.name) {
      case "getSelection":
        let data: string = message.data;
        text = data;
        return;
      case "getTranscription":
        const transcription: Transcription = message.data;
        text = transcription.text;
        return;
      case "getFullText":
        const article: Article = message.data;
        if (article) {
          text = article.textContent;
        }
        return;
      default:
        text = "unknown message:" + message;
        console.log("unknown message:", message);
    }
  });
</script>

<!--
<nav class="navbar navbar-expand-lg navbar-light bg-dark fixed-top py-1 px-4">
  <a class="navbar-brand" href="#">AI要約</a>
</nav>
-->
<!-- チャットメッセージ表示エリア -->
<div class="flex h-full flex-col">
  <div class="relative h-full w-full flex-1 overflow-auto transition-width">
    <div class="flex-1 overflow-hidden">
      <div class="chat-box flex h-full flex-col" id="chatBox">
        <div class="sticky-top p-2 navbar-light bg-dark">
          <div class="absolute"></div>
          <div class="flex">
            <div
              class="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20"
              id="radix-:r60:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <div><span class="text-token-text-secondary">AI要約</span></div>
            </div>
          </div>
          <div class="flex gap-2 pr-1"></div>
        </div>
        <!-- チャットメッセージの例 -->
        <div class="chat-message bot-message bg-secondary-subtle">
          こんにちは、何かお手伝いできることはありますか？
        </div>
        <div class="chat-message user-message bg-secondary-subtle">
          hogehoge
        </div>
        <div class="chat-message bot-message bg-secondary-subtle">
          {#if text}
            <span>{text}</span>
          {:else}
            none
          {/if}
        </div>
      </div>
    </div>
    <!-- 固定チャット入力欄 -->
    <div class="fixed-bottom">
      <input
        type="text"
        id="messageInput"
        class="form-control"
        placeholder="メッセージを入力..."
        style="margin: 10px;"
      />
      <div>
        <button class="" on:click={getSelection}>get</button>
      </div>
    </div>
  </div>
</div>

<style>
  .h-full {
    height: 100%;
  }
  .flex-col {
    display: flex;
    flex-direction: column;
  }
  .flex-1 {
    flex: 1 1 0%;
  }
  .sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
    margin-bottom: 0.375rem;
    display: flex;
    height: 3.5rem;
    align-items: center;
    justify-content: space-between;
  }
  .fixed-bottom {
    z-index: 1030;
  }
  .chat-box {
    height: 100%;
    overflow-y: auto;
    position: fixed;
    width: 100%;

    /*
    top: 56px;
    bottom: 62px; 
    overflow-y: scroll;
    */
    padding: 0 12px; /* パディングで少し余白を持たせる */
  }
  .chat-message {
    padding: 10px;
    margin: 5px 0;
  }
  /*
  .user-message {
    background-color: #007bff;
    color: white;
  }
  .bot-message {
    background-color: #e9ecef;
  }
  .chat-box {
    overflow-y: scroll;
  }
  .chat-message {
    padding: 10px;
    margin: 5px 0;
  }
  */
</style>

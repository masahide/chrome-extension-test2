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

<!-- チャットメッセージ表示エリア -->
<div class="panel">
  <div class="header">
    <a class="navbar-brand" href="#">AI要約</a>
  </div>
  <div class="mainContent">
    <!-- チャットメッセージの例 -->
    <div class="chat-message bot-message bg-secondary-subtle">
      こんにちは、何かお手伝いできることはありますか？
    </div>
    <div class="chat-message user-message bg-secondary-subtle">hogehoge</div>
    <div class="chat-message bot-message bg-secondary-subtle">
      {#if text}
        <span>{text}</span>
      {:else}
        none
      {/if}
    </div>
  </div>
  <div class="footer">
    <!-- 固定チャット入力欄 -->
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

<style>
  .panel {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0;
  }
  .header {
    flex: 0 0 auto; /*固定の高さにする*/
    padding: 20px;
    text-align: center;
  }
  .mainContent {
    flex: 1 1 auto; /*残りの領域全体を占有する*/
    overflow-y: scroll;
    padding: 20px;
  }
  .footer {
    flex: 0 0 auto; /*固定の高さにする*/
    padding: 20px;
    text-align: center;
  }
</style>

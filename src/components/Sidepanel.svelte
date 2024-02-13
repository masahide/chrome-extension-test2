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

<div class="d-flex gap-2"></div>
<div class="container py-5">
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-body chat-box" id="chatBox">
          <!-- チャットメッセージの例 -->
          <div class="chat-message bot-message">
            ウェブページの文章を要約します
          </div>
          <div class="chat-message user-message">
            Chat GPTのようなチャット機能をHTMLで作りたいです。
          </div>
          {#if text}
            <span>text: {text}</span>
          {:else}
            !!!none
          {/if}
        </div>
        <div class="card-footer">
          <input
            type="text"
            id="messageInput"
            class="form-control"
            placeholder="メッセージを入力..."
          />
          <div>
            <button class="" on:click={getSelection}>get</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .chat-box {
    overflow-y: scroll;
  }
  .chat-message {
    padding: 10px;
    margin: 5px 0;
  }
</style>

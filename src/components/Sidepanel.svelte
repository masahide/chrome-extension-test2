<script lang="ts">
  import { type ExtractContent } from "../lib/utils";
  let text = "";

  function getSelection() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        let tabid = tabs[i].id;
        //console.log("tabID:", tabid);
        if (tabid) {
          chrome.tabs.sendMessage(
            tabid,
            { name: "getSelection" },
            (response: any) => {
              if (response) {
                let data: ExtractContent = response;
                sendServiceRequest(data);
              }
            },
          );
        }
      }
    });
  }
  function sendServiceRequest(context: ExtractContent) {
    // selection text
    if (context.selectText.length > 0) {
      text = context.selectText;
      return;
    }
    // youtube
    console.log("context:", context);
    if (context.transcription) {
      text = "youtube:" + context.transcription.text;
      return;
    }
    // full text
    if (context.data) {
      text = "full text:" + context.data.content;
      return;
    }
  }
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

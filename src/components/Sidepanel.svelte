<script lang="ts">
  import type { ArticleSnapshot, OpenAIRequest } from "../lib/utils";
  import { ArticleSnapshotType, fetcher, TextType } from "../lib/utils";
  import TextWindow from "./TextWindow.svelte";
  let snapshots: { [key: number]: ArticleSnapshot } = {};

  chrome.runtime.onMessage.addListener(async function (message, sender) {
    snapshots[message.windowID] = {
      type: ArticleSnapshotType.Unknown,
      content: "unknown message",
      textContent: "unknown message",
      title: "",
      url: "",
      id: "",
    };
    switch (message.name) {
      case TextType.Selection:
        snapshots[message.windowID] = message.data;
        break;
      case TextType.Transcription:
        const transcription: ArticleSnapshot = message.data;
        snapshots[message.windowID] = transcription;
        break;
      case TextType.FullText:
        if (message.data) {
          snapshots[message.windowID] = message.data;
        }
        break;
      default:
        console.log("unknown message:", message);
        break;
    }
  });
  let items: { id: number; name: string }[] = [];

  function addItem() {
    const newItem = {
      id: items.length + 1,
      name: `Item ${items.length + 1}`,
    };
    items = [...items, newItem]; // 配列に新しいアイテムを追加
  }
</script>

<!-- チャットメッセージ表示エリア -->
<div class="panel">
  <div class="header">
    <span class="navbar-brand">AI要約</span>
  </div>
  <div class="mainContent">
    <!-- チャットメッセージの例 -->
    <div class="chat-message bot-message bg-secondary-subtle">
      webページから文章を抽出して要約します
      文章抽出ボタンを押すと、webページから文章を抽出します。
      カーソルで文章を選択してボタンを押すと選択部分のみ抽出されます。
    </div>
    {#each items as item (item.id)}
      <TextWindow windowID={item.id} snapshot={snapshots[item.id]} />
    {/each}
    <button type="button" class="btn btn-primary" on:click={addItem}
      >新規要約追加</button
    >
    <div class="chat-message bot-message bg-secondary-subtle"></div>
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

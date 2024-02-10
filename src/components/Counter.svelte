<script lang="ts">
  export let count: number;
  let message: string | null = null;

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);

  const handleSave = () => {
    chrome.storage.sync.set({ count }).then(() => {
      message = "Updated!";

      setTimeout(() => {
        message = null;
      }, 2000);
    });
  };
</script>

<div class="p-4 d-flex flex-column" style="min-width: 20rem;">
  <p class="fs-4">
    Current count: <span class="fw-bold">{count}</span>
  </p>
  <div class="d-flex gap-2">
    <button class="btn btn-outline-primary" on:click={decrement}>-</button>
    <button class="btn btn-outline-primary" on:click={increment}>+</button>
    <button class="btn btn-outline-primary ms-auto" on:click={handleSave}
      >Save</button
    >
    {#if message}<span class="fw-bold text-primary">{message}</span>{/if}
  </div>
</div>

<style scoped>
</style>

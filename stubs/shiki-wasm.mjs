// nuxt-shiki uses the JavaScript regex engine, so the Oniguruma wasm is never loaded.
// Stubbed because the cloudflare preset's `unwasm` condition otherwise pulls in shiki's raw onig.wasm.
export default undefined;

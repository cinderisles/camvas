import wasm from '../wasm/Cargo.toml';

export const load = async () => {
    const w = await wasm();

    return w.encode_png(1, 2, new Uint8Array())
}

if (import.meta.env.DEV) {
  load()
}

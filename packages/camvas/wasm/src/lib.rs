use wasm_bindgen::{prelude::*, Clamped};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace=console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn encode_png(width: u32, height: u32, pixels: Clamped<Vec<u8>>) -> Clamped<Vec<u8>> {
    let encoded_png = Vec::new();

    log(&format!(
        "Width: {}, Height: {}, Pixel data length: {}",
        width,
        height,
        pixels.len()
    ));

    Clamped(encoded_png)
}

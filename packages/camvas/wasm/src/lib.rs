use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace=console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn encode_png(width: u32, height: u32, pixels: &[u8]) -> Vec<u8> {
    let encoded_png = Vec::new();

    log(&format!("Width: {}, Height: {}, Pixel data length: {}", width, height, pixels.len()));

    encoded_png
}

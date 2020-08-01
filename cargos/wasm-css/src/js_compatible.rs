pub trait JsCompatible {
  fn to_js(&self) -> js_sys::Object;
}

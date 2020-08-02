pub trait JsBind {
  fn js_bind(&self) -> js_sys::Object;
}

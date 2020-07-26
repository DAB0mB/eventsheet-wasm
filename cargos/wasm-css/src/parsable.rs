use crate::node::Node;

pub trait Parsable {
  fn new(code: &String, start: usize, length: usize) -> Self;
  fn node(&self) -> &Node;
  fn parse(&mut self) -> bool;
}

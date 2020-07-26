extern crate regex;

use regex::Regex;
use crate::node::Node;
use crate::parsable::Parsable;

pub struct Rule {
  node: Node,
  key: String,
  value: String,
}

impl Parsable for Rule {
  fn new(code: &String, start: usize, length: usize) -> Self {
    let node = Node::new(code, start, length);

    Self {
      node: node,
      key: String::from(""),
      value: String::from(""),
    }
  }

  fn node<'a>(&'a self) -> &'a Node {
    &self.node
  }

  fn parse(&mut self) -> bool {
    let node = &mut self.node;

    let start: usize;
    {
      let re = Regex::new(r"[^\\s]").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      start = node.start() + mat.start();
    }

    node.set_start(start);

    let length: usize;
    {
      let re = Regex::new(r"[};]").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      length = mat.end() - mat.start();
    }

    node.set_length(length);

    {
      if node.code().trim() == "" {
        return false;
      }
    }

    let key: &str;
    let value: &str;
    {
      let split: Vec<&str> = node.code().split(' ').collect();
      key = split[0];
      value = split[1];
    }

    self.key.push_str(key);
    self.value.push_str(value);

    true
  }
}

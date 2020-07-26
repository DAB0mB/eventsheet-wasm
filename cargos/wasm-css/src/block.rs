extern crate regex;

use regex::Regex;
use crate::node::Node;
use crate::parsable::Parsable;
use crate::query::Query;
use crate::rule::Rule;
use crate::utils::parse_series;

pub struct Block {
  node: Node,
  rules: Vec<Rule>,
  queries: Vec<Query>,
}

impl Parsable for Block {
  fn new(code: &String, start: usize, length: usize) -> Self {
    let node = Node::new(code, start, length);

    Self {
      node: node,
      rules: vec![],
      queries: vec![],
    }
  }

  fn node<'a>(&'a self) -> &'a Node {
    &self.node
  }

  fn parse(&mut self) -> bool {
    let node = &mut self.node;
    let queries = &mut self.queries;
    let rules = &mut self.rules;

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

    let scope_start: usize;
    {
      let re = Regex::new(r"\\{").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      scope_start = mat.start();
    }

    let length: usize;
    {
      queries.append(&mut parse_series::<Query>(node.code(), node.start()));
      rules.append(&mut parse_series::<Rule>(node.code(), node.start() + scope_start + 1));

      let last_rule = &rules.last();

      if last_rule.is_some() {
        let last_rule_node = last_rule.unwrap().node();
        length = last_rule_node.start() + last_rule_node.length() - node.start();
      }
      else {
        length = 0
      }
    }

    node.set_length(length);

    {
      if node.code().trim() == "" {
        return false;
      }
    }

    true
  }
}

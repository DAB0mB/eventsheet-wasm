use crate::parsable::Parsable;

pub fn parse_series<T: Parsable>(code: &String, start: usize) -> Vec<T> {
  let mut items: Vec<T> = vec![];
  let mut child = T::new(code, start, code.len() - start);

  while child.parse() {
    let child_start = child.node().start() + child.node().length();
    items.push(child);

    {
      child = T::new(code, child_start, code.len() - child_start);
    }
  }

  items
}

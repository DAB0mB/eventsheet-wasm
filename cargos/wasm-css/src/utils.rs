use crate::parsable::Parsable;

pub fn parse_series<T: Parsable>(code: &String, start: usize) -> Vec<T> {
  let mut items: Vec<T> = vec![];
  let mut child = T::new(code, start, std::usize::MAX);

  while child.parse() {
    let child_start = child.node().start();
    items.push(child);

    {
      child = T::new(code, child_start, std::usize::MAX);
    }
  }

  items
}

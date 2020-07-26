pub struct Node {
  code: String,
  start: usize,
  length: usize,
}

impl Node {
  pub fn new(code: &String, start: usize, length: usize) -> Self {
    Self {
      code: code[start..start + length].to_string(),
      start: start,
      length: length,
    }
  }

  pub fn start(&self) -> usize {
    self.start
  }

  pub fn length(&self) -> usize {
    self.length
  }

  pub fn code(&self) -> &String {
    &self.code
  }

  pub fn set_start(&mut self, start: usize) -> usize {
    self.start = start;
    self.code = self.code[start..start + self.length].to_string();

    self.start
  }

  pub fn set_length(&mut self, length: usize) -> usize {
    self.length = length;
    self.code = self.code[self.start..self.start + length].to_string();

    self.length
  }
}

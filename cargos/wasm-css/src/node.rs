pub struct Node {
  src_code: String,
  code: String,
  start: usize,
  length: usize,
}

impl Node {
  pub fn new(code: &String, start: usize, length: usize) -> Self {
    Self {
      src_code: code.to_string(),
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
    let offset = self.start as i64 - start as i64;
    self.start = start;

    {
      let length = self.length as i64 + offset;

      if length > 0 {
        self.length = length as usize;
      }
      else {
        self.length = 0;
      }
    }

    self.code = self.src_code[start..start + self.length].to_string();

    self.start
  }

  pub fn set_length(&mut self, length: usize) -> usize {
    self.length = length;
    self.code = self.src_code[self.start..self.start + length].to_string();

    self.length
  }
}

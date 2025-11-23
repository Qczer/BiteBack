class Tokenizer:
    def __init__(self, labels):
        self.chars = sorted(list(set("".join(labels))))
        print(self.chars)
        self.char_to_idx = {c: i+1 for i, c in enumerate(self.chars)}
        self.idx_to_char = {i: c for c, i in self.char_to_idx.items()}

    def text_to_sequence(self, text):
        return [self.char_to_idx[c] for c in text if c in self.char_to_idx]

    def sequence_to_text(self, seq):
        return "".join(self.idx_to_char[i] for i in seq if i != 0)

    @property
    def vocab_size(self):
        return len(self.char_to_idx) + 1
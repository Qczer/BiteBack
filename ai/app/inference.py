import cv2
import torch
from torchvision import transforms

torch.inference_mode()

def process_images(images, h_new=64):
    images_processed = []

    w_max = 0

    for image in images:
        h, w = image.shape

        w_new = int(h_new * w / h)

        if w_new > w_max: w_max = w_new

        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5]),
        ])

        image = cv2.resize(image, (w_new, h_new))
        image = transform(image)

        images_processed.append(image)

    images_padded = []

    for image_processed in images_processed:
        w = image_processed.shape[2]
        image_processed = torch.nn.functional.pad(image_processed, (w_max - w, 0))

        images_padded.append(image_processed)

    return torch.stack(images_padded)

def ctc_decode(tokens, blank_idx=0):
    lines = []

    for batch in tokens:
        decoded = []

        previous = None

        for token in batch:
            if token != previous and token != blank_idx:
                decoded.append(token.item())

            previous = token

        lines.append(decoded)

    return lines

def evaluate_images(images):
    images_tensor = process_images(images)

    with torch.no_grad():
        output = paragonOCR(images_tensor)

    predicted_tokens = output.argmax(dim=2).unsqueeze(-1)
    predicted_tokens = ctc_decode(predicted_tokens)

    predicted_texts = []

    for line in predicted_tokens:
        predicted_text = tokenizer.sequence_to_text(line)

        predicted_texts.append(predicted_text)

    return predicted_texts

# Import checkpoint
checkpoint_path = "best.pth"
checkpoint = torch.load(checkpoint_path, map_location='cpu', weights_only=False)

tokenizer = checkpoint["tokenizer"]

num_classes = tokenizer.vocab_size

# Rebuild model
from ParagonOCR import ParagonOCR

paragonOCR = ParagonOCR(num_classes)
paragonOCR.load_state_dict(checkpoint["model_state_dict"])
paragonOCR.eval()
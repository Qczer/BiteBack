import numpy as np
from fastapi import FastAPI, UploadFile
import cv2
from inference import evaluate_images
from slicer import slice_receipt

app = FastAPI()

@app.post("/scan/")
async def scan(image: UploadFile):
    image_bytes = await image.read()
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR_BGR)

    slices = slice_receipt(image)

    predicted_text = evaluate_images(slices)

    return predicted_text
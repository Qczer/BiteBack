import cv2
import numpy as np
from scipy.ndimage import gaussian_filter1d

def deskew_hough(image):
    _, bw = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    contours, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    angles = []

    for cnt in contours:
        if cv2.contourArea(cnt) < 100:
            continue
        rect = cv2.minAreaRect(cnt)
        w, h = rect[1]
        angle = rect[-1]

        if w < h:
            angle = angle
        else:
            angle = angle - 90

        angles.append(angle)

    median_angle = np.median(angles) if angles else 0.0

    h, w = image.shape[:2]
    M = cv2.getRotationMatrix2D((w//2, h//2), median_angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return rotated


def preprocess_image(image):
    gray = cv2.equalizeHist(image)
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    return gray

def threshold_and_clean(gray, block_size=35, C=45):
    th = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, block_size, C
    )
    kernel_open = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    clean = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel_open)

    clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE,
                             cv2.getStructuringElement(cv2.MORPH_RECT, (1, 3)))
    clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE,
                             cv2.getStructuringElement(cv2.MORPH_RECT, (5, 1)))

    return clean

def detect_text_lines(clean):
    projection = np.sum(clean, axis=1)
    proj_smooth = gaussian_filter1d(projection, sigma=2)
    threshold_proj = np.mean(proj_smooth) * 0.5
    text_rows = proj_smooth > threshold_proj

    lines = []
    in_line = False
    min_gap = 3
    min_line_height = 5

    for i, val in enumerate(text_rows):
        if val and not in_line:
            if not lines or (i - lines[-1][1] >= min_gap):
                in_line = True
                start = i
        elif not val and in_line:
            in_line = False
            end = i
            if end - start >= min_line_height:
                lines.append((start, end))
    if in_line:
        end = len(text_rows) - 1
        if end - start >= min_line_height:
            lines.append((start, end))

    line_heights = [y2 - y1 for y1, y2 in lines]
    median_height = np.median(line_heights) if line_heights else 20

    final_lines = []
    for y1, y2 in lines:
        h = y2 - y1

        if h < 0.75 * median_height:
            continue
        if h <= 1.75 * median_height:
            n_splits = 1
        elif h <= 3.0 * median_height:
            n_splits = 2
        else:
            n_splits = max(1, int(round(h / median_height)))

        split_height = h / n_splits
        for i in range(n_splits):
            start_split = int(y1 + i * split_height)
            end_split = int(y1 + (i + 1) * split_height)
            final_lines.append((start_split, end_split))

    return final_lines

def slice_receipt(image, padding=10):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    image_processed = deskew_hough(image)
    image_processed = preprocess_image(image_processed)
    image_processed = threshold_and_clean(image_processed)

    lines = detect_text_lines(image_processed)

    slices = []

    for y1, y2 in lines:
        y1p = max(0, y1 - padding)
        y2p = y2 + padding

        crop = image[y1p:y2p,:]
        slices.append(crop)

    return slices

if __name__ == '__main__':
    image = cv2.imread("../../test/receipt.png")

    slices = slice_receipt(image)

    for slice in slices:
        cv2.imshow("slice", slice)
        cv2.waitKey(0)
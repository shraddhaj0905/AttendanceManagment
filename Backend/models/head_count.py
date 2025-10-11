import cv2
from mtcnn import MTCNN
import time
import sys
import os  # Import the os module

def preprocess_image(image_path):
    """Preprocess the image for better accuracy."""
    frame = cv2.imread(image_path)
    frame = cv2.GaussianBlur(frame, (5, 5), 0)  # Reduce noise
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    return rgb_frame, frame

def detect_faces(rgb_frame):
    """Detect faces using MTCNN."""
    print("Using MTCNN for face detection...")
    detector = MTCNN()
    faces_mtcnn = detector.detect_faces(rgb_frame)
    face_locations = []

    for face in faces_mtcnn:
        if face['confidence'] >= 0.95:  # Adjust confidence threshold as needed
            x, y, width, height = face['box']
            top, right, bottom, left = y, x + width, y + height, x
            face_locations.append((top, right, bottom, left))

    return face_locations

def count_heads_in_image(image_path: str, output_image_path: str = None, show_image: bool = False): # Set default to False
    """Counts the number of heads (faces) in the provided image and optionally shows the image."""
    print("Preprocessing image...")
    start_time = time.time()
    rgb_frame, original_frame = preprocess_image(image_path)
    print(f"Image preprocessed in {time.time() - start_time:.2f} seconds.")

    print("Detecting faces using MTCNN...")
    start_time = time.time()
    face_locations = detect_faces(rgb_frame)
    print(f"Detected {len(face_locations)} faces in {time.time() - start_time:.2f} seconds.")

    num_heads = len(face_locations)

    print(f"Total heads counted: {num_heads}")
    return num_heads

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path_from_command_line = sys.argv[1]
        head_count = count_heads_in_image(image_path_from_command_line)
        print(f"Number of heads detected: {head_count}")
    else:
        print("Please provide an image path as a command-line argument when running directly.")
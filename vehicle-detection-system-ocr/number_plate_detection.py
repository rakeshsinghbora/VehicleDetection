from ultralytics import YOLO
import cv2
import os
import pytesseract
import re
import numpy as np
import requests  # ✅ Added for API calls

# --------------------------
# DETECT.PY SECTION
# --------------------------

# Load your YOLOv8 model (make sure "best.pt" is trained to detect license plates)
model = YOLO("best.pt")

def detect_number_plate_in_video(video_path, output_dir="output", snapshot_interval=30):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video at {video_path}")
        return

    frame_count = 0
    snapshot_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Process every snapshot_interval-th frame
        if frame_count % snapshot_interval == 0:
            results = model(frame)

            for result in results:
                boxes = result.boxes.xyxy
                confidences = result.boxes.conf
                class_ids = result.boxes.cls

                for box, confidence, class_id in zip(boxes, confidences, class_ids):
                    if confidence > 0.5:
                        x1, y1, x2, y2 = map(int, box)

                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                        number_plate = frame[y1:y2, x1:x2]

                        output_path = os.path.join(output_dir, f"number_plate_{snapshot_count}.jpg")
                        cv2.imwrite(output_path, number_plate)
                        print(f"Number plate saved to {output_path}")
                        snapshot_count += 1

            annotated_frame_path = os.path.join(output_dir, f"annotated_frame_{frame_count}.jpg")
            # cv2.imwrite(annotated_frame_path, frame)
            print(f"Annotated frame saved to {annotated_frame_path}")

        cv2.imshow("Video Processing", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Video processing completed.")

# --------------------------
# EXTRACT.PY SECTION
# --------------------------

# Set Tesseract path (update if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_text(text):
    text = text.strip()
    text = re.sub(r'[^A-Z0-9]', '', text)  # Remove unwanted symbols
    return text  # Keep this simple for now

def detect_plate_color(image):
    avg_color_per_row = np.average(image, axis=0)
    avg_color = np.average(avg_color_per_row, axis=0)

    # Convert BGR to RGB
    r, g, b = avg_color[2], avg_color[1], avg_color[0]

    # Adjust thresholds for more accurate color detection
    if r > 180 and g > 180 and b > 180:
        return "White"
    elif r > 180 and g < 120 and b < 120:
        return "Red"
    elif r < 120 and g > 180 and b < 120:
        return "Green"
    elif r < 120 and g < 120 and b > 180:
        return "Blue"
    elif r > 180 and g > 180 and b < 120:
        return "Yellow"
    else:
        return "Unknown"

def correct_ocr_errors(plate):
    # Define allowed series codes for your region. If "CO" should be allowed, include it.
    allowed_series_codes = {"CQ", "CR", "AB", "XY"}  # <-- Update as needed.
    
    if len(plate) == 10:
        # Check plate format: First 2 letters, 2 digits, 2 letters, and 4 digits.
        if plate[:2].isalpha() and plate[2:4].isdigit() and plate[4:6].isalpha() and plate[6:].isdigit():
            series = plate[4:6]
            # Only perform correction if series equals "CO" and it is NOT allowed.
            if series == "CO" and "CO" not in allowed_series_codes:
                plate = plate[:4] + "CQ" + plate[6:]
    return plate

# ✅ Function to send API request
def send_entry_to_api(plate_number, image_name, entry_gate=3, vehicle_type="PRIVATE"):
    url = "http://localhost:8080/api/vehicles/entry"
    payload = {
        "vehicleNumber": plate_number,
        "entryGate": entry_gate,
        "vehicleType": vehicle_type,
        "imageName": image_name
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"✅ API Success: Vehicle {plate_number} logged successfully.")
        else:
            print(f"❌ API Error [{response.status_code}]: {response.text}")
    except Exception as e:
        print(f"⚠️ Exception during API call: {e}")

# --------------------------
# MAIN EXECUTION
# --------------------------

if __name__ == "__main__":
    # Run detection to extract number plate images from video
    video_path = "mycarplate.mp4"
    detect_number_plate_in_video(video_path)
    
    # Now run OCR extraction on the saved images in the "output" folder
    current_directory = os.path.dirname(os.path.abspath(__file__))
    image_folder = os.path.join(current_directory, "output")
    if not os.path.exists(image_folder):
        print(f"Error: The folder '{image_folder}' does not exist!")
        exit()

    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    valid_state_codes = {
        "DL", "UP", "HR", "MH", "KA", "TN", "MP", "RJ", "PB", "GJ",
        "WB", "AP", "TS", "BR", "CG", "GA", "HP", "JK", "KL", "MN",
        "ML", "MZ", "NL", "OD", "PY", "SK", "TR", "UK", "JH", "AS"
    }
    
    # Dictionary to hold the mapping from a corrected plate to the list of image file paths that produced it.
    plate_to_files = {}

    for image_name in os.listdir(image_folder):
        image_path = os.path.join(image_folder, image_name)

        # Read image
        img = cv2.imread(image_path)
        if img is None:
            print(f"Could not read image: {image_path}")
            continue

        # Detect plate color
        plate_color = detect_plate_color(img)

        # Resize for better OCR (scaling up)
        img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

        # Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply Unsharp Mask (Sharpening)
        sharp = cv2.GaussianBlur(gray, (0, 0), 3)
        sharpened = cv2.addWeighted(gray, 1.5, sharp, -0.5, 0)

        # Apply Bilateral Filtering (Removes noise but keeps edges)
        filtered = cv2.bilateralFilter(sharpened, 9, 75, 75)

        # Apply Otsu's Thresholding (Better for printed text)
        _, thresh = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Debug: Save the preprocessed image to check OCR input
        debug_path = os.path.join(current_directory, f"debug_{image_name}")
        cv2.imwrite(debug_path, thresh)

        # Use Tesseract OCR
        extracted_text = pytesseract.image_to_string(thresh, config=custom_config)

        # Clean and correct extracted text
        cleaned_text = clean_text(extracted_text)

        # FINAL BRUTE-FORCE FIX: REPLACE "IDL" WITH "DL"
        if cleaned_text.startswith("IDL"):
            cleaned_text = "DL" + cleaned_text[3:]
        
        # Correct common OCR errors (like "CO" vs "CQ")
        corrected_text = correct_ocr_errors(cleaned_text)

        # Build dictionary mapping license plate to file(s)
        if corrected_text in plate_to_files:
            plate_to_files[corrected_text].append(image_path)
            print(f"Duplicate number plate detected in {image_name}: {corrected_text}")
        else:
            plate_to_files[corrected_text] = [image_path]
            print(f"Extracted Text from {image_name}: {corrected_text}")
            print(f"Detected Plate Color: {plate_color}")

            # ✅ Call the API only for valid state code and plate length
            if corrected_text[:2] in valid_state_codes and len(corrected_text) >= 6:
                send_entry_to_api(corrected_text, image_name)
            else:
                print(f"⚠️ Skipping API call for invalid or incomplete plate: {corrected_text}")

    # After processing, remove duplicate image files
    print("\nRemoving duplicate images. Only one image per unique license plate will be kept.")
    for plate, files in plate_to_files.items():
        # Keep the first file, remove the rest (if any)
        if len(files) > 1:
            for duplicate_file in files[1:]:
                try:
                    os.remove(duplicate_file)
                    print(f"Removed duplicate image file: {duplicate_file}")
                except Exception as e:
                    print(f"Error deleting {duplicate_file}: {e}")

    print("\nUnique license plates detected:")
    for plate in plate_to_files.keys():
        print(plate)

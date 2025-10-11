import sys
import json
import re
from PIL import Image
import google.generativeai as genai

def extract_roll_numbers_from_image(image_path, gemini_api_key):
    try:
        # Debug logs to stderr
        print(f"DEBUG: Received image path: {image_path}", file=sys.stderr)
        print(f"DEBUG: Gemini API Key Length: {len(gemini_api_key)}", file=sys.stderr)

        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Load image
        img = Image.open(image_path)

        # Prompt
        prompt = "Identify and extract all the roll numbers present in this image."
        response = model.generate_content([prompt, img])
        response.resolve()

        # Print Gemini raw response for debugging (stderr only)
        print("DEBUG: Gemini response text:", file=sys.stderr)
        print(response.text, file=sys.stderr)

        # Extract numbers
        roll_number_pattern = r"\b(\d{1,5})\b"
        roll_numbers = re.findall(roll_number_pattern, response.text)

        final_roll_numbers = []
        for roll_number in roll_numbers:
            roll_number = roll_number.strip()
            if len(roll_number) == 1:
                roll_number = "2320" + roll_number
            elif len(roll_number) == 2:
                roll_number = "232" + roll_number
            elif len(roll_number) == 3:
                roll_number = "23" + roll_number

            if 23201 <= int(roll_number) <= 23287:
                final_roll_numbers.append(roll_number)

        unique_roll_numbers = sorted(list(set(final_roll_numbers)))
        return unique_roll_numbers

    except Exception as e:
        print(f"DEBUG: Exception occurred: {e}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    # All startup logs to stderr
    print("DEBUG: Script started", file=sys.stderr)

    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python ocr.py <image_path> <gemini_api_key>"}))
        sys.exit(1)

    image_file_path = sys.argv[1]
    api_key = sys.argv[2]

    result = extract_roll_numbers_from_image(image_file_path, api_key)

    # Only JSON result goes to stdout
    print(json.dumps({"rollNos": result}))

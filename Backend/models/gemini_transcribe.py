import google.generativeai as genai
from pydub import AudioSegment
import base64
import sys
import os

def convert_to_wav(input_path):
    try:
        sound = AudioSegment.from_file(input_path)
        wav_path = input_path.rsplit('.', 1)[0] + ".wav"
        sound.export(wav_path, format="wav")
        return wav_path
    except Exception as e:
        print(f"ERROR: Failed to convert file to WAV. {str(e)}")
        sys.exit(1)

def transcribe_with_gemini(audio_path, api_key):
    try:
        genai.configure(api_key=api_key)

        with open(audio_path, "rb") as f:
            audio_base64 = base64.b64encode(f.read()).decode("utf-8")

        prompt = (
            "This is an audio file in WAV format. "
            "Transcribe the speech as accurately as possible."
        )

        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

        response = model.generate_content([
            prompt,
            {
                "mime_type": "audio/wav",
                "data": audio_base64,
            },
        ])

        return response.text
    except Exception as e:
        print(f"ERROR: Transcription failed. {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    file_path = sys.argv[1]
    api_key = sys.argv[2]

    if not os.path.exists(file_path):
        print("ERROR: File does not exist")
        sys.exit(1)

    wav_path = convert_to_wav(file_path)
    result = transcribe_with_gemini(wav_path, api_key)
    print(result)

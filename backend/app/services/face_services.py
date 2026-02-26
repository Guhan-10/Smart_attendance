import os
from deepface import DeepFace

KNOWN_FACES_FOLDER = r"C:\Users\tobim\Music\projects\smart_attendance\backend\data\known_face"
os.makedirs(KNOWN_FACES_FOLDER, exist_ok=True)


def recognize_multiple_faces(image_path: str) -> list:
    """Takes an image, finds ALL faces, compares them, and returns a list of names."""
    recognized_names = []

    try:
        # DeepFace.find returns a list of DataFrames (one for each face detected)
        results = DeepFace.find(
            img_path=image_path,
            db_path=KNOWN_FACES_FOLDER,
            enforce_detection=False,
            model_name="Facenet",
            detector_backend="retinaface",  # <--- Better for group photos!
            silent=True
        )

        # Loop through every face found in the image
        for face_df in results:
            if not face_df.empty:
                # Extract the identity for this specific face
                matched_file_path = face_df.iloc[0]['identity']
                file_name = os.path.basename(matched_file_path)
                name = os.path.splitext(file_name)[0].capitalize()

                # Add to list if not already there
                if name not in recognized_names:
                    recognized_names.append(name)

        return recognized_names

    except Exception as e:
        print(f"Face Recognition Error: {e}")
        return []

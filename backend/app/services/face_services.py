import os
from deepface import DeepFace

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
KNOWN_FACES_FOLDER = os.path.join(BASE_DIR, "data", "known_face")

os.makedirs(KNOWN_FACES_FOLDER, exist_ok=True)


def recognize_multiple_faces(image_path: str) -> list:
    """Uses ArcFace to strictly identify multiple faces and prints the math."""
    recognized_names = []

    try:
        # 1. Using ArcFace and cosine distance for maximum strictness
        results = DeepFace.find(
            img_path=image_path,
            db_path=KNOWN_FACES_FOLDER,
            enforce_detection=True,
            model_name="ArcFace",          # <--- UPGRADED AI MODEL
            distance_metric="cosine",      # <--- STRICTER MATH
            detector_backend="retinaface",
            silent=True
        )

        for face_df in results:
            if not face_df.empty:
                # 2. Get the very best match for this face
                best_match = face_df.iloc[0]

                # 3. Extract the name and the math score
                matched_file_path = best_match['identity']
                file_name = os.path.basename(matched_file_path)
                name = os.path.splitext(file_name)[0].capitalize()

                distance_score = best_match['distance']

                # ArcFace with cosine distance usually requires a score lower than 0.68 to be a true match.
                # Let's set a strict manual threshold of 0.60 to be safe.
                print(
                    f"🔍 AI scanned a face. Closest match: {name} (Score: {distance_score:.3f})")

                if distance_score < 0.60:
                    print(f"✅ STRICT MATCH CONFIRMED: {name}")
                    if name not in recognized_names:
                        recognized_names.append(name)
                else:
                    print(
                        f"❌ REJECTED {name}: Score was too high (not a close enough match).")

        return recognized_names

    except ValueError:
        # No faces found in the frame at all
        return []
    except Exception as e:
        print(f"Face Recognition Error: {e}")
        return []

import os
from typing import Optional

from PIL import Image
from rembg import remove


def ensure_output_directory(path: str) -> None:
	"""Create the output directory if it doesn't exist."""
	os.makedirs(path, exist_ok=True)


def get_images_directory() -> str:
	"""Resolve the images directory relative to this script file."""
	script_dir = os.path.dirname(os.path.abspath(__file__))
	return os.path.normpath(os.path.join(script_dir, "..", "images"))


def remove_background_from_image(input_path: str, output_path: str) -> Optional[str]:
	"""Remove the background from a single image and save it to output_path.

	Returns an error message string if something goes wrong, otherwise None.
	"""
	try:
		with Image.open(input_path) as image:
			image = image.convert("RGBA")
			result: Image.Image = remove(image)
			result.save(output_path)
		return None
	except Exception as exc:  # noqa: BLE001 - we want to surface any failure here
		return f"Error processing {input_path}: {exc}"


def main() -> int:
	images_dir = get_images_directory()
	output_dir = os.path.join(images_dir, "bg-removed")
	ensure_output_directory(output_dir)

	print(f"Input directory: {images_dir}")
	print(f"Output directory: {output_dir}")

	processed = 0
	skipped = 0
	errors: list[str] = []

	for index in range(1, 15):
		input_path = os.path.join(images_dir, f"{index}.png")
		if not os.path.exists(input_path):
			print(f"Skipping missing {input_path}")
			skipped += 1
			continue

		output_path = os.path.join(output_dir, f"{index}.png")
		error = remove_background_from_image(input_path, output_path)
		if error is None:
			processed += 1
			print(f"Wrote {output_path}")
		else:
			errors.append(error)
			print(error)

	print("")
	print(f"Done. Processed: {processed}, Skipped: {skipped}, Errors: {len(errors)}")
	return 0 if not errors else 1


if __name__ == "__main__":
	exit(main())



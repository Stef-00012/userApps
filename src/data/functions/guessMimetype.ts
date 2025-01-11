import type { MimeTypesKey, MimeTypesValue } from "?/mimetypes";
import mimetypes from "@/data/mimetypes.json";

export default async function guessMimetype(
	mimetype: MimeTypesKey,
): Promise<MimeTypesValue> {
	if (!mimetype) return "xmp";

	const mime = mimetypes[mimetype];
	if (!mime) return "xmp";

	return mime;
}

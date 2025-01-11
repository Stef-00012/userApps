import type mimetypes from "@/data/mimetypes.json";

export type MimeTypesKey = keyof typeof mimetypes
export type MimeTypesValue = typeof mimetypes[keyof typeof mimetypes]
export type SkinType = "wide" | "slim";
export type CropType =
	| "full"
	| "bust"
	| "face"
	| "head"
	| "default"
	| "processed";
export type RenderType =
	| "default"
	| "marching"
	| "walking"
	| "crouching"
	| "crossed"
	| "criss_cross"
	| "ultimate"
	| "isometric"
	| "head"
	| "cheering"
	| "relaxing"
	| "trudging"
	| "cowering"
	| "pointing"
	| "lunging"
	| "dungeons"
	| "facepalm"
	| "sleeping"
	| "dead"
	| "archer"
	| "kicking"
	| "mojavatar"
	| "reading"
	| "high_ground"
	| "bitzel"
	| "pixel"
	| "ornament"
	| "skin"
	| "profile"
	| "sitting"
	| "tpose";

export interface SkinConfig {
	cameraPosition?: CameraPosition;
	cameraFocalPoint?: CameraFocalPoint;
}

export interface CameraPosition {
	x: string;
	y: string;
	z: string;
}

export interface CameraFocalPoint {
	x: string;
	y: string;
	z: string;
}

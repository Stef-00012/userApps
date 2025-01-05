import type { CropType, RenderType, SkinConfig } from "../../types/minecraftSkin";

export const renderTypes: Array<RenderType> = [
    "default",
    "marching",
    "walking",
    "crouching",
    "crossed",
    "criss_cross",
    "ultimate",
    "isometric",
    "head",
    "cheering",
    "relaxing",
    "trudging",
    "cowering",
    "pointing",
    "lunging",
    "dungeons",
    "facepalm",
    "sleeping",
    "dead",
    "archer",
    "kicking",
    "mojavatar",
    "reading",
    "high_ground",
    "bitzel",
    "pixel",
    "ornament",
    "skin",
    "profile",
    "sitting",
    "tpose"
]

export const avaibleCropTypes: {
    [key in RenderType]: Array<CropType>;
} = {
    default: ["full", "bust", "face"],
    marching: ["full", "bust", "face"],
    walking: ["full", "bust", "face"],
    crouching: ["full", "bust", "face"],
    crossed: ["full", "bust", "face"],
    criss_cross: ["full", "bust", "face"],
    ultimate: ["full", "bust", "face"],
    isometric: ["full", "bust", "face", "head"],
    head: ["full"],
    cheering: ["full", "bust", "face"],
    relaxing: ["full", "bust", "face"],
    trudging: ["full", "bust", "face"],
    cowering: ["full", "bust", "face"],
    pointing: ["full", "bust", "face"],
    lunging: ["full", "bust", "face"],
    dungeons: ["full", "bust", "face"],
    facepalm: ["full", "bust", "face"],
    sleeping: ["full", "bust"],
    dead: ["full", "bust", "face"],
    archer: ["full", "bust", "face"],
    kicking: ["full", "bust", "face"],
    mojavatar: ["full", "bust"],
    reading: ["full", "bust", "face"],
    high_ground: ["full", "bust", "face"],
    bitzel: ["full", "bust", "face"],
    pixel: ["full", "bust", "face"],
    ornament: ["full"],
    skin: ["default", "processed"],
    profile: ["full", "bust", "face"],
    sitting: ["full"],
    tpose: ["full"]
};

export const avaibleRenderTypes: Array<{
    name: string;
    value: RenderType;
}> = [
    { name: "Default", value: "default" },
    { name: "Marching", value: "marching" },
    { name: "Walking", value: "walking" },
    { name: "Crouching", value: "crouching" },
    { name: "Crossed", value: "crossed" },
    { name: "Criss Cross", value: "criss_cross" },
    { name: "Ultimate", value: "ultimate" },
    { name: "Isometric", value: "isometric" },
    { name: "Head", value: "head" },
    { name: "Cheering", value: "cheering" },
    { name: "Relaxing", value: "relaxing" },
    { name: "Trudging", value: "trudging" },
    { name: "Cowering", value: "cowering" },
    { name: "Pointing", value: "pointing" },
    { name: "Lunging", value: "lunging" },
    { name: "Dungeons", value: "dungeons" },
    { name: "Facepalm", value: "facepalm" },
    { name: "Sleeping", value: "sleeping" },
    { name: "Dead", value: "dead" },
    { name: "Archer", value: "archer" },
    { name: "Kicking", value: "kicking" },
    { name: "Mojavatar", value: "mojavatar" },
    { name: "Reading", value: "reading" },
    { name: "High Grounds", value: "high_ground" },
    { name: "Bitzel", value: "bitzel" },
    { name: "Pixel", value: "pixel" },
    { name: "Ornament", value: "ornament" },
    { name: "Skin", value: "skin" },
    { name: "Profile", value: "profile" },
    { name: "Sitting", value: "sitting" },
    { name: "T Pose", value: "tpose" }
]

export const customSkinsConfig: {
    [key in RenderType]?: SkinConfig;
} = {
    sitting: {
        cameraPosition:{
            x: "37.59",
            y: "32.05",
            z: "-54.2"
        },
        cameraFocalPoint: {
            x: "5.75",
            y: "21.35",
            z: "-8.27"
        },
    },
    tpose: {
        cameraPosition: {
            x: "20.87",
            y: "35.99",
            z: "-62.21"
        },
        cameraFocalPoint: {
            x: "-2.44",
            y: "17.65",
            z: "3.04"
        }
    }
};
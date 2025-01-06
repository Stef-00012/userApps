import type { SkinType } from "./minecraftSkin";

export interface Player {
    processedSkinUrl?: string;
    skinTextureHeight: number;
    skinTextureWidth: number;
    playerUUID: string;
    skinType: SkinType;
    userCape?: string;
    skinUrl: string;
}
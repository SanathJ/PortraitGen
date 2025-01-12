import { readdirSync } from 'node:fs';
import { parse } from 'node:path';
export interface PortraitIcon {
    name: string;
    path: string;
    full?: boolean;
    elementalIcon?: {
        name: string;
        path: string;
    };
    note?: string;
    others?: PortraitIcon[];
}

export interface Icon {
    name: string;
    path: string;
    type: 'artifact' | 'character' | 'element' | 'weapon';
}

export function filename(name: string) {
    return name.replace(/ /g, '_').replace(/:|"|'/g, '');
}

export class Names {
    static names: Icon[];

    static {
        Names.names = [
            // artifacts
            ...readdirSync('./img/artifacts/icon').map(
                (e) =>
                    ({
                        name: parse(e).name,
                        path: `./img/artifacts/icon/${e}`,
                        type: 'artifact',
                    }) as Icon
            ),

            // characters
            ...readdirSync('./img/characters/icon').map(
                (e) =>
                    ({
                        name: parse(e).name,
                        path: `./img/characters/icon/${e}`,
                        type: 'character',
                    }) as Icon
            ),
            // fill character
            {
                name: 'Fill slot',
                path: '/img/characters/abstract-user-flat-3-colored.svg',
                type: 'character',
            } as Icon,
            // travellers
            {
                name: 'Aether',
                path: '/img/characters/icon/Aether.png',
                type: 'character',
            },
            {
                name: 'Lumine',
                path: '/img/characters/icon/Lumine.png',
                type: 'character',
            },

            // elements
            {
                name: 'Anemo',
                path: './img/elements/anemo.png',
                type: 'element',
            },
            {
                name: 'Cryo',
                path: './img/elements/cryo.png',
                type: 'element',
            },
            {
                name: 'Dendro',
                path: './img/elements/dendro.png',
                type: 'element',
            },
            {
                name: 'Electro',
                path: './img/elements/electro.png',
                type: 'element',
            },
            {
                name: 'Geo',
                path: './img/elements/geo.png',
                type: 'element',
            },
            {
                name: 'Hydro',
                path: './img/elements/hydro.png',
                type: 'element',
            },
            {
                name: 'Pyro',
                path: './img/elements/pyro.png',
                type: 'element',
            },

            // weapons
            ...readdirSync('./img/weapons/icon_ascended').map(
                (e) =>
                    ({
                        name: parse(e).name,
                        path: `./img/weapons/icon_ascended/${e}`,
                        type: 'weapon',
                    }) as Icon
            ),
        ];
    }
}

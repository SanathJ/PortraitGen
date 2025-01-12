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

export function filename(name: string) {
    return name.replace(/ /g, '_').replace(/:|"|'/g, '');
}

export const elements = [
    {
        name: 'Anemo',
        path: './img/elements/anemo.png',
    },
    {
        name: 'Cryo',
        path: './img/elements/cryo.png',
    },
    {
        name: 'Dendro',
        path: './img/elements/dendro.png',
    },
    {
        name: 'Electro',
        path: './img/elements/electro.png',
    },
    {
        name: 'Geo',
        path: './img/elements/geo.png',
    },
    {
        name: 'Hydro',
        path: './img/elements/hydro.png',
    },
    {
        name: 'Pyro',
        path: './img/elements/pyro.png',
    },
];

const travelers = [
    {
        name: 'Aether',
        path: '/img/characters/icon/Aether.png',
    },
    {
        name: 'Lumine',
        path: '/img/characters/icon/Lumine.png',
    },
];

export default function PortraitGenerator({
    charIcons,
    artiIcons,
    weaponIcons,
}: {
    charIcons: Record<string, string[]>;
    artiIcons: Record<string, string[]>;
    weaponIcons: Record<string, string[]>;
}) {
    const iconsMisc = [
        {
            name: 'Fill slot',
            path: '/img/characters/abstract-user-flat-3-colored.svg',
        },
        ...travelers,
    ];

    const iconsChar = Object.entries(charIcons)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([element, icons]) => ({
            element,
            chars: icons.sort().map((name) => ({
                name,
                path: `/img/characters/icon/${filename(name)}.png`,
            })),
            travelerIcons: elements
                .filter((x) => x.name == element)
                .flatMap((relevant) =>
                    travelers.map((traveler) => ({
                        ...traveler,
                        name: `${traveler.name} (${relevant.name})`,
                        elementalIcon: relevant,
                    }))
                ),
        }));

    const iconsArtifacts = Object.entries(artiIcons)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([level, icons]) => ({
            level,
            icons: icons.map((name) => ({
                name,
                path: `/img/artifacts/icon/${filename(name)}.png`,
                full: true,
            })),
        }));

    const iconsWeapons = Object.entries(weaponIcons)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([type, icons]) => ({
            type,
            icons: icons.map((name) => ({
                name,
                path: `/img/weapons/icon_ascended/${filename(name)}.png`,
                // full: true
            })),
        }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const allIcons: PortraitIcon[] = [
        ...iconsChar.flatMap((x) => [...x.chars, ...x.travelerIcons]),
        ...elements,
        ...iconsArtifacts.flatMap((x) => x.icons),
        ...iconsWeapons.flatMap((x) => x.icons),
        ...iconsMisc,
    ];
}

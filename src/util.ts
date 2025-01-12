import { PortraitIcon, elements, filename } from './Generator';

export function addSingle(
    icon: string,
    full: boolean,
    element?: string,
    note?: string
) {
    const e = elements.find((e) => e.name === icon);
    const path = e ? e.path : `./img/characters/icon/${filename(icon)}.png`;

    const char: PortraitIcon = {
        name: icon,
        path: path,
        full: full,
    };

    if (element) {
        char.elementalIcon = {
            name: element,
            path: `./img/elements/${filename(element.toLowerCase())}.png`,
        };
    }
    if (note) char.note = note;

    return char;
}

export function addMulti(icons: string[], element?: (string | undefined)[]) {
    const first = addSingle(icons[0], false, element ? element[0] : undefined);

    for (let i = 1; i < icons.length; i++) {
        if (!first.others) first.others = [];

        first.others.push(
            addSingle(icons[i], false, element ? element[i] : undefined)
        );
    }

    return first;
}

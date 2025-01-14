# Instructions

Tested with Node.js v22.13.0 and Typescript v5.7.3. See package.json for more details.

## Generating portraits

Edit `src/index.ts` for the required portraits:  
**util#addSingle**

```
addSingle(
    icon: string,
    full: boolean = true,
    element?: string,
    note?: string
)
```

- `icon` The name of the artifact, character, element, or weapon.
- `full` Whether to generate a full size image or not. Ignored for the purposes of **addSingle**, used internally.
- `element` If present, adds the symbol of the element to the portrait.
- `note` If present, adds a note to the portrait.

**util#addMulti**

```
addMulti(
    icons: string[],
    element?: (string | undefined)[]
)
```

- `icons` The names of the artifact, character, element, or weapon.
- `element` If present, adds the symbol of the element to the portrait. Other entries in the array should be set to `undefined`.

Fuzzy search is present so names do not need to be accurate, however if a different character's portrait is generated, the character's full name may be required.

Run `npm run start` to generate image in `output/`.

## Adding new characters

Add the image file to the appropriate folder in `img/`. Note that the name of the item is taken from the file name.

Source for images:

- Artifacts: [KQM](https://github.com/KQM-git/TCL/tree/master/static/img), [Wiki](https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki), [Hoyolab](https://wiki.hoyolab.com/pc/genshin/aggregate/5)
- Characters: [KQM](https://github.com/KQM-git/TCL/tree/master/static/img), [Wiki](https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki), [Hoyolab](https://wiki.hoyolab.com/pc/genshin/aggregate/2)
- Weapons: [KQM](https://github.com/KQM-git/TCL/tree/master/static/img), [Wiki](https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki)

# Credits

- Element Icons: [/u/SnooDogs3804](https://www.reddit.com/r/Genshin_Impact/comments/jk3vho/hi_i_made_some_5000x5000_transparent_element/)
- Fill Slot Icon: [Free SVG](https://freesvg.org/user-icon-picture)
- Other Images: Taken from Keqing Mains and [Wiki](https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki), credit to Hoyo
- Based on code from [Keqing Mains](https://github.com/KQM-git/TCL/tree/master) and [muakasan](https://github.com/muakasan/genshin-portraits)

import { PortraitIcon } from './Generator';
import Preview from './Generator/Preview';
import { addSingle, addMulti } from './util';

import * as fs from 'node:fs';

const arr: PortraitIcon[] = [];
arr.push(addSingle('Clorinde', true));
arr.push(addSingle('Fischl', true));
arr.push(addMulti(['Kirara', 'Nahida']));
arr.push(addMulti(['Kaedehara_Kazuha', 'Sucrose', 'Xilonen']));

const options = {
    active: arr,
    background: true,
    portraitPadding: true,
    names: false,
};

async function main() {
    const [data, list] = await Preview(options);
    console.log(list);
    const img = data.replace(/^data:image\/\w+;base64,/, '');

    const buf = Buffer.from(img, 'base64');
    fs.writeFileSync(`output/Portraits ${list}.png`, buf);
}

main();

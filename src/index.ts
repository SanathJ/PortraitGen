import { writeFileSync } from 'node:fs';
import { PortraitIcon } from './Generator';
import Preview from './Generator/Preview';
import { addSingle, addMulti } from './util';

const arr: PortraitIcon[] = [];
arr.push(addSingle('Tao'));
arr.push(addSingle('Furina'));
arr.push(addMulti(['Yelan', 'XQ']));
arr.push(addMulti(['Xilo', 'Jean', 'Benny']));

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
    writeFileSync(`output/Portraits ${list}.png`, buf);
}

main();

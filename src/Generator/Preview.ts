import { PortraitIcon } from '.';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createCanvas, loadImage } = require('canvas');

// Based on https://github.com/muakasan/genshin-portraits

const framePad = 36; // Padding around portrait frame
const portraitPad = 12; // Padding around image
const spacing = 29; // Spacing between portrait frames
const portraitSize = 256; // 256 for GI, 128 for HSR
const elementalSizeMultiplier = 1 / 4;
const lineOffset = 3;
const bottomOffset = 20; // Padding from bottom of frame from portrait for text
const noteExtraWidth = 20;
const noteHeight = 45;
const noteFont = 'bold 25px "Arial"';
const nameFont = 'bold 17px "Arial"';

const altThreeImgRendering = true;
// const areaSplit = true; // vs equal angles

export default async function Preview({
    active,
    background,
    portraitPadding,
    names,
}: {
    active: PortraitIcon[];
    background: boolean;
    portraitPadding: boolean;
    names: boolean;
}) {
    const effectiveFramePad = background ? framePad : 0;
    const effectivePortraitPad = portraitPadding ? portraitPad : 0;
    const frameSize = portraitSize + 2 * effectivePortraitPad;
    const totalWidth =
        effectiveFramePad * 2 +
        frameSize * active.length +
        spacing * (active.length - 1);
    const totalHeight =
        2 * effectiveFramePad +
        2 * effectivePortraitPad +
        portraitSize +
        (names ?
            background ? bottomOffset
            :   bottomOffset + framePad
        :   0);

    function getName(x: PortraitIcon): string {
        return `${x.name}${x.others ? '+' + x.others.map((x) => getName(x)).join('+') : ''}`;
    }
    const list = active.map((x) => getName(x)).join(' - ');

    const canvas = createCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext('2d');

    ctx.patternQuality = 'best';
    ctx.quality = 'best';

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (background) {
        ctx.fillStyle = '#02041C';
        ctx.strokeStyle = '#000000';
    } else {
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = 'transparent';
    }
    roundRect(ctx, 0, 0, totalWidth, totalHeight, 19);

    for (let i = 0; i < active.length; i++) {
        const leftBorder = effectiveFramePad + i * (frameSize + spacing);
        ctx.fillStyle = '#0B0923';
        ctx.strokeStyle = '#000000';
        if (background)
            roundRect(
                ctx,
                leftBorder,
                effectiveFramePad,
                frameSize,
                portraitSize + 2 * effectivePortraitPad,
                10
            );

        const icon = active[i];

        // https://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas
        const x = leftBorder + effectivePortraitPad;
        const y = effectiveFramePad + effectivePortraitPad;
        await drawIcon(ctx, icon, x, y, portraitSize, names);
    }

    return [canvas.toDataURL(), list];
}

async function drawIcon(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    x: number,
    y: number,
    size: number,
    names: boolean
) {
    const baseImage = await loadImage(icon.path);
    if (icon.others) {
        if (icon.others.length == 1) {
            // 2 images
            await drawTopHalf(ctx, icon, baseImage, x, y, size);

            const secondIcon = icon.others[0];
            const second = await loadImage(secondIcon.path);
            await drawBottomHalf(ctx, secondIcon, second, x, y, size);

            drawDiagonal(ctx, x, y, size);
        } else {
            if (altThreeImgRendering && icon.others.length == 2) {
                await drawBottomThird(ctx, icon, baseImage, x, y, size);

                const secondIcon = icon.others[0];
                const second = await loadImage(secondIcon.path);
                await drawLeftThird(ctx, secondIcon, second, x, y, size);

                const thirdIcon = icon.others[1];
                const third = await loadImage(thirdIcon.path);
                await drawRightThird(ctx, thirdIcon, third, x, y, size);

                // draw diagonals
                await drawLine(
                    ctx,
                    x + size / 2 - 1,
                    y + size / 2 - 1,
                    x + size / 2 - 1,
                    y + lineOffset
                );
                await drawLine(
                    ctx,
                    x + size / 2 - 1,
                    y + size / 2 - 1,
                    x + lineOffset,
                    y + lineOffset + (5 * (size - 2 * lineOffset)) / 6
                );
                await drawLine(
                    ctx,
                    x + size / 2 - 1,
                    y + size / 2 - 1,
                    x + size - lineOffset,
                    y + lineOffset + (5 * (size - 2 * lineOffset)) / 6
                );
            } else {
                // 3/4 images
                await drawTopCenter(ctx, icon, baseImage, x, y, size);

                const secondIcon = icon.others[0];
                const second = await loadImage(secondIcon.path);
                await drawLeftCenter(ctx, secondIcon, second, x, y, size);

                const thirdIcon = icon.others[1];
                const third = await loadImage(thirdIcon.path);
                if (icon.others.length == 2) {
                    // 3 images
                    await drawBottomHalf(ctx, thirdIcon, third, x, y, size);

                    drawDiagonal(ctx, x, y, size);
                    drawTLHalfDiagonal(ctx, x, y, size);
                } else {
                    // 4 images
                    await drawRightCenter(ctx, thirdIcon, third, x, y, size);

                    const fourthIcon = icon.others[2];
                    const fourth = await loadImage(fourthIcon.path);

                    await drawBottomCenter(ctx, fourthIcon, fourth, x, y, size);

                    drawDiagonal(ctx, x, y, size);
                    drawTLDiagonal(ctx, x, y, size);
                }
            }
        }
    } else {
        // Draw singular
        drawImg(ctx, icon, baseImage, x, y, size);

        if (icon.note) {
            const noteX = x + portraitPad / 2 + size;
            const noteY = y - portraitPad / 2;

            ctx.font = noteFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const w = ctx.measureText(icon.note).width + noteExtraWidth;
            ctx.fillStyle = '#47446B';
            roundRect(ctx, noteX - w, noteY, w, noteHeight);

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(icon.note, noteX - w / 2, noteY + noteHeight / 2);
        }

        if (names) {
            ctx.font = nameFont;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'alphabetic';
            // ctx.fillText(icon.name, x + size / 2, y + size + 34)
            wrapText(
                ctx,
                icon.name,
                x + size / 2,
                y + size + 34,
                180,
                20
            ).forEach(([text, x, y]) => ctx.fillText(text, x, y));
        }
    }
}

async function drawImg(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    baseImage: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    ctx.drawImage(baseImage, x, y, size, size);
    if (icon.elementalIcon) {
        const elementalImage = await loadImage(icon.elementalIcon.path);
        ctx.drawImage(
            elementalImage,
            x,
            y,
            size * elementalSizeMultiplier,
            size * elementalSizeMultiplier
        );
    }
}

async function drawBottomHalf(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x, y + size);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x + half, y + half, half);
    }
    ctx.restore();
}

async function drawTopHalf(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x, y, half);
    }
    ctx.restore();
}

async function drawLeftThird(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 1.02;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + half, y);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x, y + (5 * size) / 6);
    ctx.lineTo(x, y);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x, y, smaller);
    }
    ctx.restore();
}

async function drawRightThird(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 1.02;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + half, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size, y + (5 * size) / 6);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x + half, y);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x + size - smaller + 3, y, smaller);
    }
    ctx.restore();
}

async function drawBottomThird(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 0.95;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x, y + (5 * size) / 6);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x + size, y + (5 * size) / 6);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x, y + size);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(
            ctx,
            icon,
            img,
            x + half - smaller / 2,
            y + size - smaller,
            smaller
        );
    }
    ctx.restore();
}

async function drawTopCenter(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x, y);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x + half - smaller / 2, y, smaller);
    }
    ctx.restore();
}

async function drawLeftCenter(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x, y);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(ctx, icon, img, x, y + half - smaller / 2, smaller);
    }
    ctx.restore();
}

async function drawRightCenter(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x + size, y);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(
            ctx,
            icon,
            img,
            x + size - smaller,
            y + half - smaller / 2,
            smaller
        );
    }
    ctx.restore();
}

async function drawBottomCenter(
    ctx: CanvasRenderingContext2D,
    icon: PortraitIcon,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
) {
    const half = size / 2;
    const smaller = half * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x + half, y + half);
    ctx.lineTo(x, y + size);
    ctx.clip();
    if (icon.full) {
        await drawImg(ctx, icon, img, x, y, size);
    } else {
        await drawImg(
            ctx,
            icon,
            img,
            x + half - smaller / 2,
            y + size - smaller,
            smaller
        );
    }
    ctx.restore();
}
function drawDiagonal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + lineOffset, y + size - lineOffset);
    ctx.lineTo(x + size - lineOffset, y + lineOffset);
    ctx.stroke();
}
function drawTLHalfDiagonal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + lineOffset, y + lineOffset);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.stroke();
}
function drawTLDiagonal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + lineOffset, y + lineOffset);
    ctx.lineTo(x + size - lineOffset, y + size - lineOffset);
    ctx.stroke();
}

function drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 5
) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    const words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    const lineArray: [string, number, number][] = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for (let n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        } else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}

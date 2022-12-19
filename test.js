

let x='j09fjffjkdl23320';
let xx=   `${x}`;

let regularr= /`${([a-z0-9]+)}`/;
let m=xx.replace(regularr,'hello');
console.log(m);
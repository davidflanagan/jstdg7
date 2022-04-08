let o = { x: 1, y: 2, z: 3 }; 
let a = [], i = 0; 
for (a[i++] in o) /* empty */;
console.log(a)
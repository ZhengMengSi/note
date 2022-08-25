function compare(a, b) {
    if (a < b ) {
        return -1;
    }
    if (a > b ) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

var c = [3,6,4]
console.log(c.sort(compare))
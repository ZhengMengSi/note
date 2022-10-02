var arr = [3,2,1];

var n = arr.length;
for (let i = 0; i < n; i++) {
    var min = i;
    for (let j = i+1; j < n; j++) {
        if (arr[j] < arr[min]) {
            min = j;
        }
    }
    let tmp = arr[i];
    arr[i] = arr[min];
    arr[min] = tmp;
}

console.log(arr)







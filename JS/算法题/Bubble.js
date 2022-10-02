var arr = [3,2,1];

var n = arr.length;
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
        if (arr[j] > arr[j + 1]) {
            let tmp = arr[j];
            arr[j] = arr[j+1];
            arr[j+1] = tmp;
        }
    }
}

console.log(arr)

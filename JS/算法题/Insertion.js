var arr = [3,2,1];

var n = arr.length;
for (let i = 0; i < n; i++) {
    for (let j = i+1; j > 0 && arr[j] < arr[j-1]; j--) {
        let tmp = arr[j];
        arr[j] = arr[j-1];
        arr[j-1] = tmp;
    }
}
console.log(arr)


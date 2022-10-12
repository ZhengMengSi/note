import {rotate1,rotate2} from "./array-rotate";

describe('数组旋转', function () {
    it('正常情况', function () {
        const arr = [1,2,3,4,5,6,7]
        const k = 3
        const res = rotate2(arr, k)
        expect(res).toEqual([5,6,7,1,2,3,4])
    });

    it('数组为空', function () {
        const res = rotate2([], 3)
        expect(res).toEqual([])
    });

    it('k 是负值', function () {
        const arr = [1,2,3,4,5,6,7]
        const k = -3
        const res = rotate2(arr, k)
        expect(res).toEqual([5,6,7,1,2,3,4])
    });

    it('k 是0', function () {
        const arr = [1,2,3,4,5,6,7]
        const k = 0
        const res = rotate2(arr, k)
        expect(res).toEqual(arr)
    });

    it('k 不是数字', function () {
        const arr = [1,2,3,4,5,6,7]
        const k = 'abc'

        // @ts-ignore
        const res = rotate2(arr, k)
        expect(res).toEqual(arr)
    });
});

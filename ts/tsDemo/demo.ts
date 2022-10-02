const teacherName: string = 'Dell Lee';
const teacherAge: number = 22;
const isMale: boolean = true;

const arr: number[] = [1,2,3];
const arr1: string[] = ['a'];
const arr2: Array<boolean> = [true]

// 对象类型
const user: {name: string, age: number} = {name: 'dell', age: 18};
const userOne: {name: string, age?: number} = {name: 'dell'}

// 联合类型 Union Type
function union(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase())
    } else {
        console.log(id)
    }
}

// 类型别名
type User = {name: string; age: number}
const userTwo: User = {name: 'dell', age: 18};
const userThree: User = {name: 'dell', age: 18};

// any
function showMessage(message: any) {
    console.log(message);
}

// 函数类型
function abc(message: string): number {
    return 12;
}

const def: (age: number) => number = (age: number) => {
    return 12;
}

// 接口类型 Interface
interface Student {
    age: number;
    sex?: string;
}

const student: Student = {age:18}













let box = document.getElementById('box')

const func = (entries, observer1) => {
    console.log(entries)
    console.log(observer1 === observer)

    
    entries.forEach(entry => {
        //IntersectionObserverEntry类
        console.log(entry)
    })
}

// IntersectionObserver类
const observer = new IntersectionObserver(func)
console.log(observer)
observer.observe(box)

















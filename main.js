let timer
let deleteFirstPhotoDelay

async function start() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all")
        const data = await response.json()
        createBreedList(data.message)
    } catch (error) {
        console.log('A error occurred fetching the list of breeds')
        console.log(error)
    }
}

start()

const createBreedList = (breeds) => {
    document.getElementById('breed').innerHTML = `
        <select onchange="loadByBreed(this.value)">
            <option>Choose a Breed</option>
            ${Object.keys(breeds).map((breed) => {
                let subbreeds = []
                if (breeds[breed].length == 0) {
                    return `<option>${breed}</option>`
                } else {
                    subbreeds = []
                    breeds[breed].forEach(subbreed => {
                        subbreeds.push(`<option>${subbreed + ' ' + breed}</option>`)
                        //console.log(subbreed + ' ' + breed)
                    });
                    return subbreeds
                }
            }).join('')}          
        </select>
    `
}

const loadByBreed = async (breed) => {
    const splitBreed = breed.split(' ')
    let lookupBreed
    if (splitBreed.length <= 1)
        lookupBreed = breed;
    else
        lookupBreed = splitBreed[1] + '/' + splitBreed[0]

    if (breed != 'Choose a Breed') {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${lookupBreed}/images`)
            const data = await response.json()
            createSlideshow(data.message)
        } catch (error) {
            console.log('A error occurred fetching images for breed: ' + lookupBreed)
            console.log(error)
        }
    }
}

const createSlideshow = (images) => {
    const slideNumUsed = (num) => {
        console.log(7)
        if (slidesShown.length >= images.length) {
            slidesShown = []
        }
        console.log(8)
        if (slidesShown.includes(num))
            return true
        slidesShown.push(num)
        console.log(9)
        return false
    }
    
    const getRandomSlideNum = (max) => {
    console.log(5)
        let num = Math.floor(Math.random() * max);
    console.log(6)
        while (slideNumUsed(num)) {
            num = Math.floor(Math.random() * max);
        }
        return num
    }

    const nextSlide = () => {
        currentSlide = getRandomSlideNum(images.length)
        document.getElementById('slideshow').insertAdjacentHTML("beforeend", 
            `<div class="slide" style="background-image: url('${images[currentSlide]}')"></div>`)
        deleteFirstPhotoDelay = setTimeout(() => {
            // Remove the FIRST slide element found
            document.querySelector('.slide').remove()
        }, 1000)
    }

    let currentSlide = 0
    let slidesShown = []

    if (images.length <= 0) {
        alert("No images found for this breed.")
        return;
    }

    if (timer != null)
        clearInterval(timer)
    if (deleteFirstPhotoDelay != null)
        clearTimeout(deleteFirstPhotoDelay)

    if (images.length == 1) {
        document.getElementById('slideshow').innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide"></div>`
    } else if (images.length == 2) {
        slideNumUsed(0)
        slideNumUsed(1)
        document.getElementById('slideshow').innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide" style="background-image: url('${images[1]}')"></div>`
        timer = setInterval(nextSlide, 5000)
    } else {
        slide1 = 
        document.getElementById('slideshow').innerHTML = `
            <div class="slide" style="background-image: url('${images[getRandomSlideNum(images.length)]}')"></div>
            <div class="slide" style="background-image: url('${images[getRandomSlideNum(images.length)]}')"></div>`
        timer = setInterval(nextSlide, 5000)
    }
}


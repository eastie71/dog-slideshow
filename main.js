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
    const nextSlide = () => {
        document.getElementById('slideshow').insertAdjacentHTML("beforeend", 
            `<div class="slide" style="background-image: url('${images[currentSlide]}')"></div>`)
        deleteFirstPhotoDelay = setTimeout(() => {
            // Remove the FIRST slide element found
            document.querySelector('.slide').remove()
        }, 1000)
        if (currentSlide >= images.length-1) {
            currentSlide = 0;
        } else {
            currentSlide++
        }
    }

    let currentSlide = 0
    if (timer != null)
        clearInterval(timer)
    if (deleteFirstPhotoDelay != null)
        clearTimeout(deleteFirstPhotoDelay)

    if (images.length > 1) {
        document.getElementById('slideshow').innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide" style="background-image: url('${images[1]}')"></div>`
        currentSlide += 2
        if (images.length == 2)
            currentSlide = 0;
        timer = setInterval(nextSlide, 5000)
    } else {
        document.getElementById('slideshow').innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide"></div>`
    }  
    
}
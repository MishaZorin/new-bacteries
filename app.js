const canvas = document.getElementById("canvas");
// создаёт объект для рисования в канвасе
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let restart = document.getElementById('restart')
let bacterias = []
let enemy = []
let foods = []


function Bacteria(x, y) {

    this.x = x
    this.y = y
    this.energy = 100
    if (this.energy == 0) {

    }
    this.divide = function () {
        if (this.energy > 150) {
            this.energy = 75
            bacterias.push(new Bacteria(this.x, this.y))

        }

    }

    this.update = function () {
        this.energy -= 0.1
        if (this.energy <= 0) {
            this.color = 'gray'

        }





    }
    this.eat = function () {
        for (let i = foods.length - 1; i >= 0; i--) {
            let f = foods[i]
            //  разница между координами, насколько далеко они находятся друг от другу
            let dx = this.x - f.x
            let dy = this.y - f.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < this.radius + f.radius) {
                this.energy += 50
                foods.splice(i, 1)

            }
        }
    }

    this.radius = 50
    this.speed = Math.random() + 0.5
    this.color = `rgb(${Math.floor(Math.random() * 255)},200,200)`
    this.direction = Math.random() * Math.PI * 2
    this.move = function () {
        let closestFood = null
        let minDist = Infinity
        foods.forEach(pieceOfFood => {
            let dx = this.x - pieceOfFood.x
            let dy = this.y - pieceOfFood.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < minDist) {
                minDist = dist
                closestFood = pieceOfFood
            }
        });
        if (closestFood && minDist < 150) {
            let angle = Math.atan2(
                closestFood.y - this.y,
                closestFood.x - this.x


            )
            this.x += Math.cos(angle) * this.speed
            this.y += Math.sin(angle) * this.speed

        }
        else {
            this.x += Math.cos(this.direction) * this.speed
            this.y += Math.sin(this.direction) * this.speed


        }
        if (this.x > canvas.width || this.x < 0) {
            this.direction = Math.PI - this.direction
        }
        if (this.y > canvas.height || this.y < 0) {
            this.direction = - this.direction
        }


    }
    this.draw = function () {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}
function Enemy(x, y) {
    this.x = x
    this.y = y
    this.energy = 60
    this.color = "red"
    this.radius = 50
    this.speed = Math.random() + 0.8
    this.direction = Math.random() * Math.PI * 2

    this.hit = function () {


        for (let i = bacterias.length - 1; i >= 0; i--) {
            let k = bacterias[i]
            //  разница между координами, насколько далеко они находятся друг от другу
            let dx = this.x - k.x
            let dy = this.y - k.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < this.radius + k.radius) {
                this.energy += 50
                bacterias.splice(i, 1)
                if (bacterias.length == 0) {
                    restart.style.display = "block"
                    restart.addEventListener("click", function () {
                        for (let i = 0; i < 10; i++) {
                            bacterias.push(new Bacteria(Math.random() * canvas.width, Math.random() * canvas.height))
                        }

                        
                    })


                }
                else{
                    restart.style.display = 'none'
                }


            }

        }
    }
    this.move = function () {
        this.x += Math.cos(this.direction) * this.speed
        this.y += Math.sin(this.direction) * this.speed
        if (this.x > canvas.width || this.x < 0) {
            this.direction = Math.PI - this.direction
        }
        if (this.y > canvas.height || this.y < 0) {
            this.direction = - this.direction
        }
    }
    this.draw = function () {


        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }

}
function Food(x, y) {
    this.x = x
    this.y = y
    this.radius = 40
    this.direction = Math.random() * Math.PI * 2

    this.draw = function () {
        ctx.beginPath()
        ctx.rect(this.x, this.y, 50, 15)
        ctx.fillStyle = "yellow"
        ctx.fill()
    }

}



for (let i = 0; i < 9; i++) {

    enemy.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height))
}

function click(mouseX, mouseY) {
    for (let i = 0; i < Math.random() * 3 + 3; i++) {
        foods.push(new Food(mouseX + (Math.random() * 200 - 100), mouseY + (Math.random() * 200 - 100)))

    }



}

canvas.addEventListener("click", function (event) {
    //передаём координаты мышки, в каком месте создаваьт еду

    click(event.clientX, event.clientY)




})

for (let i = 0; i < 10; i++) {
    bacterias.push(new Bacteria(Math.random() * canvas.width, Math.random() * canvas.height))
}

function animate() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    for (let i = bacterias.length - 1; i >= 0; i--) {

        let b = bacterias[i]
        b.update()
        b.eat()
        b.draw()
        b.move()
        b.divide()


    }
    for (let i = enemy.length - 1; i >= 0; i--) {
        let m = enemy[i]
        m.draw()
        m.move()
        m.hit()




    }



    for (let i = foods.length - 1; i >= 0; i--) {
        let foodForbacterias = foods[i]
        foodForbacterias.draw()
    }






    requestAnimationFrame(animate)
}
animate()

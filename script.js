window.addEventListener("load", function () {
  const canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  //   canvas.width = 500;
  //   canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        this.game.lastKey = "P" + e.key;
      });

      window.addEventListener("keyup", (e) => {
        this.game.lastKey = "R" + e.key;
      });
    }
  }

  class OwlBear {
    constructor(game) {
      this.game = game;
      this.spriteWidth = 200;
      this.spriteHeight = 200;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 30;
      this.width = 100;
      this.height = 100;
      this.x = 200;
      this.y = 200;
      this.speedX = 0;
      this.speedY = 0;
      //   Positive value of y = down, negative = up
      this.maxSpeed = 3;
      this.topMargin = 100;
      this.image = document.querySelector("#owlbear");
      this.fps = 10;
      this.frameInterval = 1000 / this.fps;
      this.frameTimer = 0;
    }
    draw(context) {
      //   context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    setSpeed(speedX, speedY) {
      this.speedX = speedX;
      this.speedY = speedY;
    }

    update(deltaTime) {
      this.x += this.speedX;
      this.y += this.speedY;
      switch (this.game.lastKey) {
        case "PArrowLeft":
          this.setSpeed(-this.maxSpeed, 0);
          this.frameY = 3;
          break;
        case "RArrowLeft":
          this.setSpeed(0, 0);
          this.frameY = 2;
          break;
        case "PArrowRight":
          this.setSpeed(this.maxSpeed, 0);
          this.frameY = 5;
          break;
        case "RArrowRight":
          this.setSpeed(0, 0);
          this.frameY = 4;
          break;
        case "PArrowUp":
          this.setSpeed(0, -2);
          this.frameY = 7;
          break;
        case "RArrowUp":
          this.setSpeed(0, 0);
          this.frameY = 6;
          break;
        case "PArrowDown":
          this.setSpeed(0, 2);
          this.frameY = 1;
          break;
        case "RArrowDown":
          this.setSpeed(0, 0);
          this.frameY = 0;
          break;
      }
      //   boundries
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > this.game.width - this.width) {
        this.x = this.game.width - this.width;
      } else if (this.y < this.topMargin) {
        this.y = this.topMargin;
      } else if (this.y > this.game.height - this.height) {
        this.y = this.game.height - this.height;
      } else {
        this.y = this.y;
        this.x = this.x;
      }

      // sprite animation

      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
  }

  class Object {
    constructor(game) {
      this.game = game;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {}
  }

  class Bush extends Object {
    constructor(game) {
      super();
      this.game = game;
      this.image = document.querySelector("#bush");
      this.imageWidth = 216;
      this.imageHeight = 100;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * this.game.width - this.width;
      this.yCalc = this.game.height - this.height - this.game.topMargin;
      this.y = this.game.topMargin + Math.random() * this.yCalc;
    }
  }
  class Plant extends Object {
    constructor(game) {
      super();
      this.game = game;
      this.image = document.querySelector("#plant");
      this.imageWidth = 212;
      this.imageHeight = 118;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * this.game.width - this.width;
      this.yCalc = this.game.height - this.height - this.game.topMargin;
      this.y = this.game.topMargin + Math.random() * this.yCalc;
    }
  }
  class Grass extends Object {
    constructor(game) {
      super();
      this.game = game;
      this.image = document.querySelector("#grass");
      this.imageWidth = 103;
      this.imageHeight = 182;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * this.game.width - this.width;
      this.yCalc = this.game.height - this.height - this.game.topMargin;
      this.y = this.game.topMargin + Math.random() * this.yCalc;
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.lastKey = undefined;
      this.input = new InputHandler(this);
      this.owlbear = new OwlBear(this);
      this.numberOfPlants = 10;
      this.plants = [];
      this.gameObjects = [];
      this.topMargin = 200;
    }
    render(context, deltaTime) {
      this.gameObjects = [...this.plants, this.owlbear];
      this.gameObjects.sort((a, b) => {
        return a.y + a.height - (b.y - b.height);
      });

      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(deltaTime);
      });
      this.plants.forEach((plant) => plant.draw(context));
      //   this.owlbear.draw(context);
      //   this.owlbear.update(deltaTime);
    }
    init() {
      for (let i = 0; i < this.numberOfPlants; i++) {
        const randomize = Math.random();
        if (randomize < 0.3) {
          this.plants.push(new Plant(this));
        } else if (randomize < 0.6) {
          this.plants.push(new Grass(this));
        } else {
          this.plants.push(new Bush(this));
        }
      }
    }
  }

  const game = new Game(canvas.width, canvas.height);
  game.init();
  console.log(game.plants);
  this.lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = deltaTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});

window.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('#game');
    const ctx = map.getContext('2d');


    map.width = 750;
    map.height = 585;

    const grid = 15;
    const paddleHeight = grid * 5;
    const maxPaddleY = map.height - grid - paddleHeight;

    const leftCounter = document.createElement('div');
    const rightCounter = document.createElement('div');
    leftCounter.id = 'leftCounter';
    rightCounter.id = 'rightCounter';

    document.body.insertBefore(leftCounter, map);
    document.body.insertBefore(rightCounter, map);

    leftCounter.textContent = 0;
    rightCounter.textContent = 0;

    let ballSpeed = 3.5;
    let paddleSpeed = 7;

    const leftPaddle = {
        x: grid * 2,
        y: map.height / 2 - paddleHeight / 2,
        width: grid,
        height: paddleHeight,
        dy: 0,
    };

    const rightPaddle = {
        x: map.width - grid * 3,
        y: map.height / 2 - paddleHeight / 2,
        width: grid,
        height: paddleHeight,
        dy: 0,
    };

    const ball = {
        x: map.width / 2,
        y: map.height / 2,
        width: grid,
        height: grid,
        dx: ballSpeed,
        dy: -ballSpeed,
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' || event.key === 'ц') {
            leftPaddle.dy = -paddleSpeed;
        } else if (event.key === 's' || event.key === 'ы') {
            leftPaddle.dy = paddleSpeed;
        }
        if (event.key === 'ArrowUp') {
            rightPaddle.dy = -paddleSpeed;
        } else if (event.key === 'ArrowDown') {
            rightPaddle.dy = paddleSpeed;
        }
    });
    document.addEventListener('keyup', (event) => {
        if (['w', 's', 'ц', 'ы'].includes(event.key)) {
            leftPaddle.dy = 0;
        }
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            rightPaddle.dy = 0;
        }
    });

    function clearMap() {
        ctx.clearRect(0, 0, map.width, map.height);
    }

    function renderMap() {
        ctx.fillStyle = 'rgb(228, 164, 87)';
        ctx.fillRect(0, 0, map.width, map.height);
        ctx.fillStyle = 'black';

        ctx.fillRect(0, 0, map.width, grid);
        ctx.fillRect(0, map.height - grid, map.width, grid);

        for (let i = grid; i < map.height - grid; i += grid * 2) {
            ctx.fillRect(map.width / 2 - grid / 2, i, grid, grid);
        }
    }

    function renderPaddle(paddle) {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function movePaddles() {
        leftPaddle.y += leftPaddle.dy;
        rightPaddle.y += rightPaddle.dy;

        leftPaddle.y = Math.max(grid, Math.min(leftPaddle.y, maxPaddleY));
        rightPaddle.y = Math.max(grid, Math.min(rightPaddle.y, maxPaddleY));
    }

    function renderBall() {
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }

    function collideWallsWithBall() {
        if (ball.y < grid) {
            ball.y = grid;
            ball.dy = -ball.dy;
        } else if (ball.y + ball.height > map.height - grid) {
            ball.y = map.height - grid - ball.height;
            ball.dy = -ball.dy;
        }
    }

    function isCollides(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    function collidePaddlesWithBall() {
        if (isCollides(ball, rightPaddle) && ball.dx > 0) {
            ball.dx = -ball.dx;
            ball.x = rightPaddle.x - ball.width;
            rightCounter.textContent = parseInt(rightCounter.textContent) + 1;
        }
        if (isCollides(ball, leftPaddle) && ball.dx < 0) {
            ball.dx = -ball.dx;
            ball.x = leftPaddle.x + leftPaddle.width;
            leftCounter.textContent = parseInt(leftCounter.textContent) + 1;
        }
    }

    function resetBall() {
        ball.x = map.width / 2;
        ball.y = map.height / 2;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
        ball.dy = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
    }

    function loop() {
        clearMap();
        renderMap();

        movePaddles();
        renderPaddle(leftPaddle);
        renderPaddle(rightPaddle);

        moveBall();
        collideWallsWithBall();
        collidePaddlesWithBall();

        if (ball.x + ball.width < 0) {
            rightCounter.textContent = parseInt(rightCounter.textContent) + 1;
            resetBall();
        }
        if (ball.x > map.width) {
            leftCounter.textContent = parseInt(leftCounter.textContent) + 1;
            resetBall();
        }

        renderBall();

        requestAnimationFrame(loop);
    }

    loop();

});

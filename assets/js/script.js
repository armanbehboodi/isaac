$(function () {
    let $body = $('body'),
        $window = $(window),
        $isaac = $('.gr-isaac'),
        windowHeight = $window.height(),
        isMoving = false,
        isGravityDiscovered = false,
        movingTimer,
        fallingTimer,
        appleGeneratorTimer

    // isaac move handler
    const isaacMoveHandler = (direction) => {
        if (!direction) clearInterval(movingTimer);
        else {
            movingTimer = setInterval(() => {
                if (direction === 'ArrowRight' && Number($isaac.css('right').replace('px', '')) > 0) {
                    $isaac.animate({left: '+=2'}, 0);
                } else if (direction === 'ArrowLeft' && Number($isaac.css('left').replace('px', '')) > 0) {
                    $isaac.animate({left: '-=2'}, 0);
                }
            }, 0);
        }
    }

    // creating apples in random locations
    appleGeneratorTimer = setInterval(() => {
        let $apple = $('<div class="gr-apple"></div>');

        $apple.css({left: `${Math.random() * $window.width()}px`});
        $body.append($apple);
    }, 1000);

    // apples falling simulator
    fallingTimer = setInterval(() => {
        let $apple = $('.gr-apple');

        if ($apple.length > 0) {
            $apple.animate({top: '+=2'}, 0);

            $apple.map((index, item) => {
                let $item = $(item),
                    itemOffset = $item.offset();

                // removing apples when they are out of screen
                if (itemOffset.top > windowHeight) $item.remove();
                if (windowHeight - itemOffset.top < 165) {
                    let itemLeft = itemOffset.left + 45;

                    // check if isaac discovered gravity or not
                    if (itemLeft >= $isaac.offset().left && itemLeft <= $isaac.offset().left + 65) {
                        clearInterval(fallingTimer);
                        clearInterval(appleGeneratorTimer);
                        clearInterval(movingTimer);
                        isGravityDiscovered = true;

                        $apple.map((i, apple) => {
                            if (i !== index) $(apple).remove();
                        })
                    }
                }
            })
        }
    }, 25);

    // moving isaac with cursor keys
    $body.on('keydown', function (e) {
        let selectedKey = e.key;

        if (!isGravityDiscovered && ['ArrowRight', 'ArrowLeft'].indexOf(selectedKey) !== -1 && !isMoving) {
            isMoving = true;
            isaacMoveHandler(selectedKey);
        }
    })
        .on('keyup', function () {
            isMoving = false;
            isaacMoveHandler(null);
        })
})
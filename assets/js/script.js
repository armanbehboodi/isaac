$(function () {
    let $body = $('body'),
        $window = $(window),
        $isaac = $('.gr-isaac'),
        windowHeight = $window.height(),
        windowWidth = $window.width(),
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
    const createApple = () => {
        appleGeneratorTimer = setInterval(() => {
            let $apple = $('<div class="gr-apple"></div>');

            $apple.css({left: `${Math.random() * $window.width()}px`});
            $body.append($apple);
        }, 1000);
    }
    createApple();

    // prevent from generating apples when user is not in the game's tab
    $(window).focus(function () {
        if (!isGravityDiscovered) createApple();
    });

    $(window).blur(function () {
        clearInterval(appleGeneratorTimer);
    });

    // apples falling simulator
    fallingTimer = setInterval(() => {
        let $apple = $('.gr-apple');

        if ($apple.length > 0) {
            $apple.animate({top: '+=2'}, 0);

            let isaacOffset = $isaac.offset();

            $apple.map((index, item) => {
                let $item = $(item),
                    itemOffset = $item.offset();

                // removing apples when they are out of screen
                if (itemOffset.top > windowHeight) $item.remove();
                if (windowHeight - itemOffset.top < 165) {
                    let itemLeft = itemOffset.left + 45,
                        itemBottom = itemOffset.top + 45;

                    // check if isaac discovered gravity or not
                    if ((itemLeft >= isaacOffset.left && itemLeft <= isaacOffset.left + 65)
                        && (itemBottom >= isaacOffset.top && itemBottom <= isaacOffset.top + 65)) {
                        clearInterval(fallingTimer);
                        clearInterval(appleGeneratorTimer);
                        clearInterval(movingTimer);
                        isGravityDiscovered = true;
                        isaacDanceHandler();

                        $apple.map((i, apple) => {
                            if (i !== index) $(apple).remove();
                        })
                    }
                }
            })
        }
    }, 25);

    // gravity discovering dance :)
    const isaacDanceHandler = () => {
        let verticalDir = "top",
            horizontalDir = "left";

        clearInterval(appleGeneratorTimer);

        setInterval(function () {
            let isaacOffset = $isaac.offset(),
                isaacLeft = isaacOffset.left,
                isaacTop = isaacOffset.top;

            $("#gr-final-song")[0].play();

            if (horizontalDir === "left" && windowWidth - isaacLeft > 80) $isaac.animate({left: '+=1'}, 0);
            else {
                horizontalDir = "right";
                if (isaacLeft > 5) $isaac.animate({left: '-=1'}, 0);
                else horizontalDir = "left";
            }

            if (verticalDir === "top" && isaacTop > 0) $isaac.animate({top: '-=1'}, 0);
            else {
                verticalDir = "bottom";
                if (windowHeight - isaacTop > 80) $isaac.animate({top: '+=1'}, 0);
                else verticalDir = "top";
            }
        }, 10);
    }

    // moving isaac with cursor keys
    $body.on('keydown touchstart', function (e) {
        let selectedKey = e.type === "keydown" ? e.key : $(e.target).attr('id');

        if (!isGravityDiscovered && ['ArrowRight', 'ArrowLeft'].indexOf(selectedKey) !== -1 && !isMoving) {
            isMoving = true;
            isaacMoveHandler(selectedKey);
        }
    })
        .on('keyup touchend', function () {
            isMoving = false;
            isaacMoveHandler(null);
        })
})
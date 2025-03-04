jQuery(document).ready(function($) {

    $(".dt-sc-product-single-slider-swiper-container").each(function() {

        var $loop = ($(this).attr('data-loop') === 'true') ? true : false;
        var $keyboardcontrol = ($(this).attr('data-keyboardcontrol') === 'true') ? true : false;
        var $mousewheelcontrol = ($(this).attr('data-mousewheelcontrol') === 'true') ? true : false;
        var $centeredslides = ($(this).attr('data-centeredslides') === 'true') ? true : false;

        var $options = {
            direction: $(this).attr('data-direction'),
            speed: parseInt($(this).attr('data-speed')),
            loop: $loop,
            grabCursor: true,
            keyboardControl: $keyboardcontrol,
            mousewheelControl: $mousewheelcontrol,
            centeredSlides: $centeredslides,
            slidesPerView: parseInt($(this).attr('data-slidesperview')),
            spaceBetween: parseInt($(this).attr('data-spacebetween')),
        };

        $effect = $(this).attr('data-effect');
        if (typeof $effect != 'undefined' && $effect.length > 0) {
            $options.effect = $effect;
        }

        var slidespercolumn = parseInt($(this).attr('data-slidespercolumn'));
        if ($effect === 'multirows') {
            $options.slidesPerColumn = slidespercolumn;
        }

        $allowautoplay = $(this).attr('data-allowautoplay');
        if ($allowautoplay == 'yes') {
            $options.autoplay = parseFloat($(this).attr('data-autoplay'));
        }

        $showpagination = $(this).attr('data-showpagination');
        if ($showpagination == 'true') {
            $options.pagination = $(this).find('.swiper-pagination');
            $options.paginationClickable = true;
            $options.paginationType = $(this).attr('data-pagination');
        }

        $navigation = $(this).attr('data-shownavigation');
        if ($navigation == 'true') {
            $options.nextButton = $(this).find('.swiper-button-next');
            $options.prevButton = $(this).find('.swiper-button-prev');
        }

        $options.breakpoints = {
            320: {
                slidesPerView: 1
            },
            640: {
                slidesPerView: ($options.slidesPerView == 1) ? 1 : 2
            },
        };

        new Swiper($(this), $options);
    });

    // Products Carousel
    $(".dt-product-carousel-products").each(function() {

        $(this).find('.woocommerce').addClass('swiper-container');
        $(this).find('.products').addClass('swiper-wrapper');
        $(this).find('.product.type-product').addClass('swiper-slide');

        var $loop = ($(this).attr('data-loop') === 'true') ? true : false;
        var $keyboardcontrol = ($(this).attr('data-keyboardcontrol') === 'true') ? true : false;
        var $mousewheelcontrol = ($(this).attr('data-mousewheelcontrol') === 'true') ? true : false;
        var $centeredslides = ($(this).attr('data-centeredslides') === 'true') ? true : false;

        var $options = {
            direction: $(this).attr('data-direction'),
            speed: parseInt($(this).attr('data-speed')),
            loop: $loop,
            grabCursor: true,
            keyboardControl: $keyboardcontrol,
            mousewheelControl: $mousewheelcontrol,
            centeredSlides: $centeredslides,
            slidesPerView: parseInt($(this).attr('data-slidesperview')),
            spaceBetween: parseInt($(this).attr('data-spacebetween')),
        };

        $effect = $(this).attr('data-effect');
        if (typeof $effect != 'undefined' && $effect.length > 0) {
            $options.effect = $effect;
        }

        var slidespercolumn = parseInt($(this).attr('data-slidespercolumn'));
        if ($effect === 'multirows') {
            $options.slidesPerColumn = slidespercolumn;
        }

        $allowautoplay = $(this).attr('data-allowautoplay');
        if ($allowautoplay == 'yes') {
            $options.autoplay = parseFloat($(this).attr('data-autoplay'));
        }

        $showpagination = $(this).attr('data-showpagination');
        if ($showpagination == 'true') {
            $options.pagination = $(this).find('.swiper-pagination');
            $options.paginationClickable = true;
            $options.paginationType = $(this).attr('data-pagination');
        }

        $navigation = $(this).attr('data-shownavigation');
        if ($navigation == 'true') {
            $options.nextButton = $(this).find('.swiper-button-next');
            $options.prevButton = $(this).find('.swiper-button-prev');
        }

        $options.breakpoints = {
            479: {
                slidesPerView: 1
            },
            640: {
                slidesPerView: 1
            },
            767: {
                slidesPerView: 2
            }
        };

        new Swiper($(this).find('.swiper-container'), $options);
    });

    // Grid, List View
    var $vwrap = $('div.view-mode');
    if ($vwrap.length) {

        $('#primary ul.products').addClass('grid-view');

        $('div.view-mode a').on("click", function(e) {

            var $vmode = $(this).attr('href');
            if ($vmode === 'list') {
                $('#primary ul.products').addClass('list-view').removeClass('grid-view');

                var $temp = $('#primary ul.products.list-view li .product-wrapper').parent().attr('class');
                $('#primary ul.products.list-view li .product-wrapper').parent().attr('data-class', $temp);

                $('#primary ul.products.list-view li .product-wrapper').parent().removeClass().addClass('column dt-sc-one-column');

                $('.view-mode a.grid').removeClass('active');
                $(this).addClass('active');

            } else {
                $('#primary ul.products').addClass('grid-view').removeClass('list-view');

                var $temp = $('#primary ul.products.grid-view li .product-wrapper').parent().attr('data-class');
                $('#primary ul.products.grid-view li .product-wrapper').parent().attr('class', $temp);

                $('.view-mode a.list').removeClass('active');
                $(this).addClass('active');
            }

            e.preventDefault();
        });
    }
});
/*global jQuery */
/*jshint browser:true */
/*!
 * FitVids 1.1
 *
 * Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
 * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 *
 */
! function($) {
    "use strict";
    $.fn.fitVids = function(options) {
        var settings = {
            customSelector: null
        };
        if (!document.getElementById("fit-vids-style")) {
            var head = document.head || document.getElementsByTagName("head")[0],
                css = ".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",
                div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + "</style>", head.appendChild(div.childNodes[1])
        }
        return options && $.extend(settings, options), this.each(function() {
            var selectors = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
            settings.customSelector && selectors.push(settings.customSelector);
            var $allVideos = $(this).find(selectors.join(","));
            $allVideos = $allVideos.not("object object"), $allVideos.each(function() {
                var $this = $(this);
                if (!("embed" === this.tagName.toLowerCase() && $this.parent("object").length || $this.parent(".fluid-width-video-wrapper").length)) {
                    $this.css("height") || $this.css("width") || !isNaN($this.attr("height")) && !isNaN($this.attr("width")) || ($this.attr("height", 9), $this.attr("width", 16));
                    var height = "object" === this.tagName.toLowerCase() || $this.attr("height") && !isNaN(parseInt($this.attr("height"), 10)) ? parseInt($this.attr("height"), 10) : $this.height(),
                        width = isNaN(parseInt($this.attr("width"), 10)) ? $this.width() : parseInt($this.attr("width"), 10),
                        aspectRatio = height / width;
                    if (!$this.attr("id")) {
                        var videoID = "fitvid" + Math.floor(999999 * Math.random());
                        $this.attr("id", videoID)
                    }
                    $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * aspectRatio + "%"), $this.removeAttr("height").removeAttr("width")
                }
            })
        })
    }
}(window.jQuery || window.Zepto);
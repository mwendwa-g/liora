// Sticky Plugin v1.0.4 for jQuery
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
    var b = Array.prototype.slice,
        c = Array.prototype.splice,
        d = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: "is-sticky",
            wrapperClassName: "sticky-wrapper",
            center: !1,
            getWidthFrom: "",
            widthFromWrapper: !0,
            responsiveWidth: !1,
            zIndex: "inherit"
        },
        e = a(window),
        f = a(document),
        g = [],
        h = e.height(),
        i = function() {
            for (var b = e.scrollTop(), c = f.height(), d = c - h, i = b > d ? d - b : 0, j = 0, k = g.length; j < k; j++) {
                var l = g[j],
                    m = l.stickyWrapper.offset().top,
                    n = m - l.topSpacing - i;
                if (b <= n) null !== l.currentTop && (l.stickyElement.css({
                    width: "",
                    position: "",
                    top: "",
                    "z-index": ""
                }), l.stickyElement.parent().removeClass(l.className), l.stickyElement.trigger("sticky-end", [l]), l.currentTop = null);
                else {
                    var o = c - l.stickyElement.outerHeight() - l.topSpacing - l.bottomSpacing - b - i;
                    if (o < 0 ? o += l.topSpacing : o = l.topSpacing, l.currentTop !== o) {
                        var p;
                        l.getWidthFrom ? (padding = l.stickyElement.innerWidth() - l.stickyElement.width(), p = a(l.getWidthFrom).width() - padding || null) : l.widthFromWrapper && (p = l.stickyWrapper.width()), null == p && (p = l.stickyElement.width()), l.stickyElement.css("position", "fixed").css("top", o).css("z-index", l.zIndex), l.stickyElement.parent().addClass(l.className), null === l.currentTop ? l.stickyElement.trigger("sticky-start", [l]) : l.stickyElement.trigger("sticky-update", [l]), l.currentTop === l.topSpacing && l.currentTop > o || null === l.currentTop && o < l.topSpacing ? l.stickyElement.trigger("sticky-bottom-reached", [l]) : null !== l.currentTop && o === l.topSpacing && l.currentTop < o && l.stickyElement.trigger("sticky-bottom-unreached", [l]), l.currentTop = o
                    }
                    var q = l.stickyWrapper.parent();
                    l.stickyElement.offset().top + l.stickyElement.outerHeight() >= q.offset().top + q.outerHeight() && l.stickyElement.offset().top <= l.topSpacing ? l.stickyElement.css("position", "absolute").css("top", "").css("bottom", 0).css("z-index", "") : l.stickyElement.css("position", "fixed").css("top", o).css("bottom", "").css("z-index", l.zIndex)
                }
            }
        },
        j = function() {
            h = e.height();
            for (var b = 0, c = g.length; b < c; b++) {
                var d = g[b],
                    f = null;
                d.getWidthFrom ? d.responsiveWidth && (f = a(d.getWidthFrom).width()) : d.widthFromWrapper && (f = d.stickyWrapper.width()), null != f && d.stickyElement.css("width", f)
            }
        },
        k = {
            init: function(b) {
                return this.each(function() {
                    var c = a.extend({}, d, b),
                        e = a(this),
                        f = e.attr("id"),
                        h = f ? f + "-" + d.wrapperClassName : d.wrapperClassName,
                        i = a("<div></div>").attr("id", h).addClass(c.wrapperClassName);
                    e.wrapAll(function() {
                        if (0 == a(this).parent("#" + h).length) return i
                    });
                    var j = e.parent();
                    c.center && j.css({
                        width: e.outerWidth(),
                        marginLeft: "auto",
                        marginRight: "auto"
                    }), "right" === e.css("float") && e.css({
                        float: "none"
                    }).parent().css({
                        float: "right"
                    }), c.stickyElement = e, c.stickyWrapper = j, c.currentTop = null, g.push(c), k.setWrapperHeight(this), k.setupChangeListeners(this)
                })
            },
            setWrapperHeight: function(b) {
                var c = a(b),
                    d = c.parent();
                d && d.css("height", c.outerHeight())
            },
            setupChangeListeners: function(a) {
                if (window.MutationObserver) {
                    new window.MutationObserver(function(b) {
                        (b[0].addedNodes.length || b[0].removedNodes.length) && k.setWrapperHeight(a)
                    }).observe(a, {
                        subtree: !0,
                        childList: !0
                    })
                } else window.addEventListener ? (a.addEventListener("DOMNodeInserted", function() {
                    k.setWrapperHeight(a)
                }, !1), a.addEventListener("DOMNodeRemoved", function() {
                    k.setWrapperHeight(a)
                }, !1)) : window.attachEvent && (a.attachEvent("onDOMNodeInserted", function() {
                    k.setWrapperHeight(a)
                }), a.attachEvent("onDOMNodeRemoved", function() {
                    k.setWrapperHeight(a)
                }))
            },
            update: i,
            unstick: function(b) {
                return this.each(function() {
                    for (var b = this, d = a(b), e = -1, f = g.length; f-- > 0;) g[f].stickyElement.get(0) === b && (c.call(g, f, 1), e = f); - 1 !== e && (d.unwrap(), d.css({
                        width: "",
                        position: "",
                        top: "",
                        float: "",
                        "z-index": ""
                    }))
                })
            }
        };
    window.addEventListener ? (window.addEventListener("scroll", i, !1), window.addEventListener("resize", j, !1)) : window.attachEvent && (window.attachEvent("onscroll", i), window.attachEvent("onresize", j)), a.fn.sticky = function(c) {
        return k[c] ? k[c].apply(this, b.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.sticky") : k.init.apply(this, arguments)
    }, a.fn.unstick = function(c) {
        return k[c] ? k[c].apply(this, b.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.sticky") : k.unstick.apply(this, arguments)
    }, a(function() {
        setTimeout(i, 0)
    })
});
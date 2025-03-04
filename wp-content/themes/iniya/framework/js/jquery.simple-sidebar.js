/*! simple-sidebar v2.2.0 (https://dcdeiv.github.io/simple-sidebar)
 ** Davide Di Criscito <davide.dicriscito@gmail.com> (http://github.com/dcdeiv)
 ** (c) 2014-2015 Licensed under GPLv2
 */
! function(a) {
    a.fn.simpleSidebar = function(b) {
        var c = a.extend(!0, a.fn.simpleSidebar.settings, b);
        return this.each(function() {
            var b, d, e, f, g, h, i, j = c.attr,
                k = a(this),
                l = a(c.opener),
                m = a(c.wrapper),
                n = a(c.ignore),
                o = a(c.add),
                p = c.sidebar.closingLinks,
                q = c.sidebar.width,
                r = c.sidebar.gap,
                s = q + r,
                t = a(window).width(),
                u = c.animation.duration,
                v = {},
                w = {},
                x = {},
                y = {},
                z = function() { /*a("body, html").css("overflow","hidden")*/ },
                A = function() {
                    a("body, html").css("overflow", "auto")
                },
                B = {
                    duration: u,
                    easing: c.animation.easing,
                    complete: z
                },
                C = {
                    duration: u,
                    easing: c.animation.easing,
                    complete: A
                },
                D = function() {
                    J.animate(v, B), k.animate(x, B).attr("data-" + j, "active"), H.fadeIn(u)
                },
                E = function() {
                    J.animate(w, C), k.animate(y, C).attr("data-" + j, "disabled"), H.fadeOut(u)
                },
                F = function() {
                    var a = k.attr("data-" + j),
                        c = k.width();
                    w[b] = "-=" + c, w[d] = "+=" + c, y[b] = -c, "active" === a && (J.not(k).animate(w, C), k.animate(y, C).attr("data-" + j, "disabled"), H.fadeOut(u))
                },
                G = a("<div>").attr("data-" + j, "sbwrapper").css(c.sbWrapper.css),
                H = a("<div>").attr("data-" + j, "mask"),
                I = m.siblings().not("script noscript"),
                J = m.add(I).not(n).not(k).not(H).not("script").not("noscript").add(o);
            void 0 === c.sidebar.align || "right" === c.sidebar.align ? (b = "right", d = "left") : "left" === c.sidebar.align && (b = "left", d = "right"), g = {
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: c.sidebar.css.zIndex - 1,
                display: "none"
            }, h = a.extend(!0, g, c.mask.css), !0 === c.mask.display && H.appendTo("body").css(h), i = s > t ? t - r : q, e = {
                position: "fixed",
                top: 0,
                bottom: 0,
                width: i
            }, x[b] = 0, e[b] = -i, f = a.extend(!0, e, c.sidebar.css), k.css(f).attr("data-" + j, "disabled"), !0 === c.sbWrapper.display && k.wrapInner(G), l.click(function() {
                var a = k.attr("data-" + j),
                    c = k.width();
                v[b] = "+=" + c, v[d] = "-=" + c, w[b] = "-=" + c, w[d] = "+=" + c, y[b] = -c, "disabled" === a ? D() : "active" === a && E()
            }), H.click(F), k.on("click", p, F), a(window).resize(function() {
                var c, e = k.attr("data-" + j),
                    f = a(window).width(),
                    g = {};
                c = s > f ? f - r : q, w[b] = "-=" + c, w[d] = "+=" + c, g[b] = -c, g[d] = "", g.width = c, k.css(g).attr("data-" + j, "disabled"), "active" === e && (J.not(k).animate(w, C), H.fadeOut(u))
            })
        })
    }, a.fn.simpleSidebar.settings = {
        attr: "simplesidebar",
        animation: {
            duration: 500,
            easing: "swing"
        },
        sidebar: {
            width: 300,
            gap: 64,
            closingLinks: "a",
            css: {
                zIndex: 3e3
            }
        },
        sbWrapper: {
            display: !0,
            css: {
                position: "relative",
                height: "100%" /*,overflowY:"auto",overflowX:"hidden"*/
            }
        },
        mask: {
            display: !0,
            css: {
                backgroundColor: "black",
                opacity: .5,
                filter: "Alpha(opacity=50)"
            }
        }
    }
}(jQuery);
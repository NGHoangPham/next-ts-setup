(window.webpackJsonp = window.webpackJsonp || []).push([
  [3],
  {
    '+EG+': function (e, t, n) {
      'use strict';
      var o, i, r, s;
      n.d(t, 'a', function () {
        return r;
      }),
        n.d(t, 'b', function () {
          return s;
        }),
        (o = n('mrSG')),
        (i = n('q1tI')),
        (r = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            o.__extends(t, e),
            (t.prototype.shouldComponentUpdate = function () {
              return !1;
            }),
            (t.prototype.render = function () {
              return i.createElement('div', {
                style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
                ref: this.props.reference,
              });
            }),
            t
          );
        })(i.Component)),
        (s = i.createContext(null));
    },
    '6uNr': function (e, t, n) {
      e.exports = {
        menuWrap: 'menuWrap-1gEtmoET-',
        isMeasuring: 'isMeasuring-FZ0EJCM2-',
        scrollWrap: 'scrollWrap-1B5MfTJt-',
        momentumBased: 'momentumBased-1Jq4gQt2-',
        menuBox: 'menuBox-20sJGjtG-',
        isHidden: 'isHidden-2vLQpR1t-',
      };
    },
    DTHj: function (e, t, n) {
      'use strict';
      var o, i, r, s, a, u, d, l, c, p, h;
      n.d(t, 'a', function () {
        return h;
      }),
        (o = n('mrSG')),
        (i = n('q1tI')),
        (r = n('TSYQ')),
        (s = n('Eyy1')),
        (a = n('Hr11')),
        (u = n('XAms')),
        (d = n('+EG+')),
        (l = n('tWVy')),
        (c = n('jAh7')),
        (p = n('6uNr')),
        (h = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n._containerRef = null),
              (n._scrollWrapRef = null),
              (n._raf = null),
              (n._manager = new c.OverlapManager()),
              (n._handleContainerRef = function (e) {
                return (n._containerRef = e);
              }),
              (n._handleScrollWrapRef = function (e) {
                return (n._scrollWrapRef = e);
              }),
              (n._handleMeasure = function () {
                var e, t, o, i, r, u, d, l, c, p, h, m, f, _, v, g;
                n.state.isMeasureValid ||
                  ((e = n.props.position),
                  (o = (t = Object(s.ensureNotNull)(n._containerRef)).getBoundingClientRect()),
                  (i = document.documentElement.clientHeight),
                  (r = document.documentElement.clientWidth),
                  (u = i - 10),
                  (d = o.height > u) &&
                    ((Object(s.ensureNotNull)(n._scrollWrapRef).style.overflowY = 'scroll'),
                    (o = t.getBoundingClientRect())),
                  (l = o.width),
                  (c = o.height),
                  (p = 'function' == typeof e ? e(l, c) : e),
                  (h = 5),
                  (m = r - l - 5),
                  (f = Object(a.clamp)(p.x, h, Math.max(h, m))),
                  (_ = 5),
                  (v = i - (p.overrideHeight || c) - 5),
                  (g = Object(a.clamp)(p.y, _, Math.max(_, v))),
                  n.setState(
                    {
                      appearingMenuHeight: p.overrideHeight || (d ? u : void 0),
                      appearingMenuWidth: p.overrideWidth,
                      appearingPosition: { x: f, y: g },
                      isMeasureValid: !0,
                    },
                    n._scrollToFocusedElement
                  ));
              }),
              (n._scrollToFocusedElement = function () {
                var e = document.activeElement,
                  t = Object(s.ensureNotNull)(n._containerRef);
                null !== e && t.contains(e) && e.scrollIntoView();
              }),
              (n._resize = function () {
                null === n._raf &&
                  (n._raf = requestAnimationFrame(function () {
                    n.setState({
                      appearingMenuHeight: void 0,
                      appearingMenuWidth: void 0,
                      appearingPosition: void 0,
                      isMeasureValid: void 0,
                    }),
                      (n._raf = null);
                  }));
              }),
              (n._handleGlobalClose = function () {
                n.props.onClose();
              }),
              (n._handleSlot = function (e) {
                n._manager.setContainer(e);
              }),
              (n.state = {}),
              n
            );
          }
          return (
            o.__extends(t, e),
            (t.prototype.componentWillReceiveProps = function (e) {
              this.props.isOpened && !e.isOpened && this.setState({ isMeasureValid: void 0 });
            }),
            (t.prototype.componentDidMount = function () {
              this._handleMeasure();
              var e = this.props.customCloseDelegate;
              (void 0 === e ? l.a : e).subscribe(this, this._handleGlobalClose),
                window.addEventListener('resize', this._resize);
            }),
            (t.prototype.componentDidUpdate = function () {
              this._handleMeasure();
            }),
            (t.prototype.componentWillUnmount = function () {
              var e = this.props.customCloseDelegate;
              (void 0 === e ? l.a : e).unsubscribe(this, this._handleGlobalClose),
                window.removeEventListener('resize', this._resize),
                null !== this._raf && (cancelAnimationFrame(this._raf), (this._raf = null));
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.children,
                n = e.minWidth,
                o = e.theme,
                s = void 0 === o ? p : o,
                a = e.className,
                l = this.state,
                c = l.appearingMenuHeight,
                h = l.appearingMenuWidth,
                m = l.appearingPosition,
                f = l.isMeasureValid;
              return i.createElement(
                i.Fragment,
                null,
                i.createElement(
                  d.b.Provider,
                  { value: this._manager },
                  i.createElement(
                    'div',
                    {
                      className: r(a, s.menuWrap, !f && s.isMeasuring),
                      style: {
                        height: c,
                        left: m && m.x,
                        minWidth: n,
                        position: 'fixed',
                        top: m && m.y,
                        width: h,
                      },
                      ref: this._handleContainerRef,
                      onScroll: this.props.onScroll,
                      onContextMenu: u.b,
                    },
                    i.createElement(
                      'div',
                      {
                        className: r(s.scrollWrap, !this.props.noMomentumBasedScroll && s.momentumBased),
                        style: { overflowY: void 0 !== c ? 'scroll' : 'auto' },
                        ref: this._handleScrollWrapRef,
                      },
                      i.createElement('div', { className: s.menuBox }, t)
                    )
                  )
                ),
                i.createElement(d.a, { reference: this._handleSlot })
              );
            }),
            t
          );
        })(i.PureComponent));
    },
    RgaO: function (e, t, n) {
      'use strict';
      var o, i, r;
      n.d(t, 'a', function () {
        return r;
      }),
        (o = n('mrSG')),
        (i = n('q1tI')),
        (r = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._scope = null),
              (t._handleScopeRef = function (e) {
                return (t._scope = e);
              }),
              (t._handleOutsideEvent = function (e) {
                void 0 !== t.props.handler &&
                  null !== t._scope &&
                  e.target instanceof Node &&
                  (t._scope.contains(e.target) || t.props.handler(e));
              }),
              t
            );
          }
          return (
            o.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              this.props.click && document.addEventListener('click', this._handleOutsideEvent, !1),
                this.props.mouseDown && document.addEventListener('mousedown', this._handleOutsideEvent, !1),
                this.props.touchEnd && document.addEventListener('touchend', this._handleOutsideEvent, !1),
                this.props.touchStart && document.addEventListener('touchstart', this._handleOutsideEvent, !1);
            }),
            (t.prototype.componentWillUnmount = function () {
              document.removeEventListener('click', this._handleOutsideEvent, !1),
                document.removeEventListener('mousedown', this._handleOutsideEvent, !1),
                document.removeEventListener('touchend', this._handleOutsideEvent, !1),
                document.removeEventListener('touchstart', this._handleOutsideEvent, !1);
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = (e.click, e.handler, e.mouseDown, e.touchEnd, e.touchStart, e.ctor),
                n = void 0 === t ? 'span' : t,
                r = o.__rest(e, ['click', 'handler', 'mouseDown', 'touchEnd', 'touchStart', 'ctor']);
              return i.createElement(n, o.__assign({}, r, { ref: this._handleScopeRef }));
            }),
            t
          );
        })(i.PureComponent));
    },
    jAh7: function (e, t, n) {
      'use strict';
      function o(e) {
        var t, n, o;
        return (
          void 0 === e && (e = document),
          null !== (t = e.getElementById('overlap-manager-root'))
            ? Object(i.ensureDefined)(a.get(t))
            : ((n = new s(e)),
              (o = (function (e) {
                var t = e.createElement('div');
                return (
                  (t.style.position = 'absolute'),
                  (t.style.zIndex = (150).toString()),
                  (t.style.top = '0px'),
                  (t.style.left = '0px'),
                  (t.id = 'overlap-manager-root'),
                  t
                );
              })(e)),
              a.set(o, n),
              n.setContainer(o),
              e.body.appendChild(o),
              n)
        );
      }
      var i, r, s, a;
      n.r(t),
        n.d(t, 'OverlapManager', function () {
          return s;
        }),
        n.d(t, 'getRootOverlapManager', function () {
          return o;
        }),
        (i = n('Eyy1')),
        (r = (function () {
          function e() {
            this._storage = [];
          }
          return (
            (e.prototype.add = function (e) {
              this._storage.push(e);
            }),
            (e.prototype.remove = function (e) {
              this._storage = this._storage.filter(function (t) {
                return e !== t;
              });
            }),
            (e.prototype.has = function (e) {
              return this._storage.includes(e);
            }),
            (e.prototype.getItems = function () {
              return this._storage;
            }),
            e
          );
        })()),
        (s = (function () {
          function e(e) {
            void 0 === e && (e = document),
              (this._storage = new r()),
              (this._windows = new Map()),
              (this._index = 0),
              (this._document = e),
              (this._container = e.createDocumentFragment());
          }
          return (
            (e.prototype.setContainer = function (e) {
              var t = this._container,
                n = null === e ? this._document.createDocumentFragment() : e;
              !(function (e, t) {
                Array.from(e.childNodes).forEach(function (e) {
                  e.nodeType === Node.ELEMENT_NODE && t.appendChild(e);
                });
              })(t, n),
                (this._container = n);
            }),
            (e.prototype.registerWindow = function (e) {
              this._storage.has(e) || this._storage.add(e);
            }),
            (e.prototype.ensureWindow = function (e, t) {
              var n, o;
              return (
                void 0 === t && (t = { position: 'fixed' }),
                void 0 !== (n = this._windows.get(e))
                  ? n
                  : (this.registerWindow(e),
                    ((o = this._document.createElement('div')).style.position = t.position),
                    (o.style.zIndex = this._index.toString()),
                    (o.dataset.id = e),
                    this._container.appendChild(o),
                    this._windows.set(e, o),
                    ++this._index,
                    o)
              );
            }),
            (e.prototype.unregisterWindow = function (e) {
              this._storage.remove(e);
              var t = this._windows.get(e);
              void 0 !== t && (null !== t.parentElement && t.parentElement.removeChild(t), this._windows.delete(e));
            }),
            (e.prototype.getZindex = function (e) {
              var t = this.ensureWindow(e);
              return parseInt(t.style.zIndex || '0');
            }),
            (e.prototype.moveToTop = function (e) {
              this.getZindex(e) !== this._index && (this.ensureWindow(e).style.zIndex = (++this._index).toString());
            }),
            (e.prototype.removeWindow = function (e) {
              this.unregisterWindow(e);
            }),
            e
          );
        })()),
        (a = new WeakMap());
    },
  },
]);

!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t((e.Datafeeds = {}));
})(this, function (e) {
  "use strict";
  var s =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (e, t) {
        e.__proto__ = t;
      }) ||
    function (e, t) {
      for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
    };
  var r = !1;
  function c(e) {
    if (r) {
      var t = new Date();
      console.log(
        t.toLocaleTimeString() + "." + t.getMilliseconds() + "> " + e
      );
    }
  }
  function i(e) {
    return void 0 === e ? "" : "string" == typeof e ? e : e.message;
  }
  var o = (function () {
      function e(e, t) {
        (this._datafeedUrl = e), (this._requester = t);
      }
      return (
        (e.prototype.getBars = function (e, t, r, s) {
          var o = this,
            n = { symbol: e.ticker || "", resolution: t, from: r, to: s };
          return new Promise(function (a, u) {
            o._requester
              .sendRequest(o._datafeedUrl, "/bb/market/history", n)
              .then(function (e) {
                if ("ok" === e.s || "no_data" === e.s) {
                  var t = [],
                    r = { noData: !1 };
                  if ("no_data" === e.s)
                    (r.noData = !0), (r.nextTime = e.nextTime);
                  else
                    for (
                      var s = void 0 !== e.v, o = void 0 !== e.o, n = 0;
                      n < e.t.length;
                      ++n
                    ) {
                      var i = {
                        time: 1e3 * e.t[n],
                        close: Number(e.c[n]),
                        open: Number(e.c[n]),
                        high: Number(e.c[n]),
                        low: Number(e.c[n]),
                      };
                      o &&
                        ((i.open = Number(e.o[n])),
                        (i.high = Number(e.h[n])),
                        (i.low = Number(e.l[n]))),
                        s && (i.volume = Number(e.v[n])),
                        t.push(i);
                    }
                  a({ bars: t, meta: r });
                } else u(e.errmsg);
              })
              .catch(function (e) {
                var t = i(e);
                console.warn("HistoryProvider: getBars() failed, error=" + t),
                  u(t);
              });
          });
        }),
        e
      );
    })(),
    n = (function () {
      function e(e, t) {
        (this._subscribers = {}),
          (this._requestsPending = 0),
          (this._historyProvider = e),
          setInterval(this._updateData.bind(this), t);
      }
      return (
        (e.prototype.subscribeBars = function (e, t, r, s) {
          this._subscribers.hasOwnProperty(s)
            ? c("DataPulseProvider: already has subscriber with id=" + s)
            : ((this._subscribers[s] = {
                lastBarTime: null,
                listener: r,
                resolution: t,
                symbolInfo: e,
              }),
              c(
                "DataPulseProvider: subscribed for #" +
                  s +
                  " - {" +
                  e.name +
                  ", " +
                  t +
                  "}"
              ));
        }),
        (e.prototype.unsubscribeBars = function (e) {
          delete this._subscribers[e],
            c("DataPulseProvider: unsubscribed for #" + e);
        }),
        (e.prototype._updateData = function () {
          var r = this;
          if (!(0 < this._requestsPending)) {
            this._requestsPending = 0;
            var e = function (t) {
                (s._requestsPending += 1),
                  s
                    ._updateDataForSubscriber(t)
                    .then(function () {
                      (r._requestsPending -= 1),
                        c(
                          "DataPulseProvider: data for #" +
                            t +
                            " updated successfully, pending=" +
                            r._requestsPending
                        );
                    })
                    .catch(function (e) {
                      (r._requestsPending -= 1),
                        c(
                          "DataPulseProvider: data for #" +
                            t +
                            " updated with error=" +
                            i(e) +
                            ", pending=" +
                            r._requestsPending
                        );
                    });
              },
              s = this;
            for (var t in this._subscribers) e(t);
          }
        }),
        (e.prototype._updateDataForSubscriber = function (t) {
          var r = this,
            e = this._subscribers[t],
            s = parseInt((Date.now() / 1e3).toString()),
            o =
              s -
              (function (e, t) {
                var r = 0;
                r =
                  "D" === e
                    ? 24 * t * 60
                    : "2D" === e
                    ? 24 * t * 60 * 2
                    : "W" === e
                    ? 7 * t * 24 * 60
                    : t * parseInt(e);
                return 60 * r;
              })(e.resolution, 10);
          return this._historyProvider
            .getBars(e.symbolInfo, e.resolution, o, s)
            .then(function (e) {
              r._onSubscriberDataReceived(t, e);
            });
        }),
        (e.prototype._onSubscriberDataReceived = function (e, t) {
          if (this._subscribers.hasOwnProperty(e)) {
            var r = t.bars;
            if (0 !== r.length) {
              var s = r[r.length - 1],
                o = this._subscribers[e];
              if (!(null !== o.lastBarTime && s.time < o.lastBarTime)) {
                if (null !== o.lastBarTime && s.time > o.lastBarTime) {
                  if (r.length < 2)
                    throw new Error(
                      "Not enough bars in history for proper pulse update. Need at least 2."
                    );
                  var n = r[r.length - 2];
                  o.listener(n);
                }
                (o.lastBarTime = s.time), o.listener(s);
              }
            }
          } else
            c(
              "DataPulseProvider: Data comes for already unsubscribed subscription #" +
                e
            );
        }),
        e
      );
    })();
  var a = (function () {
    function e(e) {
      (this._subscribers = {}),
        (this._requestsPending = 0),
        (this._quotesProvider = e),
        setInterval(this._updateQuotes.bind(this, 1), 1e4),
        setInterval(this._updateQuotes.bind(this, 0), 6e4);
    }
    return (
      (e.prototype.subscribeQuotes = function (e, t, r, s) {
        (this._subscribers[s] = { symbols: e, fastSymbols: t, listener: r }),
          c("QuotesPulseProvider: subscribed quotes with #" + s);
      }),
      (e.prototype.unsubscribeQuotes = function (e) {
        delete this._subscribers[e],
          c("QuotesPulseProvider: unsubscribed quotes with #" + e);
      }),
      (e.prototype._updateQuotes = function (s) {
        var o = this;
        if (!(0 < this._requestsPending)) {
          var e = function (t) {
              n._requestsPending++;
              var r = n._subscribers[t];
              n._quotesProvider
                .getQuotes(1 === s ? r.fastSymbols : r.symbols)
                .then(function (e) {
                  o._requestsPending--,
                    o._subscribers.hasOwnProperty(t) &&
                      (r.listener(e),
                      c(
                        "QuotesPulseProvider: data for #" +
                          t +
                          " (" +
                          s +
                          ") updated successfully, pending=" +
                          o._requestsPending
                      ));
                })
                .catch(function (e) {
                  o._requestsPending--,
                    c(
                      "QuotesPulseProvider: data for #" +
                        t +
                        " (" +
                        s +
                        ") updated with error=" +
                        i(e) +
                        ", pending=" +
                        o._requestsPending
                    );
                });
            },
            n = this;
          for (var t in this._subscribers) e(t);
        }
      }),
      e
    );
  })();
  function d(e, t, r) {
    var s = e[t];
    return Array.isArray(s) ? s[r] : s;
  }
  var t = (function () {
    function e(e, t, r) {
      (this._exchangesList = ["g"]),
        (this._symbolsInfo = {}),
        (this._symbolsList = []),
        (this._datafeedUrl = e),
        (this._datafeedSupportedResolutions = t),
        (this._requester = r),
        (this._readyPromise = this._init()),
        this._readyPromise.catch(function (e) {
          console.error("SymbolsStorage: Cannot init, error=" + e.toString());
        });
    }
    return (
      (e.prototype.resolveSymbol = function (t) {
        var r = this;
        return (
          alert("SymbolsStorage not ready"),
          this._readyPromise.then(function () {
            var e = r._symbolsInfo[t];
            return void 0 === e
              ? Promise.reject("invalid symbol")
              : Promise.resolve(e);
          })
        );
      }),
      (e.prototype.searchSymbols = function (a, u, c, o) {
        var l = this;
        return (
          alert("SymbolsStorage not ready"),
          this._readyPromise.then(function () {
            var n = [],
              i = 0 === a.length;
            a = a.toUpperCase();
            for (
              var e = function (e) {
                  var t = l._symbolsInfo[e];
                  if (void 0 === t) return "continue";
                  if (0 < c.length && t.type !== c) return "continue";
                  if (u && 0 < u.length && t.exchange !== u) return "continue";
                  var r = t.name.toUpperCase().indexOf(a),
                    s = t.description.toUpperCase().indexOf(a);
                  if (
                    (i || 0 <= r || 0 <= s) &&
                    !n.some(function (e) {
                      return e.symbolInfo === t;
                    })
                  ) {
                    var o = 0 <= r ? r : 8e3 + s;
                    n.push({ symbolInfo: t, weight: o });
                  }
                },
                t = 0,
                r = l._symbolsList;
              t < r.length;
              t++
            ) {
              e(r[t]);
            }
            var s = n
              .sort(function (e, t) {
                return e.weight - t.weight;
              })
              .slice(0, o)
              .map(function (e) {
                var t = e.symbolInfo;
                return {
                  symbol: t.name,
                  full_name: t.full_name,
                  description: t.description,
                  exchange: t.exchange,
                  params: [],
                  type: t.type,
                  ticker: t.name,
                };
              });
            return Promise.resolve(s);
          })
        );
      }),
      (e.prototype._init = function () {
        for (
          var e = this, t = [], r = {}, s = 0, o = this._exchangesList;
          s < o.length;
          s++
        ) {
          var n = o[s];
          r[n] || ((r[n] = !0), t.push(this._requestExchangeData(n)));
        }
        return Promise.all(t).then(function () {
          e._symbolsList.sort(), c("SymbolsStorage: All exchanges data loaded");
        });
      }),
      (e.prototype._requestExchangeData = function (s) {
        var o = this;
        return new Promise(function (t, r) {
          o._requester
            .sendRequest(o._datafeedUrl, "symbol_info", { group: s })
            .then(function (e) {
              try {
                o._onExchangeDataReceived(s, e);
              } catch (e) {
                return void r(e);
              }
              t();
            })
            .catch(function (e) {
              c(
                "SymbolsStorage: Request data for exchange '" +
                  s +
                  "' failed, reason=" +
                  i(e)
              ),
                t();
            });
        });
      }),
      (e.prototype._onExchangeDataReceived = function (t, r) {
        var e = this,
          s = 0;
        try {
          for (var o = r.symbol.length, n = void 0 !== r.ticker; s < o; ++s) {
            var i = r.symbol[s],
              a = d(r, "exchange-listed", s),
              u = d(r, "exchange-traded", s),
              c = u + ":" + i,
              l = n ? d(r, "ticker", s) : i,
              h = {
                ticker: l,
                name: i,
                base_name: [a + ":" + i],
                full_name: c,
                listed_exchange: a,
                exchange: u,
                description: d(r, "description", s),
                has_intraday: p(d(r, "has-intraday", s), !1),
                has_no_volume: p(d(r, "has-no-volume", s), !1),
                minmov: d(r, "minmovement", s) || d(r, "minmov", s) || 0,
                minmove2: d(r, "minmove2", s) || d(r, "minmov2", s),
                fractional: d(r, "fractional", s),
                pricescale: d(r, "pricescale", s),
                type: d(r, "type", s),
                session: d(r, "session-regular", s),
                timezone: d(r, "timezone", s),
                supported_resolutions: p(
                  d(r, "supported-resolutions", s),
                  e._datafeedSupportedResolutions
                ),
                force_session_rebuild: d(r, "force-session-rebuild", s),
                has_daily: p(d(r, "has-daily", s), !0),
                intraday_multipliers: p(d(r, "intraday-multipliers", s), [
                  "1",
                  "5",
                  "15",
                  "30",
                  "60",
                ]),
                has_weekly_and_monthly: d(r, "has-weekly-and-monthly", s),
                has_empty_bars: d(r, "has-empty-bars", s),
                volume_precision: p(d(r, "volume-precision", s), 0),
              };
            (e._symbolsInfo[l] = h),
              (e._symbolsInfo[i] = h),
              (e._symbolsInfo[c] = h),
              e._symbolsList.push(i);
          }
        } catch (e) {
          throw new Error(
            "SymbolsStorage: API error when processing exchange " +
              t +
              " symbol #" +
              s +
              " (" +
              r.symbol[s] +
              "): " +
              e.message
          );
        }
      }),
      e
    );
  })();
  function p(e, t) {
    return void 0 !== e ? e : t;
  }
  var u = (function () {
    function e(e, t, r, s) {
      void 0 === s && (s = 1e4),
        (this._configuration = {
          supports_search: !0,
          supports_group_request: !1,
          supports_marks: !0,
          supports_timescale_marks: !0,
          supports_time: !0,
          exchanges: [
            { value: "", name: "All Exchanges", desc: "" },
            { value: "g", name: "g", desc: "g" },
          ],
          symbols_types: [
            { name: "All types", value: "" },
            { name: "Stock", value: "stock" },
            { name: "Index", value: "index" },
          ],
          supported_resolutions: [
            "1",
            "5",
            "15",
            "30",
            "60",
            "120",
            "240",
            "360",
            "720",
            "D",
            "2D",
            "W",
          ],
        }),
        (this._symbolsStorage = null),
        (this._datafeedURL = e),
        (this._requester = r),
        (this._historyProvider = new o(e, this._requester)),
        (this._quotesProvider = t),
        (this._dataPulseProvider = new n(this._historyProvider, s)),
        (this._quotesPulseProvider = new a(this._quotesProvider)),
        (this._configurationReadyPromise = new Promise(function (e, t) {
          e(null);
        }));
    }
    return (
      (e.prototype.onReady = function (e) {
        var t = this;
        this._configurationReadyPromise.then(function () {
          e(t._configuration);
        });
      }),
      (e.prototype.getQuotes = function (e, t, r) {
        this._quotesProvider.getQuotes(e).then(t).catch(r);
      }),
      (e.prototype.subscribeQuotes = function (e, t, r, s) {
        this._quotesPulseProvider.subscribeQuotes(e, t, r, s);
      }),
      (e.prototype.unsubscribeQuotes = function (e) {
        this._quotesPulseProvider.unsubscribeQuotes(e);
      }),
      (e.prototype.calculateHistoryDepth = function (e, t, r) {}),
      (e.prototype.getMarks = function (e, t, r, s, o) {
        this._configuration.supports_marks &&
          setTimeout(function () {
            s([]);
          }, 0);
      }),
      (e.prototype.getTimescaleMarks = function (e, t, r, s, o) {
        this._configuration.supports_timescale_marks &&
          setTimeout(function () {
            s([]);
          }, 0);
      }),
      (e.prototype.getServerTime = function (r) {
        this._configuration.supports_time &&
          this._send("time")
            .then(function (e) {
              var t = parseInt(e);
              isNaN(t) || r(t);
            })
            .catch(function (e) {
              c(
                "UdfCompatibleDatafeed: Fail to load server time, error=" + i(e)
              );
            });
      }),
      (e.prototype.searchSymbols = function (e, t, r, s) {
        if (this._configuration.supports_search) {
          e.toUpperCase();
          alert("searchSymbols"),
            setTimeout(function () {
              s([]);
            }, 0);
        } else {
          if ((alert("searchSymbols"), null === this._symbolsStorage))
            throw new Error(
              "UdfCompatibleDatafeed: inconsistent configuration (symbols storage)"
            );
          this._symbolsStorage
            .searchSymbols(e, t, r, 30)
            .then(s)
            .catch(s.bind(null, []));
        }
      }),
      (e.prototype.resolveSymbol = function (e, t, r) {
        c("Resolve requested");
        var s = Date.now();
        var o = window.glGetSymbolPrisision,
          n = 8;
        if (o) {
          var i = e;
          0 <= i.indexOf(":") && (i = i.substring(i.indexOf(":") + 1)),
            (n = o(i)) || (n = 8);
        }
        var a = {
            name: e,
            description: e.replace("_", "/"),
            exchange: "",
            type: "bitcoin",
            prisision: n,
          },
          u = {
            name: a.name,
            "exchange-traded": a.exchange,
            "exchange-listed": a.exchange,
            timezone: "America/New_York",
            minmov: 1,
            minmov2: 0,
            pointvalue: 1,
            session: "24x7",
            has_intraday: !0,
            has_empty_bars: !0,
            has_no_volume: !1,
            description: 0 < a.description.length ? a.description : a.name,
            type: a.type,
            supported_resolutions: [
              "1",
              "5",
              "15",
              "30",
              "60",
              "120",
              "240",
              "360",
              "720",
              "D",
              "2D",
              "W",
            ],
            pricescale: Math.pow(10, a.prisision),
            ticker: a.name.toUpperCase(),
          };
        setTimeout(function () {
          var e;
          (e = u), c("Symbol resolved: " + (Date.now() - s) + "ms"), t(e);
        }, 0);
      }),
      (e.prototype.getBars = function (e, t, r, s, o, n) {
        this._historyProvider
          .getBars(e, t, r, s)
          .then(function (e) {
            o(e.bars, e.meta);
          })
          .catch(n);
      }),
      (e.prototype.subscribeBars = function (e, t, r, s, o) {
        this._dataPulseProvider.subscribeBars(e, t, r, s);
      }),
      (e.prototype.unsubscribeBars = function (e) {
        this._dataPulseProvider.unsubscribeBars(e);
      }),
      (e.prototype._requestConfiguration = function () {
        return this._send("config").catch(function (e) {
          return (
            c(
              "UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=" +
                i(e)
            ),
            null
          );
        });
      }),
      (e.prototype._send = function (e, t) {
        return this._requester.sendRequest(this._datafeedURL, e, t);
      }),
      (e.prototype._setupWithConfiguration = function (e) {
        if (
          (void 0 === (this._configuration = e).exchanges && (e.exchanges = []),
          !e.supports_search && !e.supports_group_request)
        )
          throw new Error(
            "Unsupported datafeed configuration. Must either support search, or support group request"
          );
        (!e.supports_group_request && e.supports_search) ||
          (this._symbolsStorage = new t(
            this._datafeedURL,
            e.supported_resolutions || [],
            this._requester
          )),
          c("UdfCompatibleDatafeed: Initialized with " + JSON.stringify(e));
      }),
      e
    );
  })();
  var l = (function () {
      function e(e, t) {
        (this._datafeedUrl = e), (this._requester = t);
      }
      return (
        (e.prototype.getQuotes = function (e) {
          return new Promise(function (e, t) {
            setTimeout(function () {
              e([]);
            }, 0);
          });
        }),
        e
      );
    })(),
    h = (function () {
      function e(e) {
        e && (this._headers = e);
      }
      return (
        (e.prototype.sendRequest = function (e, t, r) {
          if (void 0 !== r) {
            var s = Object.keys(r);
            0 !== s.length && (t += "?"),
              (t += s
                .map(function (e) {
                  return (
                    encodeURIComponent(e) +
                    "=" +
                    encodeURIComponent(r[e].toString())
                  );
                })
                .join("&"));
          }
          c("New request: " + t);
          var o = { credentials: "same-origin" };
          return (
            void 0 !== this._headers && (o.headers = this._headers),
            fetch(e + "/" + t, o)
              .then(function (e) {
                return e.text();
              })
              .then(function (e) {
                return JSON.parse(e);
              })
          );
        }),
        e
      );
    })(),
    f = (function (o) {
      function e(e, t) {
        void 0 === t && (t = 5e3);
        var r = new h(),
          s = new l(e, r);
        return o.call(this, e, s, r, t) || this;
      }
      return (
        (function (e, t) {
          function r() {
            this.constructor = e;
          }
          s(e, t),
            (e.prototype =
              null === t
                ? Object.create(t)
                : ((r.prototype = t.prototype), new r()));
        })(e, o),
        e
      );
    })(u);
  (e.UDFCompatibleDatafeed = f),
    Object.defineProperty(e, "__esModule", { value: !0 });
});

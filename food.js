! function (undefined) {
    function getMutationObserver() {
        return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    }

    function addEventListener(el, evt, func) {
        el.addEventListener(evt, func, !1)
    }

    function removeEventListener(el, evt, func) {
        el.removeEventListener(evt, func, !1)
    }

    function setupRequestAnimationFrame() {
        var x, vendors = ["moz", "webkit", "o", "ms"];
        for (x = 0; x < vendors.length && !requestAnimationFrame; x += 1) requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        requestAnimationFrame ? requestAnimationFrame = requestAnimationFrame.bind(window) : log("setup", "RequestAnimationFrame not supported")
    }

    function getMyID(iframeId) {
        var retStr = "Host page: " + iframeId;
        return window.top !== window.self && (retStr = window.parentIFrame && window.parentIFrame.getId ? window.parentIFrame.getId() + ": " + iframeId : "Nested host page: " + iframeId), retStr
    }

    function formatLogHeader(iframeId) {
        return msgId + "[" + getMyID(iframeId) + "]"
    }

    function isLogEnabled(iframeId) {
        return settings[iframeId] ? settings[iframeId].log : logEnabled
    }

    function log(iframeId, msg) {
        output("log", iframeId, msg, isLogEnabled(iframeId))
    }

    function info(iframeId, msg) {
        output("info", iframeId, msg, isLogEnabled(iframeId))
    }

    function warn(iframeId, msg) {
        output("warn", iframeId, msg, !0)
    }

    function output(type, iframeId, msg, enabled) {
        !0 === enabled && "object" == typeof window.console && console[type](formatLogHeader(iframeId), msg)
    }

    function iFrameListener(event) {
        function resizeIFrame() {
            function resize() {
                setSize(messageData), setPagePosition(iframeId), on("onResized", messageData)
            }
            ensureInRange("Height"), ensureInRange("Width"), syncResize(resize, messageData, "init")
        }

        function processMsg() {
            var data = msg.substr(msgIdLen).split(":"),
                height = data[1] ? parseInt(data[1], 10) : 0,
                iframe = settings[data[0]] && settings[data[0]].iframe,
                compStyle = getComputedStyle(iframe);
            return {
                iframe: iframe,
                id: data[0],
                height: height + getPaddingEnds(compStyle) + getBorderEnds(compStyle),
                width: data[2],
                type: data[3]
            }
        }

        function getPaddingEnds(compStyle) {
            return "border-box" !== compStyle.boxSizing ? 0 : (compStyle.paddingTop ? parseInt(compStyle.paddingTop, 10) : 0) + (compStyle.paddingBottom ? parseInt(compStyle.paddingBottom, 10) : 0)
        }

        function getBorderEnds(compStyle) {
            return "border-box" !== compStyle.boxSizing ? 0 : (compStyle.borderTopWidth ? parseInt(compStyle.borderTopWidth, 10) : 0) + (compStyle.borderBottomWidth ? parseInt(compStyle.borderBottomWidth, 10) : 0)
        }

        function ensureInRange(Dimension) {
            var max = Number(settings[iframeId]["max" + Dimension]),
                min = Number(settings[iframeId]["min" + Dimension]),
                dimension = Dimension.toLowerCase(),
                size = Number(messageData[dimension]);
            log(iframeId, "Checking " + dimension + " is in range " + min + "-" + max), size < min && (size = min, log(iframeId, "Set " + dimension + " to min value")), size > max && (size = max, log(iframeId, "Set " + dimension + " to max value")), messageData[dimension] = "" + size
        }

        function isMessageFromIFrame() {
            function checkAllowedOrigin() {
                function checkList() {
                    var i = 0,
                        retCode = !1;
                    for (log(iframeId, "Checking connection is from allowed list of origins: " + checkOrigin); i < checkOrigin.length; i++)
                        if (checkOrigin[i] === origin) {
                            retCode = !0;
                            break
                        } return retCode
                }

                function checkSingle() {
                    var remoteHost = settings[iframeId] && settings[iframeId].remoteHost;
                    return log(iframeId, "Checking connection is from: " + remoteHost), origin === remoteHost
                }
                return checkOrigin.constructor === Array ? checkList() : checkSingle()
            }
            var origin = event.origin,
                checkOrigin = settings[iframeId] && settings[iframeId].checkOrigin;
            if (checkOrigin && "" + origin != "null" && !checkAllowedOrigin()) throw new Error("Unexpected message received from: " + origin + " for " + messageData.iframe.id + ". Message was: " + event.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
            return !0
        }

        function isMessageForUs() {
            return msgId === ("" + msg).substr(0, msgIdLen) && msg.substr(msgIdLen).split(":")[0] in settings
        }

        function isMessageFromMetaParent() {
            var retCode = messageData.type in {
                true: 1,
                false: 1,
                undefined: 1
            };
            return retCode && log(iframeId, "Ignoring init message from meta parent page"), retCode
        }

        function getMsgBody(offset) {
            return msg.substr(msg.indexOf(":") + msgHeaderLen + offset)
        }

        function forwardMsgFromIFrame(msgBody) {
            log(iframeId, "onMessage passed: {iframe: " + messageData.iframe.id + ", message: " + msgBody + "}"), on("onMessage", {
                iframe: messageData.iframe,
                message: JSON.parse(msgBody)
            }), log(iframeId, "--")
        }

        function getPageInfo() {
            var bodyPosition = document.body.getBoundingClientRect(),
                iFramePosition = messageData.iframe.getBoundingClientRect();
            return JSON.stringify({
                iframeHeight: iFramePosition.height,
                iframeWidth: iFramePosition.width,
                clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                offsetTop: parseInt(iFramePosition.top - bodyPosition.top, 10),
                offsetLeft: parseInt(iFramePosition.left - bodyPosition.left, 10),
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset,
                documentHeight: document.documentElement.clientHeight,
                documentWidth: document.documentElement.clientWidth,
                windowHeight: window.innerHeight,
                windowWidth: window.innerWidth
            })
        }

        function sendPageInfoToIframe(iframe, iframeId) {
            function debouncedTrigger() {
                trigger("Send Page Info", "pageInfo:" + getPageInfo(), iframe, iframeId)
            }
            debounceFrameEvents(debouncedTrigger, 32, iframeId)
        }

        function startPageInfoMonitor() {
            function setListener(type, func) {
                function sendPageInfo() {
                    settings[id] ? sendPageInfoToIframe(settings[id].iframe, id) : stop()
                } ["scroll", "resize"].forEach(function (evt) {
                    log(id, type + evt + " listener for sendPageInfo"), func(window, evt, sendPageInfo)
                })
            }

            function stop() {
                setListener("Remove ", removeEventListener)
            }

            function start() {
                setListener("Add ", addEventListener)
            }
            var id = iframeId;
            start(), settings[id] && (settings[id].stopPageInfo = stop)
        }

        function stopPageInfoMonitor() {
            settings[iframeId] && settings[iframeId].stopPageInfo && (settings[iframeId].stopPageInfo(), delete settings[iframeId].stopPageInfo)
        }

        function checkIFrameExists() {
            var retBool = !0;
            return null === messageData.iframe && (warn(iframeId, "IFrame (" + messageData.id + ") not found"), retBool = !1), retBool
        }

        function getElementPosition(target) {
            var iFramePosition = target.getBoundingClientRect();
            return getPagePosition(iframeId), {
                x: Math.floor(Number(iFramePosition.left) + Number(pagePosition.x)),
                y: Math.floor(Number(iFramePosition.top) + Number(pagePosition.y))
            }
        }

        function scrollRequestFromChild(addOffset) {
            function reposition() {
                pagePosition = newPosition, scrollTo(), log(iframeId, "--")
            }

            function calcOffset() {
                return {
                    x: Number(messageData.width) + offset.x,
                    y: Number(messageData.height) + offset.y
                }
            }

            function scrollParent() {
                window.parentIFrame ? window.parentIFrame["scrollTo" + (addOffset ? "Offset" : "")](newPosition.x, newPosition.y) : warn(iframeId, "Unable to scroll to requested position, window.parentIFrame not found")
            }
            var offset = addOffset ? getElementPosition(messageData.iframe) : {
                    x: 0,
                    y: 0
                },
                newPosition = calcOffset();
            log(iframeId, "Reposition requested from iFrame (offset x:" + offset.x + " y:" + offset.y + ")"), window.top !== window.self ? scrollParent() : reposition()
        }

        function scrollTo() {
            !1 !== on("onScroll", pagePosition) ? setPagePosition(iframeId) : unsetPagePosition()
        }

        function findTarget(location) {
            function jumpToTarget() {
                var jumpPosition = getElementPosition(target);
                log(iframeId, "Moving to in page link (#" + hash + ") at x: " + jumpPosition.x + " y: " + jumpPosition.y), pagePosition = {
                    x: jumpPosition.x,
                    y: jumpPosition.y
                }, scrollTo(), log(iframeId, "--")
            }

            function jumpToParent() {
                window.parentIFrame ? window.parentIFrame.moveToAnchor(hash) : log(iframeId, "In page link #" + hash + " not found and window.parentIFrame not found")
            }
            var hash = location.split("#")[1] || "",
                hashData = decodeURIComponent(hash),
                target = document.getElementById(hashData) || document.getElementsByName(hashData)[0];
            target ? jumpToTarget() : window.top !== window.self ? jumpToParent() : log(iframeId, "In page link #" + hash + " not found")
        }

        function onMouse(event) {
            var mousePos = {};
            if (0 === Number(messageData.width) && 0 === Number(messageData.height)) {
                var data = getMsgBody(9).split(":");
                mousePos = {
                    x: data[1],
                    y: data[0]
                }
            } else mousePos = {
                x: messageData.width,
                y: messageData.height
            };
            on(event, {
                iframe: messageData.iframe,
                screenX: Number(mousePos.x),
                screenY: Number(mousePos.y),
                type: messageData.type
            })
        }

        function on(funcName, val) {
            return chkEvent(iframeId, funcName, val)
        }

        function actionMsg() {
            switch (settings[iframeId] && settings[iframeId].firstRun && firstRun(), messageData.type) {
                case "close":
                    closeIFrame(messageData.iframe);
                    break;
                case "message":
                    forwardMsgFromIFrame(getMsgBody(6));
                    break;
                case "mouseenter":
                    onMouse("onMouseEnter");
                    break;
                case "mouseleave":
                    onMouse("onMouseLeave");
                    break;
                case "autoResize":
                    settings[iframeId].autoResize = JSON.parse(getMsgBody(9));
                    break;
                case "scrollTo":
                    scrollRequestFromChild(!1);
                    break;
                case "scrollToOffset":
                    scrollRequestFromChild(!0);
                    break;
                case "pageInfo":
                    sendPageInfoToIframe(settings[iframeId] && settings[iframeId].iframe, iframeId), startPageInfoMonitor();
                    break;
                case "pageInfoStop":
                    stopPageInfoMonitor();
                    break;
                case "inPageLink":
                    findTarget(getMsgBody(9));
                    break;
                case "reset":
                    resetIFrame(messageData);
                    break;
                case "init":
                    resizeIFrame(), on("onInit", messageData.iframe);
                    break;
                default:
                    0 === Number(messageData.width) && 0 === Number(messageData.height) ? warn("Unsupported message received (" + messageData.type + "), this is likely due to the iframe containing a later version of iframe-resizer than the parent page") : resizeIFrame()
            }
        }

        function hasSettings(iframeId) {
            var retBool = !0;
            return settings[iframeId] || (retBool = !1, warn(messageData.type + " No settings for " + iframeId + ". Message was: " + msg)), retBool
        }

        function iFrameReadyMsgReceived() {
            for (var iframeId in settings) trigger("iFrame requested init", createOutgoingMsg(iframeId), settings[iframeId].iframe, iframeId)
        }

        function firstRun() {
            settings[iframeId] && (settings[iframeId].firstRun = !1)
        }
        var msg = event.data,
            messageData = {},
            iframeId = null;
        "[iFrameResizerChild]Ready" === msg ? iFrameReadyMsgReceived() : isMessageForUs() ? (messageData = processMsg(), iframeId = messageData.id, settings[iframeId] && (settings[iframeId].loaded = !0), !isMessageFromMetaParent() && hasSettings(iframeId) && (log(iframeId, "Received: " + msg), checkIFrameExists() && isMessageFromIFrame() && actionMsg())) : info(iframeId, "Ignored: " + msg)
    }

    function chkEvent(iframeId, funcName, val) {
        var func = null,
            retVal = null;
        if (settings[iframeId]) {
            if ("function" != typeof (func = settings[iframeId][funcName])) throw new TypeError(funcName + " on iFrame[" + iframeId + "] is not a function");
            retVal = func(val)
        }
        return retVal
    }

    function removeIframeListeners(iframe) {
        var iframeId = iframe.id;
        delete settings[iframeId]
    }

    function closeIFrame(iframe) {
        var iframeId = iframe.id;
        if (chkEvent(iframeId, "onClose", iframeId) === !1) return void log(iframeId, "Close iframe cancelled by onClose event");
        log(iframeId, "Removing iFrame: " + iframeId);
        try {
            iframe.parentNode && iframe.parentNode.removeChild(iframe)
        } catch (error) {
            warn(error)
        }
        chkEvent(iframeId, "onClosed", iframeId), log(iframeId, "--"), removeIframeListeners(iframe)
    }

    function getPagePosition(iframeId) {
        null === pagePosition && (pagePosition = {
            x: window.pageXOffset !== undefined ? window.pageXOffset : document.documentElement.scrollLeft,
            y: window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop
        }, log(iframeId, "Get page position: " + pagePosition.x + "," + pagePosition.y))
    }

    function setPagePosition(iframeId) {
        null !== pagePosition && (window.scrollTo(pagePosition.x, pagePosition.y), log(iframeId, "Set page position: " + pagePosition.x + "," + pagePosition.y), unsetPagePosition())
    }

    function unsetPagePosition() {
        pagePosition = null
    }

    function resetIFrame(messageData) {
        function reset() {
            setSize(messageData), trigger("reset", "reset", messageData.iframe, messageData.id)
        }
        log(messageData.id, "Size reset requested by " + ("init" === messageData.type ? "host page" : "iFrame")), getPagePosition(messageData.id), syncResize(reset, messageData, "reset")
    }

    function setSize(messageData) {
        function setDimension(dimension) {
            if (!messageData.id) return void log("undefined", "messageData id not set");
            messageData.iframe.style[dimension] = messageData[dimension] + "px", log(messageData.id, "IFrame (" + iframeId + ") " + dimension + " set to " + messageData[dimension] + "px")
        }

        function chkZero(dimension) {
            hiddenCheckEnabled || "0" !== messageData[dimension] || (hiddenCheckEnabled = !0, log(iframeId, "Hidden iFrame detected, creating visibility listener"), fixHiddenIFrames())
        }

        function processDimension(dimension) {
            setDimension(dimension), chkZero(dimension)
        }
        var iframeId = messageData.iframe.id;
        settings[iframeId] && (settings[iframeId].sizeHeight && processDimension("height"), settings[iframeId].sizeWidth && processDimension("width"))
    }

    function syncResize(func, messageData, doNotSync) {
        doNotSync !== messageData.type && requestAnimationFrame && !window.jasmine ? (log(messageData.id, "Requesting animation frame"), requestAnimationFrame(func)) : func()
    }

    function trigger(calleeMsg, msg, iframe, id, noResponseWarning) {
        function postMessageToIFrame() {
            var target = settings[id] && settings[id].targetOrigin;
            log(id, "[" + calleeMsg + "] Sending msg to iframe[" + id + "] (" + msg + ") targetOrigin: " + target), iframe.contentWindow.postMessage(msgId + msg, target)
        }

        function iFrameNotFound() {
            warn(id, "[" + calleeMsg + "] IFrame(" + id + ") not found")
        }

        function chkAndSend() {
            iframe && "contentWindow" in iframe && null !== iframe.contentWindow ? postMessageToIFrame() : iFrameNotFound()
        }

        function warnOnNoResponse() {
            function warning() {
                !settings[id] || settings[id].loaded || errorShown || (errorShown = !0, warn(id, "IFrame has not responded within " + settings[id].warningTimeout / 1e3 + " seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning."))
            }
            noResponseWarning && settings[id] && settings[id].warningTimeout && (settings[id].msgTimeout = setTimeout(warning, settings[id].warningTimeout))
        }
        var errorShown = !1;
        id = id || iframe.id, settings[id] && (chkAndSend(), warnOnNoResponse())
    }

    function createOutgoingDocumentMsg() {
        return document.body.clientHeight + ":" + document.body.clientWidth
    }

    function createOutgoingMsg(iframeId) {
        return iframeId + ":" + settings[iframeId].bodyMarginV1 + ":" + settings[iframeId].sizeWidth + ":" + settings[iframeId].log + ":" + settings[iframeId].interval + ":" + settings[iframeId].enablePublicMethods + ":" + settings[iframeId].autoResize + ":" + settings[iframeId].bodyMargin + ":" + settings[iframeId].heightCalculationMethod + ":" + settings[iframeId].bodyBackground + ":" + settings[iframeId].bodyPadding + ":" + settings[iframeId].tolerance + ":" + settings[iframeId].inPageLinks + ":" + settings[iframeId].resizeFrom + ":" + settings[iframeId].widthCalculationMethod + ":" + settings[iframeId].mouseEvents + ":" + createOutgoingDocumentMsg()
    }

    function setupIFrame(iframe, options) {
        function setLimits() {
            function addStyle(style) {
                1 / 0 !== settings[iframeId][style] && 0 !== settings[iframeId][style] && (iframe.style[style] = settings[iframeId][style] + "px", log(iframeId, "Set " + style + " = " + settings[iframeId][style] + "px"))
            }

            function chkMinMax(dimension) {
                if (settings[iframeId]["min" + dimension] > settings[iframeId]["max" + dimension]) throw new Error("Value for min" + dimension + " can not be greater than max" + dimension)
            }
            chkMinMax("Height"), chkMinMax("Width"), addStyle("maxHeight"), addStyle("minHeight"), addStyle("maxWidth"), addStyle("minWidth")
        }

        function newId() {
            var id = options && options.id || defaults.id + count++;
            return null !== document.getElementById(id) && (id += count++), id
        }

        function ensureHasId(iframeId) {
            return "" === iframeId && (iframe.id = iframeId = newId(), logEnabled = (options || {}).log, log(iframeId, "Added missing iframe ID: " + iframeId + " (" + iframe.src + ")")), iframeId
        }

        function setScrolling() {
            switch (log(iframeId, "IFrame scrolling " + (settings[iframeId] && settings[iframeId].scrolling ? "enabled" : "disabled") + " for " + iframeId), iframe.style.overflow = !1 === (settings[iframeId] && settings[iframeId].scrolling) ? "hidden" : "auto", settings[iframeId] && settings[iframeId].scrolling) {
                case "omit":
                    break;
                case !0:
                    iframe.scrolling = "yes";
                    break;
                case !1:
                    iframe.scrolling = "no";
                    break;
                default:
                    iframe.scrolling = settings[iframeId] ? settings[iframeId].scrolling : "no"
            }
        }

        function setupBodyMarginValues() {
            "number" != typeof (settings[iframeId] && settings[iframeId].bodyMargin) && "0" !== (settings[iframeId] && settings[iframeId].bodyMargin) || (settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin, settings[iframeId].bodyMargin = settings[iframeId].bodyMargin + "px")
        }

        function checkReset() {
            var firstRun = settings[iframeId] && settings[iframeId].firstRun,
                resetRequertMethod = settings[iframeId] && settings[iframeId].heightCalculationMethod in resetRequiredMethods;
            !firstRun && resetRequertMethod && resetIFrame({
                iframe: iframe,
                height: 0,
                width: 0,
                type: "init"
            })
        }

        function setupIFrameObject() {
            settings[iframeId] && (settings[iframeId].iframe.iFrameResizer = {
                close: closeIFrame.bind(null, settings[iframeId].iframe),
                removeListeners: removeIframeListeners.bind(null, settings[iframeId].iframe),
                resize: trigger.bind(null, "Window resize", "resize", settings[iframeId].iframe),
                moveToAnchor: function (anchor) {
                    trigger("Move to anchor", "moveToAnchor:" + anchor, settings[iframeId].iframe, iframeId)
                },
                sendMessage: function (message) {
                    message = JSON.stringify(message), trigger("Send Message", "message:" + message, settings[iframeId].iframe, iframeId)
                }
            })
        }

        function init(msg) {
            function iFrameLoaded() {
                trigger("iFrame.onload", msg, iframe, undefined, !0), checkReset()
            }

            function createDestroyObserver(MutationObserver) {
                if (iframe.parentNode) {
                    new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            Array.prototype.slice.call(mutation.removedNodes).forEach(function (removedNode) {
                                removedNode === iframe && closeIFrame(iframe)
                            })
                        })
                    }).observe(iframe.parentNode, {
                        childList: !0
                    })
                }
            }
            var MutationObserver = getMutationObserver();
            MutationObserver && createDestroyObserver(MutationObserver), addEventListener(iframe, "load", iFrameLoaded), trigger("init", msg, iframe, undefined, !0)
        }

        function checkOptions(options) {
            if ("object" != typeof options) throw new TypeError("Options is not an object")
        }

        function copyOptions(options) {
            for (var option in defaults) Object.prototype.hasOwnProperty.call(defaults, option) && (settings[iframeId][option] = Object.prototype.hasOwnProperty.call(options, option) ? options[option] : defaults[option])
        }

        function getTargetOrigin(remoteHost) {
            return "" === remoteHost || null !== remoteHost.match(/^(about:blank|javascript:|file:\/\/)/) ? "*" : remoteHost
        }

        function depricate(key) {
            var splitName = key.split("Callback");
            if (2 === splitName.length) {
                var name = "on" + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
                this[name] = this[key], delete this[key], warn(iframeId, "Deprecated: '" + key + "' has been renamed '" + name + "'. The old method will be removed in the next major version.")
            }
        }

        function processOptions(options) {
            options = options || {}, settings[iframeId] = {
                firstRun: !0,
                iframe: iframe,
                remoteHost: iframe.src && iframe.src.split("/").slice(0, 3).join("/")
            }, checkOptions(options), Object.keys(options).forEach(depricate, options), copyOptions(options), settings[iframeId] && (settings[iframeId].targetOrigin = !0 === settings[iframeId].checkOrigin ? getTargetOrigin(settings[iframeId].remoteHost) : "*")
        }

        function beenHere() {
            return iframeId in settings && "iFrameResizer" in iframe
        }
        var iframeId = ensureHasId(iframe.id);
        beenHere() ? warn(iframeId, "Ignored iFrame, already setup.") : (processOptions(options), setScrolling(), setLimits(), setupBodyMarginValues(), init(createOutgoingMsg(iframeId)), setupIFrameObject())
    }

    function debouce(fn, time) {
        null === timer && (timer = setTimeout(function () {
            timer = null, fn()
        }, time))
    }

    function debounceFrameEvents(fn, time, frameId) {
        frameTimer[frameId] || (frameTimer[frameId] = setTimeout(function () {
            frameTimer[frameId] = null, fn()
        }, time))
    }

    function fixHiddenIFrames() {
        function checkIFrames() {
            function checkIFrame(settingId) {
                function chkDimension(dimension) {
                    return "0px" === (settings[settingId] && settings[settingId].iframe.style[dimension])
                }

                function isVisible(el) {
                    return null !== el.offsetParent
                }
                settings[settingId] && isVisible(settings[settingId].iframe) && (chkDimension("height") || chkDimension("width")) && trigger("Visibility change", "resize", settings[settingId].iframe, settingId)
            }
            Object.keys(settings).forEach(function (key) {
                checkIFrame(key)
            })
        }

        function mutationObserved(mutations) {
            log("window", "Mutation observed: " + mutations[0].target + " " + mutations[0].type), debouce(checkIFrames, 16)
        }

        function createMutationObserver() {
            var target = document.querySelector("body"),
                config = {
                    attributes: !0,
                    attributeOldValue: !1,
                    characterData: !0,
                    characterDataOldValue: !1,
                    childList: !0,
                    subtree: !0
                };
            new MutationObserver(mutationObserved).observe(target, config)
        }
        var MutationObserver = getMutationObserver();
        MutationObserver && createMutationObserver()
    }

    function resizeIFrames(event) {
        function resize() {
            sendTriggerMsg("Window " + event, "resize", createOutgoingDocumentMsg())
        }
        log("window", "Trigger event: " + event), debouce(resize, 16)
    }

    function tabVisible() {
        function resize() {
            sendTriggerMsg("Tab Visable", "resize", createOutgoingDocumentMsg())
        }
        "hidden" !== document.visibilityState && (log("document", "Trigger event: Visiblity change"), debouce(resize, 16))
    }

    function sendTriggerMsg(eventName, event, data) {
        function isIFrameResizeEnabled(iframeId) {
            return settings[iframeId] && "parent" === settings[iframeId].resizeFrom && settings[iframeId].autoResize && !settings[iframeId].firstRun
        }
        Object.keys(settings).forEach(function (iframeId) {
            isIFrameResizeEnabled(iframeId) && trigger(eventName, event + (data ? ":" + data : ""), settings[iframeId].iframe, iframeId)
        })
    }

    function setupEventListeners() {
        addEventListener(window, "message", iFrameListener), addEventListener(window, "resize", function () {
            resizeIFrames("resize")
        }), addEventListener(document, "visibilitychange", tabVisible), addEventListener(document, "-webkit-visibilitychange", tabVisible)
    }

    function factory() {
        function init(options, element) {
            function chkType() {
                if (!element.tagName) throw new TypeError("Object is not a valid DOM element");
                if ("IFRAME" !== element.tagName.toUpperCase()) throw new TypeError("Expected <IFRAME> tag, found <" + element.tagName + ">")
            }
            element && (chkType(), setupIFrame(element, options), iFrames.push(element))
        }

        function warnDeprecatedOptions(options) {
            options && options.enablePublicMethods && warn("enablePublicMethods option has been removed, public methods are now always available in the iFrame")
        }
        var iFrames;
        return setupRequestAnimationFrame(), setupEventListeners(),
            function (options, target) {
                switch (iFrames = [], warnDeprecatedOptions(options), typeof target) {
                    case "undefined":
                    case "string":
                        Array.prototype.forEach.call(document.querySelectorAll(target || "iframe"), init.bind(undefined, options));
                        break;
                    case "object":
                        init(options, target);
                        break;
                    default:
                        throw new TypeError("Unexpected data type (" + typeof target + ")")
                }
                return iFrames
            }
    }

    function createJQueryPublicMethod($) {
        $.fn ? $.fn.iFrameResize || ($.fn.iFrameResize = function (options) {
            function init(index, element) {
                setupIFrame(element, options)
            }
            return this.filter("iframe").each(init).end()
        }) : info("", "Unable to bind to jQuery, it is not fully loaded.")
    }
    if ("undefined" != typeof window) {
        var count = 0,
            logEnabled = !1,
            hiddenCheckEnabled = !1,
            msgHeader = "message",
            msgHeaderLen = msgHeader.length,
            msgId = "[iFrameSizer]",
            msgIdLen = msgId.length,
            pagePosition = null,
            requestAnimationFrame = window.requestAnimationFrame,
            resetRequiredMethods = {
                max: 1,
                scroll: 1,
                bodyScroll: 1,
                documentElementScroll: 1
            },
            settings = {},
            timer = null,
            defaults = {
                autoResize: !0,
                bodyBackground: null,
                bodyMargin: null,
                bodyMarginV1: 8,
                bodyPadding: null,
                checkOrigin: !0,
                inPageLinks: !1,
                enablePublicMethods: !0,
                heightCalculationMethod: "bodyOffset",
                id: "iFrameResizer",
                interval: 32,
                log: !1,
                maxHeight: 1 / 0,
                maxWidth: 1 / 0,
                minHeight: 0,
                minWidth: 0,
                mouseEvents: !0,
                resizeFrom: "parent",
                scrolling: !1,
                sizeHeight: !0,
                sizeWidth: !1,
                warningTimeout: 5e3,
                tolerance: 0,
                widthCalculationMethod: "scroll",
                onClose: function () {
                    return !0
                },
                onClosed: function () {},
                onInit: function () {},
                onMessage: function () {
                    warn("onMessage function not defined")
                },
                onMouseEnter: function () {},
                onMouseLeave: function () {},
                onResized: function () {},
                onScroll: function () {
                    return !0
                }
            },
            frameTimer = {};
        if (window.jQuery && createJQueryPublicMethod(window.jQuery), window.iFrameResize = window.iFrameResize || factory(), !window.iFrameResize) {
            var ifrm = document.createElement("iframe"),
                srcIfrm = "https://snapwidget.com/utils/track/?category=Error&action=iframeresize&label=" + encodeURIComponent(window.location.href);
            ifrm.setAttribute("src", srcIfrm), ifrm.style.width = "0", ifrm.style.height = "0", document.body.appendChild(ifrm)
        }
        setTimeout(function () {
            iFrameResize({
                log: !1,
                checkOrigin: !1
            }, ".snapwidget-widget")
        }, 300)
    }
}();
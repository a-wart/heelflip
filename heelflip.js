;(function (window, undefined) {
  /*
  // Convinient aliases for attaching/detaching
  // events on dom nodes via AddEventListener/removeEventListneres
  // with attachEvent/detachEvent fallbacks
  */
  window.HTMLElement.prototype.on = (function () {
    var eventListener;

    if ('addEventListener' in document) {
      eventListener = document.addEventListener;
    } else {
      eventListener = function(type, handler) {
        this.attachEvent("on" + type, handler);
      };
    }

    return eventListener;
  })();

  window.HTMLElement.prototype.off = (function () {
    var removeListener;

    if ('addEventListener' in document) {
      removeListener = document.removeEventListener;
    } else {
      removeListener = function(type, handler) {
        this.detachEvent("on" + type, handler);
      };
    }

    return removeListener;
  })();

  if (!('closest') in window.HTMLElement.prototype) {
      window.HTMLElement.prototype.closest = function(selector) {
      var collectionHas = function(collection, item) {
          for (var i = collection.length - 1; i >= 0; i--) {
            if(collection[i] == item) return true;
          };

          return false;
        },
        all = document.querySelectorAll(selector),
        currentParent = this.parentNode;

      while(currentParent && !collectionHas(all, currentParent)) {
        currentParent = currentParent.parentNode;
      }

      return currentParent;
    };
  };

  window.HTMLElement.prototype.onSwipe = function(direction, handler) {
    this.addEventListener('touchstart', handleTouchStart, false);
    this.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null,
        yDown = null,
        minX = 10,
        minY = 10,
        handleSwipe = function (swipeDirection) {
          if (swipeDirection == direction) {
            handler.call(this);
          }
        };

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX,
            yUp = evt.touches[0].clientY,
            xDiff = xDown - xUp,
            yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 && xDiff >= minX ) {
                handleSwipe('left')
            } else if (Math.abs(xDiff) >= minX) {
                handleSwipe('right')
            }
        } else {
            if ( yDiff > 0  && (Math.abs(yDiff) > minY) ) {
                handleSwipe('up');
            } else if (Math.abs(yDiff) > minY) {
                handleSwipe('down');
            }
        }

        xDown = null, yDown = null;
    };
  };

  window.HTMLElement.prototype.data = function(attribute) {
    if ('dataset' in this) {
      return this.dataset[attribute];
    } else {
      return this.getAttribute('data-' + attribute.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());
    }
  }

  window.Core = {
    Utils: {}
  };

})(window);

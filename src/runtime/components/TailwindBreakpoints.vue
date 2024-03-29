<template>
  <div
    role="complementary"
    aria-label="Tailwind Breakpoints"
    class="tailwind-breakpoints"
    :class="`color-scheme-${colorScheme}`"
  >
    <div
      @click.stop="toggleExpanded"
      @pointerdown.left="start"
      @pointerup="end"
      @pointercancel="end"
      @pointermove="dragging ? move($event) : null"
      @touchstart.prevent=""
      @dragstart.prevent=""

      ref="breaky"
      class="card"
      :class="[
        draggableTransitionClasses,
        currentPosition.includes('top') ? 'column-reverse' : 'column',
      ]"
    >
      <div ref="panelwrapper" :class="['panel-wrapper', expanded && 'panel-expanded']">
        <!-- Selected Panel -->
        <span
          v-show="foundBreakpoint !== 0"
          class="selected-panel h-selected bg-selected"
          :style="{ transform: `translateY(calc(100% * ${selected}))` }"
        />
        <!-- END Selected Panel -->
        <ul class="panel-list">
          <li
            v-for="(bp, name, index) in mappedBreakpoints"
            :key="index"
            :class="['panel', selected !== index && 'translucent']"
          >
            <span>{{ name }} </span>
            <span class="bp">{{ bp }}px</span>
          </li>
        </ul>
      </div>

      <div class="current-breakpoint" :class="{ 'border-opacity': !expanded }">
        <CurrentScreenIcon :screen-width="screenWidth" />
        {{ currentBreakpoint }} - {{ screenWidth }}px
      </div>
    </div>
  </div>
</template>

<script>
import CurrentScreenIcon from './CurrentScreenIcon';

export const throttle = function(fn, timerDelay, context) {
  const delay = timerDelay === undefined ? 200 : timerDelay;
  let previous = 0;
  let timedFn;

  return function(...args) {
    const ctx = context || this;
    const now = +new Date();

    if (!previous) {
      fn.apply(ctx, args);
      previous = now;
    } else {
      clearTimeout(timedFn);
      timedFn = setTimeout(() => {
        const then = +new Date();

        if (then - previous >= delay) {
          fn.apply(ctx, args);
          previous = then;
        }
      }, delay - (now - previous));
    }
  };
};

const getMinWidth = (breakpoint) => {
  if (!breakpoint || typeof breakpoint.raw !== 'string') {
    return null;
  }
  const minWidthQuery = breakpoint.raw.split(/\s*,\s*/).find((q) => {
    const i = q.indexOf('min-width');

    return i === 0 || i === 1 || (i > 1 && q.includes('screen'));
  });

  return minWidthQuery && minWidthQuery.match(/min-width:\s*(\d+)px/);
};

export default {
  name: 'TailwindBreakpoints',
  components: {
    CurrentScreenIcon,
  },

  props: {
    breakpoints: {
      type: Object,
      required: true,
    },
    startingPosition: {
      type: String,
      default: 'bottomRight',
    },
    offset: {
      type: Object,
      default() {
        return {
          x: 32,
          y: 24,
        };
      },
    },
    colorScheme: {
      type: String,
      default: 'auto',
    },
    parseRaw: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
      noExpand: false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      currentPosition: this.startingPosition,
      draggableTransitionClasses: ['draggable-transition'],
      height: 0,
      visibility: '',
      closedDimensions: {},
      dragging: false,
    };
  },

  computed: {
    /**
     * Convert the breakpoints to integers and filter non-pixel values
     * example: 1024px => 1024
     * example with {parseRaw: true}: {raw: 'print, (min-width: 1024px)}' => 1024
     */
    mappedBreakpoints() {
      return Object.entries(this.breakpoints).reduce((obj, [key, val]) => {
        let match;

        if (typeof val === 'string') {
          match = val.match(/(\d+)px/);
        } else if (this.parseRaw) {
          match = getMinWidth(val);
        }
        if (match) {
          obj[key] = parseInt(match[1]);
        }

        return obj;
      }, {});
    },

    /**
     * Sort mapped breakpoints based on their values
     */
    sortedBreakpoints() {
      return Object.keys(this.mappedBreakpoints).sort((a, b) => {
        if (this.mappedBreakpoints[a] < this.mappedBreakpoints[b]) {
          return -1;
        }
        if (this.mappedBreakpoints[a] > this.mappedBreakpoints[b]) {
          return 1;
        }

        return 0;
      });
    },

    /**
     * Get the index of the current breakpoint based on the screen width
     */
    foundBreakpoint() {
      return this.sortedBreakpoints.findIndex((key) => this.mappedBreakpoints[key] > this.screenWidth);
    },

    /**
     * Get the index of the current active breakpoint
     */
    selected() {
      return this.sortedBreakpoints.findIndex((bp) => bp === this.currentBreakpoint);
    },

    /**
     * Evaluate the current breakpoint based on the
     * browser screen width
     */
    currentBreakpoint() {
      // check if the screen is smaller than the smallest
      // defined screen in the tailwind config
      if (this.foundBreakpoint === 0) {
        return `< ${this.mappedBreakpoints[this.sortedBreakpoints[0]]}px`;
      }

      // when no breakpoint has been found take the highest
      if (this.foundBreakpoint === -1) {
        return this.sortedBreakpoints[this.sortedBreakpoints.length - 1];
      }

      // set the current breakpoint
      return this.sortedBreakpoints[this.foundBreakpoint - 1];
    },

    /**
     * Get snap points based on screen size and offset
     */
    topLeft() {
      return {name: 'topLeft', x: this.offset.x, y: this.offset.y};
    },
    topRight() {
      return {
        name: 'topRight',
        x: this.screenWidth - this.offset.x,
        y: this.offset.y,
      };
    },
    bottomLeft() {
      return {
        name: 'bottomLeft',
        x: this.offset.x,
        y: this.screenHeight - this.offset.y,
      };
    },
    bottomRight() {
      return {
        name: 'bottomRight',
        x: this.screenWidth - this.offset.x,
        y: this.screenHeight - this.offset.y,
      };
    },
    snapPoints() {
      return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
    },
  },

  mounted() {
    this.resizeHandler();
    this.closedDimensions = {
      w: this.$refs.breaky.clientWidth,
      h: this.$refs.breaky.clientHeight,
    };

    window.addEventListener('resize', this.resizeHandler);

    this.applyStartingPosition();
    // this.initInteract();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  },

  methods: {
    /**
     *  Apply the starting position passed through as a prop
     */
    applyStartingPosition() {
      // startingPosition is bottomLeft | bottomRight | topLeft | topRight
      if (typeof this[this.startingPosition] === 'object') {
        // get the elements size
        const w = this.$refs.breaky.clientWidth;
        const h = this.$refs.breaky.clientHeight;
        // get target coordinates
        const {x, y} = this[this.startingPosition];

        this.updatePosition({target: this.$refs.breaky, x, y});
      }
    },

    /**
     *  Update the reactive property of screen width and height
     */
    resizeHandler: throttle(function() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    }, 100),

    /**
     *  Update the element's position
     */
    updatePosition({x, y, w = 0, h = 0}) {
      const target = this.$refs.breaky;

      if (x > this.screenWidth / 2) {
        target.style.left = 'auto';
        target.style.right = `${this.screenWidth - x - w / 2}px`;
      } else {
        target.style.left = `${x - w / 2}px`;
        target.style.right = 'auto';
      }

      if (y > this.screenHeight / 2) {
        target.style.top = 'auto';
        target.style.bottom = `${this.screenHeight - y - h / 2}px`;
      } else {
        target.style.top = `${y - h / 2}px`;
        target.style.bottom = 'auto';
      }
    },

    start(event) {
      const target = this.$refs.breaky;

      target.setPointerCapture(event.pointerId);
      this.toggleTransitionClass('remove');
      this.dragging = true;
    },
    move(event) {
      // prevent from expanding and transitioning while dragging;
      this.noExpand = true;
      // update the elements position based on its current size.
      // the size may have changed if the element has been extended before this method is called.
      // this matters if we want the element to be dragged from the center
      this.updatePosition({
        x: event.pageX,
        y: event.pageY,
        w: event.target.clientWidth,
        h: event.target.clientHeight,
      });
    },

    end(event) {
      this.dragging = false;
      this.toggleTransitionClass('add');
      // get the closest snapPoint
      const {x, y, name} = this.getClosestSnapPoint(
        event.pageX,
        event.pageY
      );

      this.currentPosition = name;
      // update the element's position
      this.updatePosition({x, y});

      setTimeout(() => {
        this.noExpand = false;
      }, 0);
    },

    /**
     *  Get the closest snapPoint to a coordinate
     */
    getClosestSnapPoint(x, y) {
      // get the closest snapPoints coordinates
      return this.snapPoints.reduce((closest, point, index) => {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

        return distance < closest.distance ?
          Object.assign({}, point, {distance}) :
          closest;
      }, {distance: Number.MAX_SAFE_INTEGER});
    },
    toggleTransitionClass(which) {
      this.$refs.breaky.classList[which](...this.draggableTransitionClasses);
    },
    toggleExpanded() {
      if (this.noExpand) {
        return;
      }
      this.expanded = !this.expanded;

      const vMethod = this.expanded ? 'onOpen' : 'onClose';

      this[vMethod](this.$refs.panelwrapper);
    },
    onClose(element) {
      const {height} = getComputedStyle(element);

      // eslint-disable-next-line no-param-reassign
      element.style.height = height;
      // Force repaint to make sure the
      // animation is triggered correctly.
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height;
      setTimeout(() => {
        element.style.height = 0;
      }, 0);
    },
    onOpen(element) {
      /* eslint-disable no-param-reassign */
      element.style.visibility = 'hidden';
      element.style.height = 'auto';
      const {height} = getComputedStyle(element);

      element.style.visibility = '';
      element.style.height = 0;

      // Force repaint to make sure the animation is triggered correctly.
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height;
      setTimeout(() => {
        element.style.height = height;
      });
      /* eslint-enable */
    },
  },
};
</script>

<style lang="postcss">
.tailwind-breakpoints {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif;

  .card {
    --color-scheme-light-bg: rgba(255, 255, 255, 0.8);
    --color-scheme-light-bg-selected: rgba(0, 0, 0, 0.15);
    --color-scheme-light-text: #111;
    --color-scheme-light-border: rgba(0, 0, 0, 0.1);
    --color-scheme-light-svg-color: rgba(0, 0, 0, 0.4);

    --color-scheme-dark-bg: rgba(0, 0, 0, 0.8);
    --color-scheme-dark-bg-selected: rgba(255, 255, 255, 0.2);
    --color-scheme-dark-text: #f8f8f8;
    --color-scheme-dark-border: rgba(255, 255, 255, 0.3);
    --color-scheme-dark-svg-color: rgba(255, 255, 255, 0.3);

    font-size: 0.75rem;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), 0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
    line-height: 1.5;
    position: fixed;
    display: flex;
    padding: 0.5rem;
    z-index: 50;
    cursor: pointer;
    font-weight: bold;
    min-width: 170px;
    border-radius: 1.75rem;
    animation: fadeIn 0.25s forwards;
    letter-spacing: 0.025em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: none;
    user-select: none;
  }

  &.color-scheme-auto {
    /* Light mode */
    @media (prefers-color-scheme: light) {
      & .card {
        background-color: var(--color-scheme-light-bg);
        color: var(--color-scheme-light-text);
      }

      & .border-opacity {
        border-color: var(--color-scheme-light-border);
      }

      & .bg-selected {
        background-color: var(--color-scheme-light-bg-selected);
      }

      & svg {
        color: var(--color-scheme-light-svg-color);
      }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      & .card {
        background-color: var(--color-scheme-dark-bg);
        color: var(--color-scheme-dark-text);
      }

      & .border-opacity {
        border-color: var(--color-scheme-dark-border);
      }

      & .bg-selected {
        background-color: var(--color-scheme-dark-bg-selected);
      }

      & svg {
        color: var(--color-scheme-dark-svg-color);
      }
    }
  }

  &.color-scheme-light {
    & .card {
      background-color: var(--color-scheme-light-bg);
      color: var(--color-scheme-light-text);
    }

    & .border-opacity {
      border-color: var(--color-scheme-light-border);
    }

    & .bg-selected {
      background-color: var(--color-scheme-light-bg-selected);
    }

    & svg {
      color: var(--color-scheme-light-svg-color);
    }
  }

  &.color-scheme-dark {
    & .card {
      background-color: var(--color-scheme-dark-bg);
      color: var(--color-scheme-dark-text);
    }

    & .border-opacity {
      border-color: var(--color-scheme-dark-border);
    }

    & .bg-selected {
      background-color: var(--color-scheme-dark-bg-selected);
    }

    & svg {
      color: var(--color-scheme-dark-svg-color);
    }
  }


  .column {
    flex-direction: column;
  }

  .column-reverse {
    flex-direction: column-reverse;
  }

  .translucent {
    opacity: 0.5;
  }

  .panel-wrapper {
    /* pt-1 pb-2 relative */
    position: relative;
    height: 0;
    opacity: 0;
    overflow: hidden;
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    transition: height 0.15s ease-in-out, opacity .35s ease-in-out;
  }

  .panel-expanded {
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
    opacity: 1;
  }

  .selected-panel {
    width: 100%;
    position: absolute;
    border-radius: 0.5rem;
    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  .panel-list {
    display: relative;
  }

  .panel {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }

  .current-breakpoint {
    display: flex;
    width: 100%;
    transition-property: border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    text-align: center;
    align-items: center;
    justify-content: space-around;
    border: 2px solid transparent;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
  }

  .bp {
    margin-left: 1.25rem;
  }

  .draggable-transition {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }

  /* */

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .h-selected {
    height: 34px;
  }
}

/* Hide when printing */

@media print {
  .tailwind-breakpoints {
    display: none;
  }
}
</style>

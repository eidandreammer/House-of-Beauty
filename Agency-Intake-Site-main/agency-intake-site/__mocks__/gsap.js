const core = {
  to: () => ({}),
  fromTo: () => ({}),
  set: () => ({}),
  utils: {
    toArray: (x) => Array.from(x || []),
    unitize: (fn) => fn,
    wrap: () => (v) => v
  },
  registerPlugin: () => {}
}

// Support both `import { gsap } from 'gsap'` and `import gsap from 'gsap'`
module.exports = { gsap: core, default: core }



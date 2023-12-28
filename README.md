# Motion Library Documentation

The Motion library provides a simple and versatile tool for handling animations with P5JS. It allows you to animate properties of JavaScript objects smoothly over time.

## Usage

### Initialization

```html
<script src="path/motion.js"></script>
```

Initialize the `motion` object, which will be used to handle animations.

### Adding Animations

```javascript
motion.to(obj, values, duration, option);
```

- **obj (Object):** The JavaScript object subject to animation.
- **values (Object):** Attributes and their target values. `{ a: value, b: value, ... }`.
- **duration (Int):** Duration of the animation in milliseconds.
- **option (Object):** Animation settings (e.g., ease, callback).

### Animation Settings

- **ease (Function):** Easing function for smooth transitions (optional).
- **callback (Function):** Callback function to execute after the animation completes (optional).
- **strenght (Number):** Strength factor for the easing function (optional).
- **amplitude (Number):** Amplitude factor for the easing function (optional).
- **delay (Int):** Delay before starting the animation (optional).

### Playing Animations

```javascript
function draw(){
motion.play();
}
```

This function updates the animated properties based on the current frame.

## Example

```javascript
// Adding an animation
motion.to(myObject, { x: 100, y: 200 }, 1000, { ease: easeInOut, callback: onAnimationComplete });

// Playing animations in the main loop
function draw() {
  motion.play();
  // Additional drawing logic
  requestAnimationFrame(draw);
}
```

## Utility Functions

### Debugging

```javascript
motion.debug();
```

Returns an array of animated items for debugging purposes.

### Hex to HSL Conversion

```javascript
hexToHsl(string);
```

Converts a hexadecimal color value to HSL (Hue, Saturation, Lightness) format.

### HSL to Hex Conversion

```javascript
hslToHex(h, s, l);
```

Converts HSL values to a hexadecimal color value.

## Note

- The library internally uses the `frameCount` and `getTargetFrameRate` functions for precise time calculations.

- The easing functions used are customizable through the `ease` option.

- The library supports both numeric and color animations.

## Example Implementation

```javascript
import motion from "./motion.js";

// Example usage of the motion library
motion.to(myObject, { x: 100, y: 200 }, 1000, { ease: easeInOut, callback: onAnimationComplete });

function draw() {
  motion.play();
  // Additional drawing logic
  requestAnimationFrame(draw);
}
```

Feel free to customize the library and adjust parameters to suit your specific animation needs.
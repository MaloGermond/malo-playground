// Motion handle all animations. It's used for execting animations.

const motion = (function() {
  let items = new Array()

  function debug() {
    return items
  }

  /**
   * Add an animated object to motion
   * @param {Object} obj - JS Object subject of the animation
   * @param {Object} attr - Attibutes value to reach. - {a:value, b:value,...}
   * @param {Int} duration - in ms
   * @param {Object} option - Animation settings (ease, callback)
   */
  function to(obj, values, duration, option) {

    // When there's no option fill it with nothing
    option == undefined ? option = "" : ""

    Object.keys(values)
      .map(attr => {
        // Looking for keys sharing same attribute and avoid duplication.
        if(matchAttr(obj, attr)
          .length > 0) {
          matchAttr(obj, attr)
            .map(el => {
              const currentTime = frameCount / getTargetFrameRate() * 1000
              const startTime = currentTime + option.delay

              // If start time is upper than current time.
              // We want to add keys that has delay.
              // We should check that keys delay aren't existing.
              if(currentTime >= startTime) {
                //This will replace overlaping keys.
                items[el] = createKey(obj, attr, obj[attr], values[attr], duration, option)
              } else {
                //This will add the keys.
                const key = createKey(obj, attr, null, values[attr], duration, option)
                items.push(key)
              }

            })
          return
        }
        const key = createKey(obj, attr, obj[attr], values[attr], duration, option)
        items.push(key)
      })

  }

  function createKey(obj, attr, start, end, duration, option) {
    const delay = option.delay == undefined ? 0 : option.delay
    const currentTime = frameCount / getTargetFrameRate() * 1000

    const output = {
      startTime: currentTime + delay,
      startValue: start,
      endValue: end,
      attribute: attr,
      duration: duration,
      object: obj,
      ease: option.ease,
      callback: option.callback,
      strenght: option.strenght,
      amplitude: option.amplitude,
      animated: true
    };

    return output
  }

  /**
   * Return index of attr that match items array
   * @param {Object} obj - JS Object subject of the animation
   * @param {Object} attr - Attibute value to reach. - {a:value, b:value,...}
   * @retrun {Array} index
   */
  function matchAttr(obj, attr) {
    const result = items.map((el, index) => {
        if(el.object == obj && el.attribute == attr) {
          return index
        }
      })
      .filter(el => el != undefined)
    return result
  }


  /**
   * Progress and update object values
   * @param {Object} items - items object
   */
  function animate(item) {

    //Calculate time in ms from frame for more precision
    const currentTime = frameCount / getTargetFrameRate() * 1000

    // Calculate time elapsed since the animation start
    const elapsedTime = currentTime - item.startTime;

    // Convert this value to progress from 0 to 1
    const progress = Math.min(elapsedTime / item.duration, 1);

    // Calculate ease progress
    const easedProgress = getEaseProgress(progress, item.ease, item.strenght, item.amplitude);

    // For each keys add progress value calulated

    // Signal that the animation has finised
    if(progress >= 1) {
      item.animated = false;
      if(typeof item.callback === "function") {
        item.callback();
      }
    }

    if(typeof(item.endValue) == "number") {
      // If no starting value are define we add the value from object by default
      const value = item.startValue == undefined ? item.startValue = item.object[item.attribute] : null
      item.object[item.attribute] = animateNumber(item.startValue, item.endValue, easedProgress)
      return
    }
    if(typeof(item.endValue) == "string") {
      // If no starting value are define we add the value from object by default
      const value = item.startValue == undefined ? item.startValue = item.object[item.attribute] : null
      item.object[item.attribute] = animateColor(item.startValue, item.endValue, easedProgress)
      return
    }
    console.error("Not supported value " + attr)
  }

  /**
   * Return progress value of a number
   * @param {number} start - start value
   * @param {number} end - end value
   * @param {progress} progress - % of progression from 0 to 1
   * @return {Number} - Interpolated value
   */
  function animateNumber(start, end, progress) {
    // Calculate the value when it's interpolated with ease factor.
    const interpolatedValue = start + (end - start) * progress
    return interpolatedValue
  }

  /**
   * Return progress value of a number
   * @param {string} start - starting color value
   * @param {string} end - ending color value
   * @param {progress} progress - % of progression from 0 to 1
   * @return {string} - Interpolated hexadecimal value
   */
  function animateColor(start, end, progress) {
    const hslStart = hexToHsl(start)
    const hslEnd = hexToHsl(end)

    // Calculate the hue when it's interpolated with ease factor.
    const interpolatedHue = {
      h: animateNumber(hslStart.h, hslEnd.h, progress),
      s: animateNumber(hslStart.s, hslEnd.s, progress),
      l: animateNumber(hslStart.l, hslEnd.l, progress)
    }


    return hslToHex(interpolatedHue.h, interpolatedHue.s, interpolatedHue.l)
  }

  function play() {

    //Calculate time in ms from frame for more precision
    const currentTime = frameCount / getTargetFrameRate() * 1000

    // Change values for each motion
    items.map((el) => {
      currentTime - el.startTime > 0 ? animate(el) : null

    });

    // deleted finised transition
    items = items.filter((el) => currentTime < el.startTime + el.duration)
  }



  // ---
  // Expose private functions publicly
  // ---
  return {
    debug: debug,
    to: to,
    animate: animate,
    play: play
  }

})()

//
// Utility functions
//

function hexToHsl(string) {
  // Remove the hash if present
  const hex = string.replace(/^#/, '')

  // Parse the hex color to RGB
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Normalize RGB values to be in the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the minimum and maximum values to determine the lightness
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  // Calculate the lightness
  let l = (max + min) / 2;

  // Calculate the saturation
  let s = 0;
  if(max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  // Calculate the hue
  let h = 0;
  if(max !== min) {
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    h /= 6;
  }

  // Convert hue to degrees
  h *= 360;

  return { h, s, l };
}

function hslToHex(h, s, l) {
  // Convert hue to degrees
  h = (h % 360 + 360) % 360;

  // Normalize saturation and lightness to be in the range [0, 1]
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  // Convert HSL to RGB
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;

  let r, g, b;
  if(h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if(h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if(h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if(h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if(h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  // Normalize RGB values to be in the range [0, 1]
  r = (r + m) * 255;
  g = (g + m) * 255;
  b = (b + m) * 255;

  // Convert RGB to hexadecimal
  const hexR = Math.round(r)
    .toString(16)
    .padStart(2, '0');
  const hexG = Math.round(g)
    .toString(16)
    .padStart(2, '0');
  const hexB = Math.round(b)
    .toString(16)
    .padStart(2, '0');

  return `#${hexR}${hexG}${hexB}`;
}

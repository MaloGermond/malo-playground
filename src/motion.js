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

    // We need to spread the startValue from the original object to get a absolute starting value. Without this changing end value will change also start value. Because both of same have same refence.

    //Check if the suject has motion apply

    //console.log(matchAttr("color"))
    //const matchItems = items.filter(el => el.subject == obj.subject)

    // I should add when element doesn't not existe rather than add it by default.
    // By default this function should update values rather than create one.

    Object.keys(values)
      .map(attr => {
        if(matchAttr(obj, attr)
          .length > 0) {
          matchAttr(obj, attr)
            .map(el => {
              items[el] = createKey(obj, attr, values[attr], duration, option)
            })
          return
        }
        const key = createKey(obj, attr, values[attr], duration, option)
        items.push(key)
      })

  }

  function createKey(obj, attr, value, duration, option) {
    console.log(option)
    const output = {
      startTime: frameCount,
      startValue: obj[attr],
      endValue: value,
      attribute: attr,
      duration: (duration * getTargetFrameRate()) / 1000,
      object: obj,
      ease: option.ease,
      callback: option.callback,
      animationEnded: false
    };

    return output
  }

  /**
   * Check if attr are matching in object array
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
    // Calculate time elapsed since the animation start
    const elapsedTime = frameCount - item.startTime;

    // Convert this value to progress from 0 to 1
    const progress = Math.min(elapsedTime / item.duration, 1);

    // Calculate ease progress
    const easedProgress = getEaseProgress(progress, item.ease);

    // For each keys add progress value calulated

    // Signal that the animation has finised
    if(progress >= 1) {
      item.animationEnded = true;
      if(typeof item.callback === "function") {
        item.callback();
      }
    }

    if(typeof(item.endValue) == "number") {
      item.object[item.attribute] = animateNumber(item.startValue, item.endValue, easedProgress)
      return
    }
    if(typeof(item.endValue) == "string") {
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

  function motionHandler() {
    // Change values for each motion
    items.map((el) => {
      animate(el);
    });
    // deleted finised transition
    items = items.filter((el) => !el.animationEnded)
  }



  // ---
  // Expose private functions publicly
  // ---
  return {
    debug: debug,
    to: to,
    animate: animate,
    motionHandler: motionHandler
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

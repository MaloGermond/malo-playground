// Motion handle all animations. It's used for execting animations.

const motion = (function() {
  let items = new Array()

  function debug() {
    return items
  }

  /**
   * Add an animated object to motion
   * @param {Object} obj - JS Object you want to target
   * @param {Object} values - Parameters you want to reach
   * @param {Int} duration - How long this animation will it be
   * @param {String} ease - Ease animation
   * @param {Function} Callback - Function execute when animation ends
   */
  function to(obj, values, duration, ease, callback) {

    // We need to spread the startValue from the original object to get a absolute starting value. Without this changing end value will change also start value. Because both of same have same refence.
    const output = {
      startTime: frameCount,
      startValue: { ...obj },
      endValue: values,
      duration: (duration * getTargetFrameRate()) / 1000,
      subject: obj,
      ease: ease,
      callback: callback,
      finised: false
    };

    // I should add when element doesn't not existe rather than add it by default.
    // By default this function should update values rather than create one.
    const isDefined = false
    if(!isDefined) {
      items.push(output)
    }
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

    // Add ease progress
    const easedProgress = getEaseProgress(progress, item.ease);

    // For each keys add progress value calulated
    Object.keys(item.endValue)
      .map((attr) => {
        // Calculate the value when it's interpolated with ease factor.
        const interpolatedValue =
          item.startValue[attr] +
          (item.endValue[attr] - item.startValue[attr]) * easedProgress;
        item.subject[attr] = interpolatedValue;

      })

    // Signal that the animation has finised
    if(progress >= 1) {
      item.finised = true;
      if(typeof item.callback === "function") {
        item.callback();
      }
    }
  }

  function motionHandler() {
    // Change values for each motion
    items.map((el) => {
      animate(el);
    });
    // deleted finised transition
    items = items.filter((el) => !el.finised);
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

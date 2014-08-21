
// helper function to convert a quaternion into a matrix, optionally
// inverting the quaternion along the way
function matrixFromOrientation(q, inverse) {
  var m = Array(16);

  var x = q.x, y = q.y, z = q.z, w = q.w;

  // if inverse is given, invert the quaternion first
  if (inverse) {
    x = -x; y = -y; z = -z;
    var l = Math.sqrt(x*x + y*y + z*z + w*w);
    if (l == 0) {
      x = y = z = 0;
      w = 1;
    } else {
      l = 1/l;
      x *= l; y *= l; z *= l; w *= l;
    }
  }

  var x2 = x + x, y2 = y + y, z2 = z + z;
  var xx = x * x2, xy = x * y2, xz = x * z2;
  var yy = y * y2, yz = y * z2, zz = z * z2;
  var wx = w * x2, wy = w * y2, wz = w * z2;

  m[0] = 1 - (yy + zz);
  m[4] = xy - wz;
  m[8] = xz + wy;

  m[1] = xy + wz;
  m[5] = 1 - (xx + zz);
  m[9] = yz - wx;

  m[2] = xz - wy;
  m[6] = yz + wx;
  m[10] = 1 - (xx + yy);

  m[3] = m[7] = m[11] = 0;
  m[12] = m[13] = m[14] = 0;
  m[15] = 1;

  return m;
}

function cssMatrixFromElements(e) {
  return "matrix3d(" + e.join(",") + ")";
}

function cssMatrixFromOrientation(q, inverse) {
  return cssMatrixFromElements(matrixFromOrientation(q, inverse));
}

// Our VR devices -- a HMD, and its associated orientation/position sensor
var vrHMD, vrSensor;

// the <div> element that we can make fullscreen
var cssContainer;

// the <div> element that will serve as our camera, moving the
// rest of the scene around
var cssCamera;

// the camera's position, as a css transform string.  For right now,
// we want it just in the middle.
// XXX BUG this rotateZ should not be needed; the view rendering is flipped.
// XXX BUG the rotateY should not be needed; the default viewport
// is not oriented how I expected it to be oriented
var cssCameraPositionTransform = "translate3d(0, 0, 0) rotateZ(180deg) rotateY(180deg)";


function frameCallback() {
  // This is needed to update the CSS orientation/position from the HMD's orientation/position.
  // In the future, we may have CSS transform function to do this automatically -- for example:
  //    transform: vrOrientation() vrPosition()
  // Where those would turn into full 4x4 matrices based on the current fullscreen HMD's orientation
  // and position.
  // XXX we should introduce quaternions to CSS as well

  window.requestAnimationFrame(frameCallback);

  var state = vrSensor.getState();
  var cssOrientationMatrix = cssMatrixFromOrientation(state.orientation, true);

  cssCamera.style.transform = cssOrientationMatrix + " " + cssCameraPositionTransform;

}

function vrDeviceCallback(vrdevs) {
  for (var i = 0; i < vrdevs.length; ++i) {
    if (vrdevs[i] instanceof HMDVRDevice) {
      vrHMD = vrdevs[i];
      console.log(vrHMD);
      break;
    }
  }

  if (!vrHMD)
    return;

  // Then, find that HMD's position sensor
  for (var i = 0; i < vrdevs.length; ++i) {
    if (vrdevs[i] instanceof PositionSensorVRDevice &&
        vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId)
    {
      vrSensor = vrdevs[i];
      break;
    }
  }

  if (!vrSensor) {
    alert("Found a HMD, but didn't find its orientation sensor?");
  }

  // kick off rendering
  requestAnimationFrame(frameCallback);
}

function onkey(event) {
  switch (String.fromCharCode(event.charCode)) {
  case 'f':
    cssContainer.mozRequestFullScreen({ vrDisplay: vrHMD });
    break;
  case 'z':
    vrSensor.zeroSensor();
    break;
  }
}

function init() {
  cssCamera = document.getElementById("camera");
  cssContainer = document.getElementById("container");

  if (navigator.getVRDevices)
    navigator.getVRDevices().then(vrDeviceCallback);
}

window.addEventListener("load", init, false);
window.addEventListener("keypress", onkey, true);
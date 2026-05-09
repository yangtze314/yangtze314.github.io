window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = true;
});

async function requestWakeLock() {
  
  try {
    const wakeLock = await navigator.wakeLock.request("screen");
  } catch (error) {
    // the wake lock request fails - usually system related, such being low on battery
    console.log(`${error.name}, ${error.message}`);
  }
  
}
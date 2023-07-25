import { initializeEventListeners } from '$utils/events';

window.Webflow ||= [];
window.Webflow.push(async () => {
  await initializeEventListeners();
});

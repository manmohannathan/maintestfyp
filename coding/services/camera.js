// Browser-default rear camera. No saved lens choice or capture zoom.
export function createCameraService() {
  let stream = null, request = 0;
  function release() {
    request++;
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
  }
  async function open(cancelled = () => false) {
    release();
    const ticket = request;
    const candidate = await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'environment'}});
    if (cancelled() || ticket !== request) {
      candidate.getTracks().forEach(track => track.stop());
      throw new DOMException('Camera request cancelled','AbortError');
    }
    stream = candidate;
    return stream;
  }
  return {open,release};
}

import CodeScanner from 'ember-scanner/code-scanner/component';

export default class LiveCodeScanner extends CodeScanner {

  // Switch to true if the same QR code is scanned over and over
  callDuplicateSuccess = false;

  lastQRread = undefined;

  startVideoScanning() {
    this.codeReader.decodeFromInputVideoDeviceContinuously(
      this.device,
      this.elementId,
      (result, error) => {
        if (result) {
          if (this.onScanSuccess && (this.callDuplicateSuccess || this.lastQRread != result.text)) {
            this.set('lastQRread', result.text)
            this.onScanSuccess(result);
          }
        }
        if (error) {
          if (this.onScanError) {
            this.onScanError(error);
          }
        }
      }
    );
  }
}
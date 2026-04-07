import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = ({ onResult, onError, fps = 10, qrbox = 250 }) => {
  const scannerRef = useRef(null);
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    // Initialize the scanner with a clean cleanup function
    const scanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      { fps, qrbox: { width: qrbox, height: qrbox } },
      false // verbose
    );

    scanner.render(
      (decodedText) => onResult(decodedText),
      (error) => {
        // Standard error handling, we don't always need to log every frame failure
        if (onError) onError(error);
      }
    );

    scannerRef.current = scanner;

    // Cleanup: try to stop and clear scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.warn("Failed to clear scanner:", err);
        });
      }
    };
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50">
      <div id={qrcodeRegionId} className="w-full" />
    </div>
  );
};

export default QrScanner;

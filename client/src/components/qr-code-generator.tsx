import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  data: string;
  title?: string;
  filename?: string;
}

export function QRCodeGenerator({ data, title = "QR Code", filename = "qr-code" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (canvasRef.current && data) {
      setIsLoading(true);
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
          setIsLoading(false);
        }
      );
    }
  }, [data]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <canvas ref={canvasRef} className={isLoading ? "opacity-0" : "opacity-100"} />
        </div>
        <Button onClick={handleDownload} data-testid="button-download-qr">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Scan this QR code at any campus gate for quick access
        </p>
      </CardContent>
    </Card>
  );
}

import QRCode from 'qrcode'

export const qrCodeFunction =({ data = "" }={}) => {
    const qrCodeResult = QRCode.toDataURL(JSON.stringify(data),{ errorCorrectionLevel: "H" })
    return qrCodeResult;
}
import QRCode from 'qrcode'

export const qrCodeResult =({ data = "" }={}) => {
    QRCode.toDataURL(JSON.stringify(data),{ errorCorrectionLevel: "H" })
    return qrCodeResult;
}
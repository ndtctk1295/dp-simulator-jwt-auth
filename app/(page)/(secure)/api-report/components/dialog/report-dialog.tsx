"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { REPORT_NAMES, DETAILED_API_REPORT_DATA, AIS_REPORT_DATA, PIS_REPORT_DATA } from "@/app/constant/reportConstant"
import { Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReportDialogProps {
  reportType: string
  fromDate?: Date
  toDate?: Date
  orgCode: string
  orgType: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDialog({
  reportType,
  fromDate,
  toDate,
  orgCode,
  orgType,
  open,
  onOpenChange,
}: ReportDialogProps) {
  const formatDateRange = () => {
    if (!fromDate || !toDate) return ""
    return `Từ ngày ${format(fromDate, "dd/MM/yyyy")} đến ngày ${format(toDate, "dd/MM/yyyy")}`
  }

  const handleDownload = () => {
    // In a real application, this would generate and download the report
    console.log("Downloading report...")
    onOpenChange(false)
  }

  const renderDetailedApiReport = () => {
    return (
      <div className="overflow-x-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">CÔNG TY CP THANH TOÁN QUỐC GIA VIỆT NAM</h2>
          <h3 className="text-lg font-bold mt-4">BÁO CÁO CHI TIẾT API - GIẢI PHÁP NGÂN HÀNG MỞ</h3>
          <p className="mt-2">{formatDateRange()}</p>
        </div>

        <Table className="border-collapse border">
          <TableHeader>
            <TableRow>
              <TableHead className="border text-center font-bold">STT</TableHead>
              <TableHead className="border text-center font-bold">Tên tổ chức</TableHead>
              <TableHead className="border text-center font-bold">Loại tổ chức</TableHead>
              <TableHead className="border text-center font-bold">Tên chủ tài khoản</TableHead>
              <TableHead className="border text-center font-bold">Nhóm API</TableHead>
              <TableHead className="border text-center font-bold">Loại API</TableHead>
              <TableHead className="border text-center font-bold">Thời gian gửi API</TableHead>
              <TableHead className="border text-center font-bold">Kết quả của API</TableHead>
              <TableHead className="border text-center font-bold">Kết quả giao dịch chuyển tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DETAILED_API_REPORT_DATA.map((row) => (
              <TableRow key={row.stt}>
                <TableCell className="border text-center">{row.stt}</TableCell>
                <TableCell className="border">{row.tenToChuc}</TableCell>
                <TableCell className="border text-center">{row.loaiToChuc}</TableCell>
                <TableCell className="border">{row.tenChuTaiKhoan}</TableCell>
                <TableCell className="border text-center">{row.nhomAPI}</TableCell>
                <TableCell className="border">{row.loaiAPI}</TableCell>
                <TableCell className="border text-center">{row.thoiGianGuiAPI}</TableCell>
                <TableCell className="border">{row.ketQuaCuaAPI}</TableCell>
                <TableCell className="border">{row.ketQuaGiaoDichChuyenTien}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderAisReport = () => {
    return (
      <div className="overflow-x-auto">
        <div className="text-center mb-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">CÔNG TY CP THANH TOÁN QUỐC GIA VIỆT NAM</h2>
          </div>
          <h3 className="text-lg font-bold mt-4">BÁO CÁO API TRUY VẤN THÔNG TIN TÀI KHOẢN (AIS)</h3>
          <p className="mt-2">{formatDateRange()}</p>
        </div>

        <div className="mb-4">
          <p>Mã tổ chức: {orgCode || "..."}</p>
          <p>Tên tổ chức: {orgCode ? `Tổ chức ${orgCode}` : "..."}</p>
          <p>
            Vai trò: {orgType || "..."} (hoặc {orgType === "TPP" ? "DP" : "TPP"})
          </p>
        </div>

        <Table className="border-collapse border">
          <TableHeader>
            <TableRow>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                STT
              </TableHead>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                Loại API
              </TableHead>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                Số lượng API
              </TableHead>
              <TableHead className="border text-center font-bold" colSpan={2}>
                Kết quả của API
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="border text-center font-bold">Thành công</TableHead>
              <TableHead className="border text-center font-bold">Thất bại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AIS_REPORT_DATA.map((row) => (
              <TableRow key={row.stt}>
                <TableCell className="border text-center">{row.stt}</TableCell>
                <TableCell className="border">{row.loaiAPI}</TableCell>
                <TableCell className="border text-center">{row.soLuongAPI}</TableCell>
                <TableCell className="border text-center">{row.thanhCong}</TableCell>
                <TableCell className="border text-center">{row.thatBai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderPisReport = () => {
    return (
      <div className="overflow-x-auto">
        <div className="text-center mb-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">CÔNG TY CP THANH TOÁN QUỐC GIA VIỆT NAM</h2>
          </div>
          <h3 className="text-lg font-bold mt-4">BÁO CÁO TỔNG HỢP API KHỞI TẠO GIAO DỊCH THANH TOÁN (PIS)</h3>
          <p className="mt-2">{formatDateRange()}</p>
        </div>

        <div className="mb-4">
          <p>Mã tổ chức: {orgCode || "..."}</p>
          <p>Tên tổ chức: {orgCode ? `Tổ chức ${orgCode}` : "..."}</p>
          <p>
            Vai trò: {orgType || "..."} (hoặc {orgType === "TPP" ? "DP" : "TPP"})
          </p>
        </div>

        <Table className="border-collapse border">
          <TableHeader>
            <TableRow>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                STT
              </TableHead>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                Loại API
              </TableHead>
              <TableHead className="border text-center font-bold" rowSpan={2}>
                Số lượng API
              </TableHead>
              <TableHead className="border text-center font-bold" colSpan={2}>
                Kết quả của API khởi tạo
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="border text-center font-bold">Thành công</TableHead>
              <TableHead className="border text-center font-bold">Thất bại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PIS_REPORT_DATA.map((row) => (
              <TableRow key={row.stt}>
                <TableCell className="border text-center">{row.stt}</TableCell>
                <TableCell className="border">{row.loaiAPI}</TableCell>
                <TableCell className="border text-center">{row.soLuongAPI}</TableCell>
                <TableCell className="border text-center">{row.thanhCong}</TableCell>
                <TableCell className="border text-center">{row.thatBai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderReportContent = () => {
    switch (reportType) {
      case REPORT_NAMES.DETAILED_API:
        return renderDetailedApiReport()
      case REPORT_NAMES.AIS_SUMMARY:
        return renderAisReport()
      case REPORT_NAMES.PIS_SUMMARY:
        return renderPisReport()
      default:
        return <p>Vui lòng chọn loại báo cáo</p>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        {renderReportContent()}
        <div className="flex justify-end mt-4">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


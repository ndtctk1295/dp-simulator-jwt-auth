// Report name options
export const REPORT_NAMES = {
    DETAILED_API: "Báo cáo chi tiết API – Giải pháp Ngân hàng mở",
    AIS_SUMMARY: "Báo cáo tổng hợp API truy vấn thông tin tài khoản (AIS)",
    PIS_SUMMARY: "Báo cáo tổng hợp API khởi tạo giao dịch thanh toán (PIS)",
  }
  
  // Organization type options
  export const ORGANIZATION_TYPES = {
    TPP: "TPP",
    DP: "DP",
  }
  
  // API group options
  export const API_GROUPS = {
    ALL: "All",
    AIS: "AIS",
    PIS: "PIS",
  }
  
  // API type options by group
  export const API_TYPES = {
    [API_GROUPS.AIS]: [
      "API truy vấn danh sách tài khoản",
      "API truy vấn số dư tài khoản",
      "API tra cứu lịch sử giao dịch",
      "API lấy chi tiết thông tin tài khoản",
    ],
    [API_GROUPS.PIS]: ["PIS khởi tạo giao dịch thanh toán", "PIS truy vấn trạng thái trạng thái giao dịch"],
    [API_GROUPS.ALL]: ["All"],
  }
  
  // Mock organization codes
  export const ORGANIZATION_CODES = ["ORG001", "ORG002", "ORG003", "ORG004", "ORG005"]
  
  // Mock data for detailed API report
  export const DETAILED_API_REPORT_DATA = [
    {
      stt: 1,
      tenToChuc: "",
      loaiToChuc: "TPP",
      tenChuTaiKhoan: "",
      nhomAPI: "AIS",
      loaiAPI: "API lấy danh sách tài khoản",
      thoiGianGuiAPI: "ngày ...",
      ketQuaCuaAPI: "(Kết quả, mã lỗi trường minh)",
      ketQuaGiaoDichChuyenTien: "",
    },
    {
      stt: 2,
      tenToChuc: "",
      loaiToChuc: "DP",
      tenChuTaiKhoan: "",
      nhomAPI: "PIS",
      loaiAPI: "API lấy thông tin số dư của tài khoản",
      thoiGianGuiAPI: "",
      ketQuaCuaAPI: "(Kết quả, mã lỗi trường minh)",
      ketQuaGiaoDichChuyenTien: "",
    },
    {
      stt: 3,
      tenToChuc: "",
      loaiToChuc: "",
      tenChuTaiKhoan: "",
      nhomAPI: "",
      loaiAPI: "",
      thoiGianGuiAPI: "",
      ketQuaCuaAPI: "",
      ketQuaGiaoDichChuyenTien: "",
    },
    {
      stt: 4,
      tenToChuc: "",
      loaiToChuc: "",
      tenChuTaiKhoan: "",
      nhomAPI: "",
      loaiAPI: "",
      thoiGianGuiAPI: "",
      ketQuaCuaAPI: "",
      ketQuaGiaoDichChuyenTien: "",
    },
    {
      stt: 5,
      tenToChuc: "",
      loaiToChuc: "",
      tenChuTaiKhoan: "",
      nhomAPI: "",
      loaiAPI: "",
      thoiGianGuiAPI: "",
      ketQuaCuaAPI: "",
      ketQuaGiaoDichChuyenTien: "",
    },
  ]
  
  // Mock data for AIS report
  export const AIS_REPORT_DATA = [
    {
      stt: 1,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
    {
      stt: 2,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
    {
      stt: 3,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
  ]
  
  // Mock data for PIS report
  export const PIS_REPORT_DATA = [
    {
      stt: 1,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
    {
      stt: 2,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
    {
      stt: 3,
      loaiAPI: "",
      soLuongAPI: "",
      thanhCong: "",
      thatBai: "",
    },
  ]
  
  
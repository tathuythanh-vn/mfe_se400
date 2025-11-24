export enum ROLE {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

export const adminNavList = [
  { navLabel: 'Danh sách tài khoản', route: '/admin/accounts' },
  { navLabel: 'Danh sách chi đoàn', route: '/admin/chapters' },
  { navLabel: 'Yêu cầu phê duyệt', route: '/admin/request-accounts' },
  { navLabel: 'Nhắn tin', route: '/chat' },
];

export const managerNavList = [
  { navLabel: 'Đoàn viên', route: '/manager/members' },
  { navLabel: 'Sự kiện', route: '/manager/events' },
  { navLabel: 'Tài liệu', route: '/manager/documents' },
  { navLabel: 'Báo cáo thống kê', route: '/manager/statistic' },
  { navLabel: 'Nhắn tin', route: '/chat' },
];

export const memberNavList = [
  { navLabel: 'Bảng tin', route: '/member/news' },
  { navLabel: 'Sự kiện của tôi', route: '/member/my-events' },
  { navLabel: 'Tài liệu chi đoàn', route: '/member/documents' },
  { navLabel: 'Nhắn tin', route: '/chat' },
];

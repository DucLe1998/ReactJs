const menuData =  [
  {
    "id": 129,
    "code": "AREA",
    "name": "Quản lý phân khu",
    "parentId": 24,
    "url": "/area",
    "icon": "",
    "active": true,
    "description": "Quản lý phân khu",
    "displayOrder": 1,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 136,
    "code": "NAVIGATION",
    "name": "Hệ thống dẫn đường",
    "parentId": 17,
    "url": "#",
    "icon": "",
    "active": true,
    "description": "Hệ thống dẫn đường",
    "displayOrder": 2,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 130,
    "code": "ACCESS_CONTROL_DOOR",
    "name": "Quản lý cửa",
    "parentId": 10,
    "url": "/access-control/door",
    "icon": "",
    "active": true,
    "description": "Quản lý cửa",
    "displayOrder": 3,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 131,
    "code": "AC_WARNING",
    "name": "Sự kiện",
    "parentId": 10,
    "url": "/access-control/event",
    "icon": "",
    "active": true,
    "description": "Sự kiện",
    "displayOrder": 4,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 132,
    "code": "AC_MONITOR",
    "name": "Giám sát",
    "parentId": 10,
    "url": "/access-control/event-dashboard",
    "icon": "",
    "active": true,
    "description": "Giám sát",
    "displayOrder": 4,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 133,
    "code": "A_C_DOOR_ACCESS",
    "name": "Truy cập cửa",
    "parentId": 132,
    "url": "/access-control/door-access",
    "icon": "",
    "active": true,
    "description": "Truy cập cửa",
    "displayOrder": 5,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 134,
    "code": "A_C_GROUP_ACCESS",
    "name": "Nhóm quyền truy cập",
    "parentId": 132,
    "url": "/access-control/group-access",
    "icon": "",
    "active": true,
    "description": "Nhóm quyền truy cập",
    "displayOrder": 6,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 146,
    "code": "AC_GROUP_USER",
    "name": "Quản lý nhóm người dùng",
    "parentId": 10,
    "url": "/access-control/group-user",
    "icon": "",
    "active": true,
    "description": "Quản lý nhóm người dùng",
    "displayOrder": 7,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 135,
    "code": "A_CONTROL_SCHEDULE",
    "name": "Quản lý lịch",
    "parentId": 10,
    "url": "/access-control/schedule",
    "icon": "",
    "active": true,
    "description": "Quản lý lịch",
    "displayOrder": 8,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 132,
    "code": "A_C_WARNING_MONITOR",
    "name": "Quản lý phân quyền truy cập",
    "parentId": 10,
    "url": "#",
    "icon": "",
    "active": true,
    "description": "Quản lý phân quyền truy cập",
    "displayOrder": 9,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 108,
    "code": "ACCESS_MANAGEMENT",
    "name": "Quản lý truy cập",
    "parentId": 12,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Quản lý truy cập",
    "displayOrder": 10,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 137,
    "code": "NAVI_MONITOR",
    "name": "Giám sát hành trình",
    "parentId": 136,
    "url": "/navigation",
    "icon": "",
    "active": true,
    "description": "Giám sát hành trình",
    "displayOrder": 12,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 138,
    "code": "MAP_LOCATION",
    "name": "Quản lý điểm",
    "parentId": 136,
    "url": "/navigation/point",
    "icon": "",
    "active": true,
    "description": "Quản lý điểm",
    "displayOrder": 13,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 139,
    "code": "PARKING",
    "name": "Bãi gửi xe",
    "parentId": 24,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Bãi gửi xe",
    "displayOrder": 43,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 140,
    "code": "MAP_IN_DOOR",
    "name": "Thông tin bản đồ",
    "parentId": 139,
    "url": "/parking/map-indoor",
    "icon": "string",
    "active": true,
    "description": "Thông tin bản đồ",
    "displayOrder": 44,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 141,
    "code": "APP_MANAGEMENTS",
    "name": "Quản trị App",
    "parentId": 17,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Quản trị App",
    "displayOrder": 45,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 142,
    "code": "OFFICE_RENTAL",
    "name": "Quản lý thuê văn phòng",
    "parentId": 141,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Quản lý thuê văn phòng",
    "displayOrder": 46,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 143,
    "code": "OFFICE_RENTAL_CONFIG",
    "name": "Cấu hình",
    "parentId": 142,
    "url": "/office-rental/config",
    "icon": "string",
    "active": true,
    "description": "Cấu hình",
    "displayOrder": 47,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 144,
    "code": "OFFICE_LEASING",
    "name": "Tư vấn thuê",
    "parentId": 142,
    "url": "/office-rental/consulting",
    "icon": "string",
    "active": true,
    "description": "Tư vấn thuê",
    "displayOrder": 48,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 145,
    "code": "NEW_MANAGEMENTS",
    "name": "Quản lý tin tức",
    "parentId": 141,
    "url": "/management/app/new-management",
    "icon": "string",
    "active": true,
    "description": "Quản lý tin tức",
    "displayOrder": 49,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 103,
    "code": "CATEGORY_ROOM_LIST_1",
    "name": "Xem danh sách phòng họp",
    "parentId": 86,
    "url": "/meeting-room",
    "icon": "",
    "active": true,
    "description": "Xem danh sách phòng họp",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "1d684907-b20a-4090-818e-5bf1031c46da",
      "42f72c50-e33b-49f0-919c-ed09741fbe5b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 105,
    "code": "CATEGORY_MEETING",
    "name": "Xem danh sách lịch đặt phòng họp",
    "parentId": 86,
    "url": "/booking-room",
    "icon": "",
    "active": true,
    "description": "Xem danh sách lịch đặt phòng họp",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "1d684907-b20a-4090-818e-5bf1031c46da",
      "42f72c50-e33b-49f0-919c-ed09741fbe5b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db",
      "2f3f1afc-97dc-410f-bb14-56864f3723aa"
    ]
  },
  {
    "id": 40,
    "code": "CAMERA_AI_BLACK_LIST",
    "name": "Danh sách đen",
    "parentId": 28,
    "url": "/camera-ai/black-list",
    "icon": "string",
    "active": true,
    "description": "Danh sách đen",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 42,
    "code": "CAMERA_AI_CONFIG",
    "name": "Cấu hình",
    "parentId": 28,
    "url": "/camera-ai/configs",
    "icon": "string",
    "active": true,
    "description": "Cấu hình",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 90,
    "code": "GENERAL_MANA_UNIT",
    "name": "Đơn vị công ty",
    "parentId": 26,
    "url": "/department",
    "icon": "string",
    "active": true,
    "description": "Đơn vị công ty",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "62ab4d33-bea4-4ece-88a4-dc7ca62afad2",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 35,
    "code": "CAMERA_AI_EVENT",
    "name": "Danh sách sự kiện",
    "parentId": 28,
    "url": "/camera-ai/list-event",
    "icon": "string",
    "active": true,
    "description": "Danh sách sự kiện",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 36,
    "code": "CAMERA_AI_LF_PEOPLE",
    "name": "Tìm kiếm người",
    "parentId": 28,
    "url": "/camera-ai/list-user",
    "icon": "string",
    "active": true,
    "description": "Tìm kiếm người",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 37,
    "code": "CAMERA_AI_SF_OBJECTS",
    "name": "Tìm kiếm đồ vật",
    "parentId": 28,
    "url": "/camera-ai/list-item",
    "icon": "string",
    "active": true,
    "description": "Tìm kiếm đồ vật",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 41,
    "code": "CAMERA_AI_PROHIBITED",
    "name": "Danh sách khu vực cấm",
    "parentId": 28,
    "url": "/camera-ai/forbidden-area",
    "icon": "string",
    "active": true,
    "description": "Danh sách khu vực cấm",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 10,
    "code": "ACCESS_CONTROL",
    "name": "Access Control",
    "parentId": 17,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Access Control",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 6,
    "code": "CCTV_WARNINGS_LIST",
    "name": "Danh sach canh bao CCTV",
    "parentId": 2,
    "url": "/list-warning",
    "icon": null,
    "active": true,
    "description": "Danh sach canh bao CCTV",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 3,
    "code": "NVR_LIST",
    "name": "Danh sách NVR",
    "parentId": 2,
    "url": "/list-nvr",
    "icon": null,
    "active": true,
    "description": "Danh sách NVR",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 7,
    "code": "LIVE_VIEW_LIST",
    "name": "Xem truc tiep",
    "parentId": 2,
    "url": "/list-live-view",
    "icon": null,
    "active": true,
    "description": "Xem truc tiep",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 4,
    "code": "CAMERA_LIST",
    "name": "Danh sách Camera",
    "parentId": 2,
    "url": "/list-camera",
    "icon": null,
    "active": true,
    "description": "Danh sách Camera",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 8,
    "code": "Library",
    "name": "Thư viện",
    "parentId": 2,
    "url": "/library",
    "icon": "string",
    "active": true,
    "description": "Thư viện",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 9,
    "code": "CCTV_PLAYBACK",
    "name": "Xem lại",
    "parentId": 2,
    "url": "/playback-camera",
    "icon": "string",
    "active": true,
    "description": "Xem lại",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 2,
    "code": "CMS_OFFICE",
    "name": "Hệ thống CCTV",
    "parentId": 17,
    "url": "#",
    "icon": null,
    "active": true,
    "description": "Hệ thống CCTV",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 11,
    "code": "AC_DEVICES",
    "name": "Danh sách thiết bị",
    "parentId": 10,
    "url": "/access-control/devices",
    "icon": "",
    "active": true,
    "description": "Danh sách thiết bị",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 14,
    "code": "HOME",
    "name": "Trang chủ",
    "parentId": null,
    "url": "/",
    "icon": "string",
    "active": true,
    "description": "Trang chủ",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e9d9c3ab-ff8f-4e18-b11e-afe5051b3b1f",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "42f72c50-e33b-49f0-919c-ed09741fbe5b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db",
      "2f3f1afc-97dc-410f-bb14-56864f3723aa"
    ]
  },
  {
    "id": 17,
    "code": "SYSTEM_MANAGEMENT",
    "name": "Quản trị hệ thống",
    "parentId": null,
    "url": "#",
    "icon": null,
    "active": true,
    "description": "Quản trị hệ thống",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e9d9c3ab-ff8f-4e18-b11e-afe5051b3b1f",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 24,
    "code": "CATEGORY",
    "name": "Danh mục",
    "parentId": null,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Danh mục",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e9d9c3ab-ff8f-4e18-b11e-afe5051b3b1f",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "1d684907-b20a-4090-818e-5bf1031c46da",
      "42f72c50-e33b-49f0-919c-ed09741fbe5b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db",
      "2f3f1afc-97dc-410f-bb14-56864f3723aa"
    ]
  },
  {
    "id": 26,
    "code": "GENERAL_MANAGEMENT",
    "name": "Quản trị chung",
    "parentId": null,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Quản trị chung",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "95a1dda1-736b-4187-9412-7f2885320b15",
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "62ab4d33-bea4-4ece-88a4-dc7ca62afad2",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e9d9c3ab-ff8f-4e18-b11e-afe5051b3b1f",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 28,
    "code": "CAMERA_AI_SYSTEM",
    "name": "Hệ thống Camera AI",
    "parentId": 17,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Hệ thống Camera AI",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 91,
    "code": "GENERAL_MANA_ROLE",
    "name": "Danh sách vai trò",
    "parentId": 26,
    "url": "/list-policy",
    "icon": "string",
    "active": true,
    "description": "Danh sách vai trò",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 86,
    "code": "CATEGORY_ROOM",
    "name": "Phòng họp",
    "parentId": 24,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Phòng họp",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "1d684907-b20a-4090-818e-5bf1031c46da",
      "42f72c50-e33b-49f0-919c-ed09741fbe5b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db",
      "2f3f1afc-97dc-410f-bb14-56864f3723aa"
    ]
  },
  {
    "id": 89,
    "code": "GENERAL_MANA_USER",
    "name": "Người dùng",
    "parentId": 26,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Người dùng",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 107,
    "code": "GENERAL_USER_LIST",
    "name": "Danh sách người dùng",
    "parentId": 89,
    "url": "/user",
    "icon": "string",
    "active": true,
    "description": "Danh sách người dùng",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 94,
    "code": "AC_CONFIG_FLOOR",
    "name": "Phân tầng",
    "parentId": 108,
    "url": "/access-control/configs/floor",
    "icon": "",
    "active": true,
    "description": "Phân tầng",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 96,
    "code": "AC_CONFIG_GROUP",
    "name": "Phân nhóm",
    "parentId": 108,
    "url": "/access-control/configs/accessGroup",
    "icon": "",
    "active": true,
    "description": "Phân nhóm",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 95,
    "code": "AC_CONFIG_LEVEL",
    "name": "Phân cấp",
    "parentId": 108,
    "url": "/access-control/configs/accessLevel",
    "icon": "",
    "active": true,
    "description": "Phân cấp",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "e30d828e-c488-421e-bb75-f35ff17d5406",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 106,
    "code": "MANAGER_GUESTS",
    "name": "Quản lý khách",
    "parentId": 89,
    "url": "/manage-guests",
    "icon": "string",
    "active": true,
    "description": "Quản lý khách",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  }
];
const menuData2 = [
  {
    "id": 1,
    "code": "HOME",
    "name": "Trang chủ",
    "parentId": null,
    "url": "/",
    "icon": "string",
    "active": true,
    "description": "Trang chủ",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      
    ]
  },
  {
    "id": 2,
    "code": "ACCESS_CONTROL",
    "name": "Kiểm soát vào ra",
    "parentId": null,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Access Control",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 7,
    "code": "MANAGER_GUESTS",
    "name": "Quản lý khách",
    "parentId": null,
    "url": "/guest-registrations",
    "icon": "string",
    "active": true,
    "description": "Quản lý khách",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
      "3b77c456-33c9-4a09-a7aa-dfbea3609084",
      "658b6ef0-5879-4975-ac87-da044f782058",
      "ab73e85e-68b3-4d4d-a5a9-bfc3698ddfa0",
      "e1f462a1-5ff1-4f2d-ac71-13ce21a6550b",
      "f835b84c-d20d-4e6f-9f6f-f88f839a49cf",
      "b8066fb3-c58f-47bd-b8dc-3cffcca094db"
    ]
  },
  {
    "id": 3,
    "code": "Device_Intercom",
    "name": "Thiết bị Intercom",
    "parentId": null,
    "url": "#",
    "icon": "string",
    "active": true,
    "description": "Intercom",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 4,
    "code": "INTERCOM_UPGRATE",
    "name": "Upgrade Intercom",
    "parentId": null,
    "url": "#",
    "icon": "",
    "active": true,
    "description": "Upgrade Intercom",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 5,
    "code": "Logging",
    "name": "Logging",
    "parentId": null,
    "url": "#",
    "icon": "",
    "active": true,
    "description": "Logging",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 6,
    "code": "USER",
    "name": "Tài khoản",
    "parentId": null,
    "url": "/user",
    "icon": "",
    "active": true,
    "description": "Tài khoản",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 11,
    "code": "AC_DEVICES",
    "name": "Quản lý thiết bị",
    "parentId": 2,
    "url": "/access-control/devices",
    "icon": "",
    "active": true,
    "description": "Quản lý thiết bị",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 12,
    "code": "AC_CARDS",
    "name": "Quản lý thẻ",
    "parentId": 2,
    "url": "/card",
    "icon": "",
    "active": true,
    "description": "Quản lý thẻ",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 13,
    "code": "AC_WARNING",
    "name": "Sự kiện",
    "parentId": 2,
    "url": "/access-control/event",
    "icon": "",
    "active": true,
    "description": "Sự kiện",
    "displayOrder": 4,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 19,
    "code": "AC_MONITOR",
    "name": "Giám sát",
    "parentId": 2,
    "url": "/access-control/event-dashboard",
    "icon": "",
    "active": true,
    "description": "Giám sát",
    "displayOrder": 4,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": []
  },
  {
    "id": 14,
    "code": "AC_GROUP_USER",
    "name": "Quản lý nhóm người dùng",
    "parentId": 2,
    "url": "/access-control/group-user",
    "icon": "",
    "active": true,
    "description": "Quản lý nhóm người dùng",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 15,
    "code": "A_CONTROL_SCHEDULE",
    "name": "Quản lý lịch",
    "parentId": 2,
    "url": "/access-control/schedule",
    "icon": "",
    "active": true,
    "description": "Quản lý lịch",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 16,
    "code": "A_C_DOOR_ACCESS",
    "name": "Quyền truy cập cửa",
    "parentId": 2,
    "url": "/access-control/door-access",
    "icon": "",
    "active": true,
    "description": "Truy cập cửa",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 17,
    "code": "A_C_DOOR",
    "name": "Quản lý cửa",
    "parentId": 2,
    "url": "/access-control/door",
    "icon": "",
    "active": true,
    "description": "Quản lý cửa",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 18,
    "code": "A_C_GROUP_ACCESS",
    "name": "Nhóm quyền truy cập",
    "parentId": 2,
    "url": "/access-control/group-access",
    "icon": "",
    "active": true,
    "description": "Nhóm quyền truy cập",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 31,
    "code": "INTERCOM_SETTING",
    "name": "Cài đặt hệ thống",
    "parentId": 3,
    "url": "#",
    "icon": "",
    "active": true,
    "description": "Cài đặt hệ thống",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 31,
    "code": "INTERCOM_SERVER",
    "name": "Quản lý server",
    "parentId": 3,
    "url": "/intercom/servers",
    "icon": "",
    "active": true,
    "description": "Quản lý server",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 32,
    "code": "INTERCOM_DEVICE",
    "name": "Quản lý thiết bị intercom",
    "parentId": 3,
    "url": "/intercom/devices",
    "icon": "",
    "active": true,
    "description": "Quản lý thiết bị intercom",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 34,
    "code": "INTERCOM_REGISTER_HISTORY",
    "name": "Register History",
    "parentId": 5,
    "url": "/intercom/register-history",
    "icon": "",
    "active": true,
    "description": "Register History",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 35,
    "code": "INTERCOM_REGISTER_HISTORY",
    "name": "Call History",
    "parentId": 5,
    "url": "/intercom/call-history",
    "icon": "",
    "active": true,
    "description": "Call History",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 36,
    "code": "INTERCOM_REGISTER_HISTORY",
    "name": "Elevator History",
    "parentId": 5,
    "url": "/intercom/elevator-history",
    "icon": "",
    "active": true,
    "description": "Elevator History",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 37,
    "code": "INTERCOM_REGISTER_HISTORY",
    "name": "Import History",
    "parentId": 5,
    "url": "/intercom/import-history",
    "icon": "",
    "active": true,
    "description": "Import History",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  // {
  //   "id": 38,
  //   "code": "INTERCOM_ROOM_HISTORY",
  //   "name": "Room Status",
  //   "parentId": 5,
  //   "url": "/intercom/room",
  //   "icon": "",
  //   "active": true,
  //   "description": "Room status",
  //   "displayOrder": null,
  //   "functionality": {
  //     "create": "DISABLE",
  //     "read": "ACTIVE",
  //     "update": "DISABLE",
  //     "delete": "DISABLE",
  //     "notification": "DISABLE",
  //     "summary": "DISABLE"
  //   },
  //   "policyIds": [
  //   ]
  // },
  // {
  //   "id": 39,
  //   "code": "INTERCOM_DEBUG_HISTORY",
  //   "name": "Debug history",
  //   "parentId": 5,
  //   "url": "/intercom/debug",
  //   "icon": "",
  //   "active": true,
  //   "description": "Debug history",
  //   "displayOrder": null,
  //   "functionality": {
  //     "create": "DISABLE",
  //     "read": "ACTIVE",
  //     "update": "DISABLE",
  //     "delete": "DISABLE",
  //     "notification": "DISABLE",
  //     "summary": "DISABLE"
  //   },
  //   "policyIds": [
  //   ]
  // },
  // {
  //   "id": 39,
  //   "code": "INTERCOM_Crash_HISTORY",
  //   "name": "Crash history",
  //   "parentId": 5,
  //   "url": "/intercom/crash",
  //   "icon": "",
  //   "active": true,
  //   "description": "Crash history",
  //   "displayOrder": null,
  //   "functionality": {
  //     "create": "DISABLE",
  //     "read": "ACTIVE",
  //     "update": "DISABLE",
  //     "delete": "DISABLE",
  //     "notification": "DISABLE",
  //     "summary": "DISABLE"
  //   },
  //   "policyIds": [
  //   ]
  // },
  // {
  //   "id": 391,
  //   "code": "INTERCOM_3rdSystem_HISTORY",
  //   "name": "3rdSystem history",
  //   "parentId": 5,
  //   "url": "/intercom/third_system",
  //   "icon": "",
  //   "active": true,
  //   "description": "3rdSystem history",
  //   "displayOrder": null,
  //   "functionality": {
  //     "create": "DISABLE",
  //     "read": "ACTIVE",
  //     "update": "DISABLE",
  //     "delete": "DISABLE",
  //     "notification": "DISABLE",
  //     "summary": "DISABLE"
  //   },
  //   "policyIds": [
  //   ]
  // },
  // {
  //   "id": 392,
  //   "code": "INTERCOM_citizen_HISTORY",
  //   "name": "citizen history",
  //   "parentId": 5,
  //   "url": "/intercom/citizen",
  //   "icon": "",
  //   "active": true,
  //   "description": "citizen history",
  //   "displayOrder": null,
  //   "functionality": {
  //     "create": "DISABLE",
  //     "read": "ACTIVE",
  //     "update": "DISABLE",
  //     "delete": "DISABLE",
  //     "notification": "DISABLE",
  //     "summary": "DISABLE"
  //   },
  //   "policyIds": [
  //   ]
  // },
  {
    "id": 42,
    "code": "App_upgrade",
    "name": "App upgrade",
    "parentId": 4,
    "url": "/upgrade/app",
    "icon": "",
    "active": true,
    "description": "App upgrade",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 41,
    "code": "App_management",
    "name": "App management",
    "parentId": 4,
    "url": "/upgrade/app_management",
    "icon": "",
    "active": true,
    "description": "App management",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 43,
    "code": "App_firmware_management",
    "name": "Firmware management",
    "parentId": 4,
    "url": "/upgrade/firmware_management",
    "icon": "",
    "active": true,
    "description": "App management",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
  {
    "id": 44,
    "code": "firmware_upgrade",
    "name": "Firmware upgrade",
    "parentId": 4,
    "url": "/upgrade/firmware",
    "icon": "",
    "active": true,
    "description": "Firmware upgrade",
    "displayOrder": null,
    "functionality": {
      "create": "DISABLE",
      "read": "ACTIVE",
      "update": "DISABLE",
      "delete": "DISABLE",
      "notification": "DISABLE",
      "summary": "DISABLE"
    },
    "policyIds": [
    ]
  },
];
export default menuData;

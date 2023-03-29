/*
 *
 * CamAiConfigHumanFaceModule constants
 *
 */

export const DEFAULT_ACTION = 'app/CamAiConfigMissingItemModule/DEFAULT_ACTION';

export const FAKE_DATA = {
  name: 'Tester',
  versionFile: {
    name: 'vsmmissingitem_new',
    id: '60dc28b73b7822001d8cf815',
  },
  config:
    '{\n  "kmsdisplay": false,\n  "minio": {\n    "address": "http://10.150.100.125:9001",\n    "access_key": "admin",\n    "secret_key": "Abcd@123",\n    "id": "5fd1f112aa86460041bfc917",\n    "bucket": "humanreid"\n  },\n  "kafka": {\n    "address": "10.150.100.125:9092",\n    "topic_face": "FACE_REQUEST",\n    "topic_human": "HUMANS",\n    "topic_vinai": "FIGHT_EVENT",\n    "id": "609b7f08f4d635002954d65c"\n  },\n  "cam_infor": [\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.23:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.23",\n      "camId": "6092116f7fa475001d6e1697",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.22:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "drunk"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.22",\n      "camId": "609127e57d60e400630ed6da",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.24:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.24",\n      "camId": "609358c37fa475001d6e23d1",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.25:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.25",\n      "camId": "60951936a38ecd0024aa6c37",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.24:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "climb",\n        "weapon"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.24",\n      "camId": "609358c37fa475001d6e23d1",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.23:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.23",\n      "camId": "6092116f7fa475001d6e1697",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.22:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "drunk"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.22",\n      "camId": "609127e57d60e400630ed6da",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.24:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.24",\n      "camId": "609358c37fa475001d6e23d1",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.25:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "weapon",\n        "climb"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.25",\n      "camId": "60951936a38ecd0024aa6c37",\n      "model_detect": "ssdhumanface"\n    },\n    {\n      "modeProcess": 0,\n      "vinai": false,\n      "camUrl": "rtsp://admin:123456aA@10.150.100.24:554/Streaming/Channels/101",\n      "violentType": [\n        "fight",\n        "climb",\n        "weapon"\n      ],\n      "fps": 10,\n      "camName": "10.150.100.24",\n      "camId": "609358c37fa475001d6e23d1",\n      "model_detect": "ssdhumanface"\n    }\n  ],\n  "devconfig": {\n    "vsm_common": {\n      "debug": true,\n      "interval_process": 1,\n      "thread_pool_size": 5\n    },\n    "vsm_humanface": {\n      "acceptable_face_size": 50,\n      "acceptable_human_size": 50,\n      "acceptable_plate_size": 50,\n      "max_face": 6,\n      "max_human": 6\n    },\n    "vsm_camnet": {\n      "is_send_master": true,\n      "is_reduce_crop": true,\n      "max_cam_crop": 3\n    },\n    "vsm_traffic": {\n      "distance_2_wheel": 15,\n      "distance_4_wheel_small": 25,\n      "distance_4_wheel_big": 50,\n      "hold_track": 10,\n      "request_check_plate": false,\n      "draw": false\n    },\n    "vsm_ptzcontrol": {\n      "use_cloud": true,\n      "draw": false,\n      "ratio_overlap": 0.85,\n      "lose_frame_del": 3,\n      "thesh_frame_exist": 10,\n      "violation_time": 300\n    },\n    "pipeline_config": {\n      "application": {\n        "enable-perf-measurement": 1,\n        "perf-measurement-interval-sec": 10\n      },\n      "ds-vsmplugin": {\n        "enable": 1,\n        "unique-id": 1,\n        "gpu-id": 0,\n        "plugin_type": "vsmplugins"\n      },\n      "source-attr-all": {\n        "enable": 1,\n        "select_rtp_protocol": 1\n      },\n      "tiled-display": {\n        "enable": 1,\n        "rows": 1,\n        "columns": 3,\n        "width": 1280,\n        "height": 720,\n        "gpu-id": 0\n      },\n      "streammux": {\n        "gpu-id": 0,\n        "batched-push-timeout": 40000,\n        "width": 1920,\n        "height": 1080\n      },\n      "osd": {\n        "enable": 1,\n        "gpu-id": 0,\n        "border-width": 3,\n        "text-size": 15,\n        "text-color": "1;1;1;1",\n        "text-bg-color": "0.3;0.3;0.3;1",\n        "font": "Arial"\n      },\n      "primary-gie": {\n        "enable": 1,\n        "gpu-id": 0,\n        "bbox-border-color0": "1;0;0;1",\n        "bbox-border-color1": "0;1;1;1",\n        "bbox-border-color2": "0;0;1;1",\n        "bbox-border-color3": "0;1;0;1",\n        "gie-unique-id": 1,\n        "batch-size": 10,\n        "interval": 4,\n        "model-engine-file": "../models/person_face_YOUR_KEY_25Nov/face_person_resnet18_detector_int8.etlt_b10_gpu0_int8.engine",\n        "config-file": "../models/person_face_YOUR_KEY_25Nov/infer_config.txt"\n      },\n      "sink": {\n        "enable": 0,\n        "type": 1,\n        "sync": 0,\n        "source-id": 0,\n        "gpu-id": 0\n      },\n      "tracker": {\n        "enable": 1,\n        "tracker-width": 640,\n        "tracker-height": 384,\n        "ll-lib-file": "/opt/nvidia/deepstream/deepstream-5.0/lib/libnvds_mot_klt.so",\n        "ll-config-file": "tracker_config.yml",\n        "gpu-id": 0,\n        "enable-batch-process": 1\n      }\n    }\n  }\n}',
  typeProcess: 'vsmmissingitem',
};
